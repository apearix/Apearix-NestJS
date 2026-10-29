import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  Index,
} from 'typeorm';
import { BaseEntity } from './base.entity';
import { Role } from './role.entity';

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
  BLOCKED = 'blocked',
}

@Entity('users')
export class User extends BaseEntity {
  @Column()
  first_name: string;

  @Column({ nullable: true })
  last_name: string;

  @Index()
  @Column({ unique: true })
  email: string;

  @Index()
  @Column({ unique: true, nullable: true })
  phone: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  avatar: string;

  @Column({ type: 'date', nullable: true })
  dob: Date;

  @Index()
  @Column({ type: 'enum', enum: UserStatus, default: UserStatus.ACTIVE })
  status: UserStatus;

  @Column({ type: 'timestamp', nullable: true })
  last_login_at: Date;

  @Index()
  @Column({ type: 'uuid', name: 'role_id' })
  role_id: string;

  @ManyToOne(() => Role, (role) => role.users, { onDelete: 'RESTRICT', nullable: false })
  @JoinColumn({ name: 'role_id' })
  role: Role;
}
