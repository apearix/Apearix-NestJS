import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

@Entity('faqs')
export class Faq {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 300, nullable: true })
  question: string;

  @Column({ type: 'text', nullable: true })
  answer: string;

  @Column({ length: 50, nullable: true, default: 'general' })
  category: string;

  @Column({ type: 'int', default: 0, nullable: true })
  order: number;

  @Column({ name: 'is_active', default: true, nullable: true })
  is_active: boolean;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deleted_at: Date;
}