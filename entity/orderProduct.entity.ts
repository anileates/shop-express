import { Entity, PrimaryColumn, Column, BaseEntity, ManyToOne, JoinColumn } from 'typeorm';
import { Order } from './order.entity';
import { Product } from './product.entity';

/**
 * Siparis ve urunler arasindaki M to N iliskisini tutan tablo
 */
@Entity()
export class OrderProduct extends BaseEntity {
  @PrimaryColumn({ type: 'int', nullable: false })
  order_id!: number;

  @PrimaryColumn({ type: 'int', nullable: false })
  product_id!: number;

  @Column({ type: 'int', nullable: false })
  quantity!: number;

  @ManyToOne(() => Order, order => order.order_id)
  @JoinColumn({ name: 'order_id' })
  order!: Order;

  @ManyToOne(() => Product, product => product.product_id)
  @JoinColumn({ name: 'product_id' })
  product!: Product;

  constructor(partial: Partial<OrderProduct>) {
    super();
    Object.assign(this, partial);
  }
}
