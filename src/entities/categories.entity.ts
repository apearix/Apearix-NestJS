import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  Index,
} from 'typeorm';
import { CategoryType } from './category-types.entity';

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 150 })
  name: string;

  @Index()
  @Column({ length: 160, unique: true, nullable: true })
  slug: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'text', nullable: true })
  icon_or_image: string;

  @Column({ type: 'int', default: 0 })
  order: number;

  @Column({ name: 'is_active', default: true })
  is_active: boolean;

  // Relation with CategoryType
  @Column({ type: 'uuid', name: 'category_type_id', nullable: true })
  category_type_id: string;

  @ManyToOne(() => CategoryType, (type) => type.categories, { onDelete: 'RESTRICT', nullable: true })
  @JoinColumn({ name: 'category_type_id' })
  category_type: CategoryType;

  // Self-Referencing Relation for Subcategories (Optional Hierarchy)
  @Column({ type: 'uuid', name: 'parent_id', nullable: true })
  parent_id: string;

  @ManyToOne(() => Category, (cat) => cat.children, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'parent_id' })
  parent: Category;

  @OneToMany(() => Category, (cat) => cat.parent)
  children: Category[];

  // SEO fields
  @Column({ name: 'meta_title', length: 100, nullable: true })
  meta_title: string;

  @Column({ name: 'meta_description', length: 255, nullable: true })
  meta_description: string;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deleted_at: Date;
}
