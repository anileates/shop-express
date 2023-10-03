import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm';
import _ from 'lodash';

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

  // This method is used to build the entity from the request body
  public build(data: Partial<PercentageDiscountPromotion>) {
    _.omit(data, ['promotion_id']);
    Object.assign(this, data);
  }
}
