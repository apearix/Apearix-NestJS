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
  @Column({ length: 100 })
  first_name: string;

  @Column({ length: 100, nullable: true })
  last_name: string;

  @Index()
  @Column({ unique: true, length: 150 })
  email: string;

  @Index()
  @Column({ unique: true, length: 30, nullable: true })
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

  @Column({ type: 'timestamptz', nullable: true })
  last_login_at: Date;

  @Index()
  @Column({ type: 'uuid', name: 'role_id' })
  role_id: string;

  @ManyToOne(() => Role, (role) => role.users, { onDelete: 'RESTRICT', nullable: false })
  @JoinColumn({ name: 'role_id' })
  role: Role;
}
