import { Entity, Column, Index, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from './base.entity';
import { User } from './user.entity';

export enum PageStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  ARCHIVED = 'archived',
}

@Entity('legal_pages')
export class LegalPage extends BaseEntity {
  @Column({ length: 150 })
  title: string;

  @Index()
  @Column({ unique: true, length: 160 })
  slug: string;

  @Column({ type: 'text', nullable: true })
  content: string;

  @Index()
  @Column({
    type: 'enum',
    enum: PageStatus,
    default: PageStatus.PUBLISHED,
  })
  status: PageStatus;

  // User Audit (Who last updated/created)
  @Index()
  @Column({ type: 'uuid', name: 'updated_by_id', nullable: true })
  updated_by_id: string | null;

  @ManyToOne(() => User, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'updated_by_id' })
  updated_by: User | null;

  @Column({ name: 'meta_title', length: 100, nullable: true })
  meta_title: string;

  @Column({ name: 'meta_description', length: 255, nullable: true })
  meta_description: string;

  @Column({ name: 'published_at', type: 'timestamptz', nullable: true })
  published_at: Date | null;
}
