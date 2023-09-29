import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm';

@Entity()
export class PercentageDiscountPromotion extends BaseEntity {
  @PrimaryGeneratedColumn()
  promotion_id?: number;

  @Column({ type: 'varchar', length: 255, nullable: false })
  promotion_name!: string;

  @Column({ type: 'double', nullable: false })
  minimum_amount!: number;

  @Column({ type: 'decimal', nullable: false })
  discount_percentage!: number;

  constructor(partial: Partial<PercentageDiscountPromotion>) {
    super();
    Object.assign(this, partial);
  }
}
