import { BaseEntity, Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

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
}