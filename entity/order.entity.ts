import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne, JoinColumn } from 'typeorm';
import { FreeProductPromotion } from './freeProductPromotion.entity';
import { PercentageDiscountPromotion } from './percentageDiscountPromotion.entity';

@Entity()
export class Order extends BaseEntity {
    @PrimaryGeneratedColumn()
    order_id?: number;

    @Column({ type: 'varchar', length: 255, nullable: false })
    customer_name!: string;

    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
    total_amount!: number;

    @Column({ type: 'double', nullable: false })
    charged_shipping_price!: number;

    @Column({ type: 'int', nullable: true })
    free_product_promotion_id!: number;

    @Column({ type: 'int', nullable: true })
    percentage_discount_promotion_id!: number;

    @ManyToOne(() => FreeProductPromotion, { eager: true })
    @JoinColumn({ name: 'free_product_promotion_id' })
    free_product_promotion!: FreeProductPromotion;

    @ManyToOne(() => PercentageDiscountPromotion, { eager: true })
    @JoinColumn({ name: 'percentage_discount_promotion_id' })
    percentage_discount_promotion!: PercentageDiscountPromotion;

    constructor(partial: Partial<Order>) {
        super();
        Object.assign(this, partial);
    }
}
