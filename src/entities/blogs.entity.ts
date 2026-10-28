import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { BaseEntity } from './base.entity';
import { User } from './user.entity';
import { Category } from './categories.entity';

export enum BlogStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  ARCHIVED = 'archived',
}

@Entity('blogs')
export class Blog extends BaseEntity {
  @Column({ length: 200 })
  title: string;

  @Index()
  @Column({ length: 220, unique: true })
  slug: string;

  @Column({ default: false })
  is_manual_slug: boolean;

  @Column({ type: 'text', nullable: true })
  excerpt: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'text', nullable: true })
  featured_image: string;

  // Publishing
  @Index()
  @Column({
    type: 'enum',
    enum: BlogStatus,
    default: BlogStatus.DRAFT,
  })
  status: BlogStatus;

  // Category Link
  @Index()
  @Column({ type: 'uuid', name: 'category_id', nullable: true })
  category_id: string | null;

  @ManyToOne(() => Category, (category) => category.blogs, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  @JoinColumn({ name: 'category_id' })
  category: Category | null;

  // Author Link
  @Index()
  @Column({ type: 'uuid', name: 'author_id', nullable: true })
  author_id: string | null;

  @ManyToOne(() => User, { onDelete: 'RESTRICT', nullable: true })
  @JoinColumn({ name: 'author_id' })
  author: User | null;

  @Column({ name: 'published_at', type: 'timestamptz', nullable: true })
  published_at: Date | null;

  // SEO Fields
  @Column({ length: 100, nullable: true })
  meta_title: string;

  @Column({ length: 255, nullable: true })
  meta_description: string;

  @Column({ length: 500, nullable: true })
  canonical_url: string;
}
