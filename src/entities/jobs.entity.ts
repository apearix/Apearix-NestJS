import { Entity, Column, OneToMany, Index } from 'typeorm';
import { BaseEntity } from './base.entity';
import { JobApplication } from './job-applications.entity';

export enum JobStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  CLOSED = 'closed',
  ARCHIVED = 'archived',
}

export enum JobType {
  FULL_TIME = 'Full-Time',
  PART_TIME = 'Part-Time',
  CONTRACT = 'Contract',
  INTERNSHIP = 'Internship',
}

export enum WorkplaceType {
  REMOTE = 'Remote',
  HYBRID = 'Hybrid',
  ON_SITE = 'On-Site',
}

@Entity('jobs')
export class Job extends BaseEntity {
  @Column({ length: 250 })
  title: string;

  @Index({ unique: true })
  @Column({ length: 260 })
  slug: string;

  @Index()
  @Column({ length: 100 })
  department: string;

  @Column({
    type: 'enum',
    enum: JobType,
    default: JobType.FULL_TIME,
  })
  job_type: JobType;

  @Column({
    type: 'enum',
    enum: WorkplaceType,
    default: WorkplaceType.REMOTE,
  })
  workplace_type: WorkplaceType;

  @Column({ length: 150, default: 'Remote' })
  location: string;

  @Column({ length: 100, nullable: true })
  experience_level: string;

  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true })
  salary_min: number | null;

  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true })
  salary_max: number | null;

  @Column({ length: 10, default: 'USD' })
  salary_currency: string;

  @Column({ default: false })
  is_salary_disclosed: boolean;

  @Column({ type: 'text' })
  overview: string;

  @Column({ type: 'jsonb', nullable: true })
  responsibilities: string[];

  @Column({ type: 'jsonb', nullable: true })
  requirements: string[];

  @Column({ type: 'jsonb', nullable: true })
  benefits: string[];

  @Index()
  @Column({
    type: 'enum',
    enum: JobStatus,
    default: JobStatus.PUBLISHED,
  })
  status: JobStatus;

  @Column({ default: false })
  is_featured: boolean;

  @Column({ default: 0 })
  order: number;

  @Column({ default: 0 })
  views_count: number;

  @Column({ type: 'timestamp with time zone', nullable: true })
  deadline: Date | null;

  @OneToMany(() => JobApplication, (application) => application.job, {
    cascade: true,
  })
  applications: JobApplication[];
}
