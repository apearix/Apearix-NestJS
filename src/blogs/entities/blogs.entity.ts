import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('blogs')
export class Blog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 200, nullable: true })
  title: string;

  @Column({ length: 220, nullable: true })
  slug: string;

  @Column({ default: false })
  is_manual_slug: boolean;

  @Column('text', { nullable: true })
  excerpt: string;

  @Column('text', { nullable: true })
  content: string;

  @Column('text', { nullable: true })
  featured_image: string;

  @Column('jsonb', { nullable: true })
  publishing: {
    status: string;
    author_id: string;
    published_at?: string | null;
  };

  @Column('jsonb', { nullable: true })
  seo: {
    meta_title?: string;
    meta_description?: string;
    canonical_url?: string;
  };

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
