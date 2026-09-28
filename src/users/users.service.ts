import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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
        status: true,
        created_at: true,
      },
      relations: { role: true },
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
    
    if (password) {
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
}
