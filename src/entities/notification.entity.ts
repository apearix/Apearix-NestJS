import { Column, Entity, Index } from 'typeorm';
import { BaseEntity } from './base.entity';

export enum NotificationCategory {
  ACTIVITY = 'activity',
  SYSTEM = 'system',
  SECURITY = 'security',
  BILLING = 'billing',
}

export enum NotificationPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent',
}

export interface NotificationActor {
  name: string;
  avatar?: string;
  initials?: string;
  role?: string;
}

export interface NotificationCta {
  label: string;
  href?: string;
  action?: string;
  variant?: 'primary' | 'secondary' | 'danger' | 'outline';
}

@Entity('notifications')
@Index(['user_id', 'read', 'created_at'])
@Index(['category', 'created_at'])
export class Notification extends BaseEntity {
  @Index()
  @Column({ type: 'uuid', nullable: true })
  user_id: string | null;

  @Column({ default: 'admin' })
  target_role: string;

  @Column()
  title: string;

  @Index()
  @Column({
    type: 'enum',
    enum: NotificationCategory,
    default: NotificationCategory.ACTIVITY,
  })
  category: NotificationCategory;

  @Column({
    type: 'enum',
    enum: NotificationPriority,
    default: NotificationPriority.LOW,
  })
  priority: NotificationPriority;

  @Column()
  action: string;

  @Column({ nullable: true })
  target: string;

  @Column({ nullable: true })
  target_url: string;

  @Column({ type: 'text' })
  snippet: string;

  @Column({ type: 'jsonb', nullable: true })
  actor: NotificationActor | null;

  @Column({ type: 'jsonb', nullable: true })
  cta: NotificationCta | null;

  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, any> | null;

  @Index()
  @Column({ default: false })
  read: boolean;

  @Column({ type: 'timestamp', nullable: true })
  read_at: Date | null;

  @Column({ type: 'int', nullable: true })
  group_count: number | null;

  @Column({ type: 'simple-array', nullable: true })
  group_actors: string[] | null;
}
