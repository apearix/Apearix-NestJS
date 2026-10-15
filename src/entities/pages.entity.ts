import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

export enum PageStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  ARCHIVED = 'archived',
}

@Entity('legal_pages')
export class LegalPage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 150 })
  title: string;

  @Column({ unique: true, length: 150, nullable: true })
  slug: string;

  // MediumText/LongText or Text depending on DB, HTML content can be large
  @Column({ type: 'text', nullable: true })
  content: string;

  @Column({
    type: 'enum',
    enum: PageStatus,
    default: PageStatus.PUBLISHED,
  })
  status: PageStatus;

  @Column({ name: 'meta_title', length: 100, nullable: true })
  meta_title: string;

  @Column({ name: 'meta_description', length: 255, nullable: true })
  meta_description: string;

  @Column({ name: 'published_at', type: 'timestamp', nullable: true })
  published_at: Date;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deleted_at: Date;
}
