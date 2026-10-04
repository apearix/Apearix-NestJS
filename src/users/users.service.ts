import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { Role } from '../roles/entities/role.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const { role_id, password, ...userData } = createUserDto;

    // Check if role exists
    const role = await this.roleRepository.findOne({ where: { id: role_id } });
    if (!role) {
      throw new BadRequestException('Role not found');
    }

    // Check if email exists
    const existingUser = await this.userRepository.findOne({ where: { email: userData.email } });
    if (existingUser) {
      throw new BadRequestException('Email already in use');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = this.userRepository.create({
      ...userData,
      password: hashedPassword,
      role,
    });

    const savedUser = await this.userRepository.save(newUser);
    const { password: _, ...result } = savedUser;
    return result;
  }

  async findAll() {
    return await this.userRepository.find({
      select: {
        id: true,
        first_name: true,
        last_name: true,
        email: true,
        phone: true,
        avatar: true,
        dob: true,
        status: true,
        last_login_at: true,
        created_at: true,
        updated_at: true,
      },
      relations: { role: true },
      order: { created_at: 'DESC' },
    });
  }

  async findOne(id: string) {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: { role: true },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const { password, ...result } = user;
    return result;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.findOne({ 
      where: { id },
      relations: { role: true } 
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Admin validation: if user is admin, email cannot be changed
    const isAdmin = user.role?.slug === 'super-admin' || user.role?.slug === 'admin' || user.email === 'admin@apearix.com';
    
    if (isAdmin && updateUserDto.email && updateUserDto.email !== user.email) {
      throw new BadRequestException('Admin email cannot be changed');
    }

    const { role_id, password, ...updateData } = updateUserDto;
    
    if (password && password.trim() !== '') {
      user.password = await bcrypt.hash(password, 10);
    }

    if (role_id) {
      const role = await this.roleRepository.findOne({ where: { id: role_id } });
      if (!role) {
        throw new BadRequestException('Role not found');
      }
      user.role = role;
    }

    // assign rest
    Object.assign(user, updateData);

    const updatedUser = await this.userRepository.save(user);
    const { password: _, ...result } = updatedUser;
    return result;
  }

  async remove(id: string) {
    const user = await this.findOne(id); // ensures it exists
    await this.userRepository.softDelete(id);
    return { success: true, message: 'User deleted successfully' };
  }

  async bulkStatus(ids: string[], status: string) {
    if (!ids || ids.length === 0) return { success: true, count: 0 };
    const users = await this.userRepository.findBy({ id: In(ids) });
    for (const u of users) {
      u.status = status as any;
    }
    await this.userRepository.save(users);
    return { success: true, count: users.length };
  }

  async bulkDelete(ids: string[]) {
    if (!ids || ids.length === 0) return { success: true, count: 0 };
    await this.userRepository.softDelete(ids);
    return { success: true, count: ids.length };
  }

  async bulkImport(items: any[]) {
    const defaultRole = await this.roleRepository.findOne({ where: {} });
    const created: any[] = [];
    for (const item of items) {
      const roleId = item.role_id || (item.role ? item.role.id : null);
      let role = roleId ? await this.roleRepository.findOne({ where: { id: roleId } }) : null;
      if (!role && item.role?.name) {
        role = await this.roleRepository.findOne({ where: { name: item.role.name } });
      }
      if (!role) {
        role = defaultRole;
      }

      const existingUser = await this.userRepository.findOne({ where: { email: item.email } });
      if (existingUser) continue;

      const rawPassword = item.password || 'Password@123';
      const hashedPassword = await bcrypt.hash(rawPassword, 10);

      const newUser = this.userRepository.create({
        first_name: item.first_name,
        last_name: item.last_name || '',
        email: item.email,
        phone: item.phone || null,
        avatar: item.avatar || null,
        dob: item.dob || null,
        status: item.status || 'active',
        password: hashedPassword,
        role: role || undefined,
      });
      const saved = await this.userRepository.save(newUser);
      created.push(saved);
    }
    return { success: true, count: created.length, items: created };
  }
}
