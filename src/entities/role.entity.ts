import { Column, Entity, OneToMany, Index } from 'typeorm';
import { BaseEntity } from './base.entity';
import { User } from './user.entity';

@Entity('roles')
export class Role extends BaseEntity {
  @Column({ unique: true, length: 50 })
  name: string;

  @Index()
  @Column({ unique: true, length: 50 })
  slug: string;

  @Column({ nullable: true })
  description: string;

  @OneToMany(() => User, (user) => user.role)
  users: User[];
}
