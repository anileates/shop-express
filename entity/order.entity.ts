import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne, JoinColumn, ManyToMany, JoinTable } from 'typeorm';
import { FreeProductPromotion } from './freeProductPromotion.entity';
import { PercentageDiscountPromotion } from './percentageDiscountPromotion.entity';
import _ from 'lodash';
import { Product } from './product.entity';

@Entity()
export class Order extends BaseEntity {
    @PrimaryGeneratedColumn()
    order_id?: number;

    @Column({ type: 'varchar', length: 255, nullable: false })
    customer_name!: string;

    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
    total_amount!: number;

    @Column({ type: 'int', nullable: false })
    shipping_price!: number;

    @ManyToMany(() => Product, { eager: true })
    @JoinTable()
    products!: Product[];

    @Column({ type: 'int', nullable: true })
    free_product_promotion_id?: number;

    @Column({ type: 'int', nullable: true })
    percentage_discount_promotion_id?: number;

    @ManyToOne(() => FreeProductPromotion, { eager: true })
    @JoinColumn({ name: 'free_product_promotion_id' })
    free_product_promotion?: FreeProductPromotion;

    @ManyToOne(() => PercentageDiscountPromotion, { eager: true })
    @JoinColumn({ name: 'percentage_discount_promotion_id' })
    percentage_discount_promotion?: PercentageDiscountPromotion;

    // Builder
    public build(data: Partial<Order>) {
        _.omit(data, ['order_id']);
        Object.assign(this, data);
    }
}
