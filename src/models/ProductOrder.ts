import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  JoinColumn,
  ManyToOne,
  ManyToMany,
  JoinTable,
} from 'typeorm';

import Additions from './Additions';
import Order from './Order';
import Product from './Product';

@Entity({ name: 'orders_products_products' })
class ProductOrder {
  @PrimaryGeneratedColumn('uuid')
  public id?: string;

  @ManyToOne(() => Order, order => order.products)
  @JoinColumn({ name: 'ordersId' })
  public order!: Order | string;

  @ManyToOne(() => Product, product => product.orders)
  @JoinColumn({ name: 'productsId' })
  public product!: Product | string;

  @ManyToMany(() => Additions)
  @JoinTable({
    name: 'additions_orders_orders',
  })
  public additions: Additions[] | string[];

  @Column()
  public created_at: Date;

  @Column()
  public updated_at: Date;
}

export default ProductOrder;
