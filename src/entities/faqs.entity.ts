import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { BaseEntity } from './base.entity';
import { Category } from './categories.entity';

@Entity('faqs')
export class Faq extends BaseEntity {
  @Column({ length: 300 })
  question: string;

  @Column({ type: 'text' })
  answer: string;

  @Index()
  @Column({ type: 'uuid', name: 'category_id', nullable: true })
  category_id: string | null;

  @ManyToOne(() => Category, (category) => category.faqs, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  @JoinColumn({ name: 'category_id' })
  category: Category | null;

  @Column({ type: 'int', default: 0 })
  order: number;

  @Index()
  @Column({ name: 'is_active', default: true })
  is_active: boolean;
}
