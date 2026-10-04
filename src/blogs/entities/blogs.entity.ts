import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

export enum BlogStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  ARCHIVED = 'archived',
}

@Entity('blogs')
export class Blog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 200 })
  title: string;

  @Index()
  @Column({ length: 220, unique: true, nullable: true })
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

  @Column({ type: 'uuid', nullable: true })
  author_id: string;

  @ManyToOne(() => User, { onDelete: 'RESTRICT', nullable: true })
  @JoinColumn({ name: 'author_id' })
  author: User;

  @Column({ type: 'timestamp', nullable: true })
  published_at: Date | null;

  // SEO Fields (Normal columns are faster to index)
  @Column({ length: 60, nullable: true })
  meta_title: string;

  @Column({ length: 160, nullable: true })
  meta_description: string;

  @Column({ length: 500, nullable: true })
  canonical_url: string;

  // Audit Timestamps (Consistent snake_case)
  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deleted_at: Date | null;
}