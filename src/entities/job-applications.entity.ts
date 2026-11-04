import { Entity, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Job } from './jobs.entity';

export enum ApplicationStatus {
  APPLIED = 'applied',
  REVIEWING = 'reviewing',
  SHORTLISTED = 'shortlisted',
  INTERVIEWING = 'interviewing',
  OFFERED = 'offered',
  HIRED = 'hired',
  REJECTED = 'rejected',
}

@Entity('job_applications')
export class JobApplication extends BaseEntity {
  @Index()
  @Column({ type: 'uuid' })
  job_id: string;

  @ManyToOne(() => Job, (job) => job.applications, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'job_id' })
  job: Job;

  @Column({ length: 120 })
  first_name: string;

  @Column({ length: 120 })
  last_name: string;

  @Index()
  @Column({ length: 160 })
  email: string;

  @Column({ length: 50, nullable: true })
  phone: string;

  @Column({ type: 'text' })
  resume_url: string;

  @Column({ length: 255, nullable: true })
  resume_filename: string;

  @Column({ length: 255, nullable: true })
  portfolio_url: string;

  @Column({ length: 255, nullable: true })
  linkedin_url: string;

  @Column({ length: 255, nullable: true })
  github_url: string;

  @Column({ type: 'text', nullable: true })
  cover_letter: string;

  @Column({ length: 50, nullable: true })
  current_ctc: string;

  @Column({ length: 50, nullable: true })
  expected_ctc: string;

  @Column({ length: 50, nullable: true })
  notice_period: string;

  @Index()
  @Column({
    type: 'enum',
    enum: ApplicationStatus,
    default: ApplicationStatus.APPLIED,
  })
  status: ApplicationStatus;

  @Column({ type: 'int', default: 0 })
  rating: number;

  @Column({ type: 'text', nullable: true })
  admin_notes: string;
}
