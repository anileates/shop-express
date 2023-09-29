import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne, JoinColumn } from 'typeorm';
import { Category } from './category.entity';

@Entity()
export class Product extends BaseEntity {
    @PrimaryGeneratedColumn()
    product_id?: number;

    @Column({ type: 'varchar', length: 255, nullable: false })
    title!: string;

    @Column({ type: 'int', nullable: false })
    category_id!: number;
  
    @ManyToOne(() => Category, { eager: true })
    @JoinColumn({ name: 'category_id' })
    category!: Category;

    @Column({ type: 'varchar', length: 255 })
    author!: string;

    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
    list_price!: number;

    @Column({ type: 'int', nullable: false })
    stock_quantity!: number;
}