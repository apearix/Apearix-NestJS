import {
  Entity,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  Index,
} from 'typeorm';
import { BaseEntity } from './base.entity';
import { CategoryType } from './category-types.entity';
import { Faq } from './faqs.entity';
import { Blog } from './blogs.entity';
import { Product } from './products.entity';
import { ServiceEntity } from './services.entity';

@Entity('categories')
export class Category extends BaseEntity {
  @Column({ length: 150 })
  name: string;

  @Index()
  @Column({ length: 160, unique: true })
  slug: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'text', nullable: true })
  icon_or_image: string;

  @Column({ type: 'int', default: 0 })
  order: number;

  @Index()
  @Column({ name: 'is_active', default: true })
  is_active: boolean;

  // Relation with CategoryType
  @Index()
  @Column({ type: 'uuid', name: 'category_type_id', nullable: true })
  category_type_id: string | null;

  @ManyToOne(() => CategoryType, (type) => type.categories, { onDelete: 'RESTRICT', nullable: true })
  @JoinColumn({ name: 'category_type_id' })
  category_type: CategoryType | null;

  // Self-Referencing Relation for Subcategories (Optional Hierarchy)
  @Index()
  @Column({ type: 'uuid', name: 'parent_id', nullable: true })
  parent_id: string | null;

  @ManyToOne(() => Category, (cat) => cat.children, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'parent_id' })
  parent: Category | null;

  @OneToMany(() => Category, (cat) => cat.parent)
  children: Category[];

  // Reverse Relations
  @OneToMany(() => Faq, (faq) => faq.category)
  faqs: Faq[];

  @OneToMany(() => Blog, (blog) => blog.category)
  blogs: Blog[];

  @OneToMany(() => Product, (product) => product.category)
  products: Product[];

  @OneToMany(() => ServiceEntity, (service) => service.category)
  services: ServiceEntity[];

  // SEO fields
  @Column({ name: 'meta_title', length: 100, nullable: true })
  meta_title: string;

  @Column({ name: 'meta_description', length: 255, nullable: true })
  meta_description: string;
}
