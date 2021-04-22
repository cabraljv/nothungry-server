import { getRepository } from 'typeorm';

import Order from '../models/Order';

interface IResponse {
  status: number;
  error?: string;
  order?: string;
}

export async function createOrder(
  user_whatsapp: string,
  rest_id: string,
): Promise<IResponse> {
  const orderRepo = getRepository(Order);

  try {
    const order = orderRepo.create();

    await orderRepo.save(order);
    return { status: 201, order: order.id };
  } catch (error) {
    console.log(error);
    return { status: 500, error: 'Erro ao criar pedido' };
  }
}
