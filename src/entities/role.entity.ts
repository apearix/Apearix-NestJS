import { Column, Entity, OneToMany, Index } from 'typeorm';
import { BaseEntity } from './base.entity';
import { User } from './user.entity';

@Entity('roles')
export class Role extends BaseEntity {
  @Column({ unique: true })
  name: string;

  @Index()
  @Column({ unique: true })
  slug: string;

  @Column({ nullable: true })
  description: string;

  @OneToMany(() => User, (user) => user.role)
  users: User[];
}
