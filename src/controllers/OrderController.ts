import { subDays } from 'date-fns';
import { Request, Response } from 'express';
import { getRepository, MoreThan } from 'typeorm';
import * as Yup from 'yup';

import Additions from '../models/Additions';
import Order from '../models/Order';
import Product from '../models/Product';
import ProductOrder from '../models/ProductOrder';
import { createOrder } from '../services/Order';

class OrderController {
  async index(req: Request, res: Response) {
    const orderRepo = getRepository(Order);
    const orders = await orderRepo
      .createQueryBuilder('order')
      .where({
        restaurant: req.userId,
        concluided: false,
        accepted: true,
        sended: true,
        denied: false,
      })
      .leftJoinAndSelect('order.products', 'productOrders')
      .leftJoinAndSelect('productOrders.product', 'product')
      .leftJoinAndSelect('productOrders.additions', 'additions')
      .select([
        'order.adress',
        'order.reference',
        'product.name',
        'productOrders.id',
        'product.id',
        'additions.description',
        'additions.id',
        'order.id',
        'order.observation',
        'order.updated_at',
        'order.total',
        'order.payment_method',
        'order.accepted',
        'order.reciver',
      ])
      .getMany();
    const pendingOrders = await orderRepo
      .createQueryBuilder('order')
      .where({
        restaurant: req.userId,
        concluided: false,
        accepted: false,
        denied: false,
        sended: true,
        created_at: MoreThan(subDays(new Date(), 1)),
      })
      .leftJoinAndSelect('order.products', 'productOrders')
      .leftJoinAndSelect('productOrders.product', 'product')
      .leftJoinAndSelect('productOrders.additions', 'additions')
      .select([
        'order.adress',
        'order.reference',
        'product.name',
        'productOrders.id',
        'product.id',
        'additions.description',
        'additions.id',
        'order.id',
        'order.observation',
        'order.updated_at',
        'order.total',
        'order.payment_method',
        'order.accepted',
        'order.reciver',
      ])
      .getMany();
    return res.json({ orders, pendingOrders });
  }

  async store(req: Request, res: Response) {
    const schema = Yup.object().shape({
      reciver: Yup.string().required(),
      adress: Yup.string().required(),
      observation: Yup.string(),
      reference: Yup.string(),
      restaurant: Yup.string().required(),
      payment_method: Yup.number().required(),
      products: Yup.array().required(),
    });
    try {
      await schema.validate(req.body);
    } catch (error) {
      return res.status(400).json({ error: error.errors });
    }

    const orderRepo = getRepository(Order);
    const {
      restaurant,
      reciver,
      adress,
      observation,
      reference,
      payment_method,
      products,
    } = req.body;

    const productsRepo = getRepository(Product);
    const productOrderRepo = getRepository(ProductOrder);
    const additionsRepo = getRepository(Additions);

    const order = await orderRepo.save(
      orderRepo.create({
        restaurant,
        adress,
        reference,
        reciver,
        observation: observation || '',
        payment_method,
      }),
    );

    const products_db: ProductOrder[] = await Promise.all(
      products.map(
        async (item: { id_product: string; additions: string[] }) => {
          const product = await productsRepo.findOne({
            where: { id: item.id_product },
          });
          const additions_db = await Promise.all(
            item.additions.map(async item2 =>
              additionsRepo.findOne({
                where: { id: item2 },
              }),
            ),
          );
          const productOrder = productOrderRepo.create({
            product,
            order,
          });
          productOrder.additions = additions_db;
          return productOrderRepo.save(productOrder);
        },
      ),
    );
    let total = 0;
    products_db.forEach(item => {
      if (typeof item.product === 'string') return;
      total += item.product.price;
      item.additions.forEach(item2 => {
        if (typeof item2 === 'string') return;
        total += item2.price;
      });
    });

    try {
      if (!order) {
        return res.status(404).json({ error: 'This order not exists' });
      }
      if (order.sended) {
        return res.status(401).json({ error: 'This order cant be changed' });
      }
      order.sended = true;
      order.denied = false;
      order.accepted = false;
      order.total = total;
      order.created_at = new Date();
      const savedOrder = await orderRepo.save(order);
      if (typeof savedOrder.restaurant !== 'string') {
        const restaurantSocketId =
          req.connectedClients[savedOrder.restaurant.id];

        req.io.to(restaurantSocketId).emit('newOrder', savedOrder);
      }

      return res.json(savedOrder);
    } catch (error) {
      return res.status(500).json({ error });
    }
  }

  async forceCreate(req: Request, res: Response) {
    const order = await createOrder(req.body.phone, req.body.restaurant);
    return res.json(order);
  }

  async show(req: Request, res: Response) {
    const { id } = req.params;
    const orderRepo = getRepository(Order);

    const order = await orderRepo.findOne({ id });

    return res.json(order);
  }
}

export default new OrderController();
