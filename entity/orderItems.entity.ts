import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { Product } from "./product.entity";
import { Order } from "./order.entity";

@Entity('order_item')
export class OrderItem extends BaseEntity {

    @PrimaryGeneratedColumn()
    id?: number;

    @Column({ type: 'int', nullable: false })
    order_id!: number;

    @Column({ type: 'int', nullable: false })
    product_id!: number;

    @Column({ type: 'int', nullable: false })
    quantity!: number;

    @ManyToOne(() => Product, product => product.product_id, { eager: true })
    @JoinColumn({ name: "product_id" })
    product!: Product;

    @ManyToOne(() => Order, order => order.order_id, { eager: true })
    @JoinColumn({ name: "order_id" })
    order!: Order;
}