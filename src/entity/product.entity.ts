import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne, JoinColumn } from 'typeorm';
import { Category } from './category.entity';
import _ from 'lodash';

@Entity()
export class Product extends BaseEntity {
    @PrimaryGeneratedColumn()
    product_id?: number;

    @Column({ type: 'varchar', length: 255, nullable: false })
    title!: string;

    @Column({ type: 'int', nullable: false })
    category_id!: number;

    @ManyToOne(() => Category, category => category.category_id, { eager: true })
    @JoinColumn({ name: 'category_id' })
    category!: Category;

    @Column({ type: 'varchar', length: 255 })
    author!: string;

    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
    list_price!: number;

    @Column({ type: 'int', nullable: false, unsigned: true })
    stock_quantity!: number;

    public build(data: Partial<Product>) {
        _.omit(data, ['product_id']);
        Object.assign(this, data);
    }
}
