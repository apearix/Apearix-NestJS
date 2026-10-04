import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
  Index,
} from 'typeorm';
import { Category } from '../../categories/entities/categories.entity';

@Entity('category_types')
export class CategoryType {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  name: string; // e.g. "Blog Category", "FAQ Category"

  @Index()
  @Column({ length: 100, unique: true, nullable: true })
  slug: string; // e.g. "blogs", "faqs", "products"

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ name: 'is_active', default: true })
  is_active: boolean;

  @OneToMany(() => Category, (category) => category.category_type)
  categories: Category[];

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deleted_at: Date;
}