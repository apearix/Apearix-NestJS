import { Entity, Column, OneToMany, Index } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Category } from './categories.entity';

@Entity('category_types')
export class CategoryType extends BaseEntity {
  @Column({ length: 100 })
  name: string; // e.g. "Blog Category", "FAQ Category", "Product Category", "Service Category"

  @Index()
  @Column({ length: 100, unique: true })
  slug: string; // e.g. "blogs", "faqs", "products", "services"

  @Column({ type: 'text', nullable: true })
  description: string;

  @Index()
  @Column({ name: 'is_active', default: true })
  is_active: boolean;

  @OneToMany(() => Category, (category) => category.category_type)
  categories: Category[];
}
