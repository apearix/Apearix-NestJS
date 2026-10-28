import { Entity, Column, Index, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Category } from './categories.entity';

@Entity('products')
export class Product extends BaseEntity {
  @Column({ length: 200 })
  name: string;

  @Index()
  @Column({ length: 220, unique: true })
  slug: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  price: number;

  @Column({ length: 100, nullable: true })
  sku: string;

  @Column({ type: 'text', nullable: true })
  image_or_thumbnail: string;

  @Index()
  @Column({ name: 'is_active', default: true })
  is_active: boolean;

  // Category Link
  @Index()
  @Column({ type: 'uuid', name: 'category_id', nullable: true })
  category_id: string | null;

  @ManyToOne(() => Category, (category) => category.products, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  @JoinColumn({ name: 'category_id' })
  category: Category | null;

  // SEO Fields
  @Column({ name: 'meta_title', length: 100, nullable: true })
  meta_title: string;

  @Column({ name: 'meta_description', length: 255, nullable: true })
  meta_description: string;
}
