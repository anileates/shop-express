import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm';
import _ from 'lodash';

@Entity()
export class Category extends BaseEntity {

  @PrimaryGeneratedColumn()
  category_id!: number;

  @Column({ type: 'varchar', length: 255, nullable: false })
  category_title!: string;

  public build(data: Partial<Category>) {
    _.omit(data, ['category_id']);
    Object.assign(this, data);
  }
}
