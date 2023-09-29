import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm';

@Entity()
export class Category extends BaseEntity {

  @PrimaryGeneratedColumn()
  category_id!: number;

  @Column({ type: 'varchar', length: 255, nullable: false })
  category_title!: string;

  constructor(partial: Partial<Category>) {
    super();
    Object.assign(this, partial);
  }
}
