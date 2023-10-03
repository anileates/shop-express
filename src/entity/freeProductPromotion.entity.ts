import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne, JoinColumn } from 'typeorm';
import { Product } from './product.entity';
import _ from 'lodash';

@Entity()
export class FreeProductPromotion extends BaseEntity {
  @PrimaryGeneratedColumn()
  promotion_id?: number;

  @Column({ type: 'varchar', length: 255, nullable: false })
  promotion_name!: string;

  @Column({ type: 'int', nullable: false })
  free_product_id!: number; // Geçerli ürünün IDsi

  @ManyToOne(() => Product, { eager: true })
  @JoinColumn({ name: 'free_product_id' })
  product!: Product;

  // Builder
  public build(data: Partial<FreeProductPromotion>) {
    _.omit(data, ['promotion_id']);
    Object.assign(this, data);
  }
}
