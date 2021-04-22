import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';

import ProductOrder from './ProductOrder';
import Restaurant from './Restaurant';

@Entity({ name: 'additions' })
class Additions {
  @PrimaryGeneratedColumn('uuid')
  public id?: string;

  @Column()
  public description: string;

  @Column()
  public price: number;

  @ManyToOne(() => Restaurant, restaurant => restaurant.additions)
  @JoinColumn({ name: 'restaurant_id' })
  public restaurant!: Restaurant | string;

  @ManyToMany(() => ProductOrder)
  @JoinTable({
    name: 'additions_orders_orders',
  })
  public ordersProducts: ProductOrder[];

  @Column()
  public created_at: Date;

  @Column()
  public updated_at: Date;
}

export default Additions;
