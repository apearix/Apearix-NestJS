import { Entity, Column, Index, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Category } from './categories.entity';

@Entity('services')
export class ServiceEntity extends BaseEntity {
  @Column({ length: 150 })
  title: string;

  @Index()
  @Column({ length: 170, unique: true })
  slug: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ nullable: true })
  icon: string;

  @Column({ type: 'text', nullable: true })
  featured_image: string;

  @Index()
  @Column({ name: 'is_active', default: true })
  is_active: boolean;

  // Category Link
  @Index()
  @Column({ type: 'uuid', name: 'category_id', nullable: true })
  category_id: string | null;

  @ManyToOne(() => Category, (category) => category.services, {
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
