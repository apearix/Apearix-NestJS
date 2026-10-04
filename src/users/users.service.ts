import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserStatus } from './entities/user.entity';
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

  private isValidUuid(id: string): boolean {
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
  }

  async create(createUserDto: CreateUserDto) {
    const { role_id, password, ...userData } = createUserDto;

    // Check if role exists by UUID, slug, or name
    let role: Role | null = null;
    if (role_id && role_id.trim() !== '') {
      if (this.isValidUuid(role_id)) {
        role = await this.roleRepository.findOne({ where: { id: role_id } });
      }
      if (!role) {
        role = await this.roleRepository.findOne({
          where: [{ slug: role_id }, { name: role_id }],
        });
      }
    }

    if (!role) {
      role = await this.roleRepository.findOne({ where: { slug: 'admin' } });
    }
    if (!role) {
      role = await this.roleRepository.findOne({ where: { slug: 'user' } });
    }
    if (!role) {
      role = await this.roleRepository.findOne({ where: {} });
    }

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

    const cleanedData: any = { ...userData };

    if (!cleanedData.phone || typeof cleanedData.phone !== 'string' || cleanedData.phone.trim() === '') {
      delete cleanedData.phone;
    } else {
      cleanedData.phone = cleanedData.phone.trim();
    }

    if (!cleanedData.last_name || typeof cleanedData.last_name !== 'string' || cleanedData.last_name.trim() === '') {
      delete cleanedData.last_name;
    } else {
      cleanedData.last_name = cleanedData.last_name.trim();
    }

    if (!cleanedData.avatar || typeof cleanedData.avatar !== 'string' || cleanedData.avatar.trim() === '') {
      delete cleanedData.avatar;
    } else {
      cleanedData.avatar = cleanedData.avatar.trim();
    }

    if (!cleanedData.dob || cleanedData.dob === '' || (typeof cleanedData.dob === 'string' && cleanedData.dob.trim() === '')) {
      delete cleanedData.dob;
    } else if (typeof cleanedData.dob === 'string') {
      const parsed = new Date(cleanedData.dob);
      if (!isNaN(parsed.getTime())) {
        cleanedData.dob = parsed;
      } else {
        delete cleanedData.dob;
      }
    }

    const newUser = this.userRepository.create({
      ...cleanedData,
      password: hashedPassword,
      role,
    });

    const savedUser = await this.userRepository.save((newUser as unknown) as User);
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
    if (!this.isValidUuid(id)) {
      throw new NotFoundException('User not found');
    }
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
    if (!this.isValidUuid(id)) {
      throw new NotFoundException('User not found');
    }
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

    if (role_id && role_id.trim() !== '') {
      let role: Role | null = null;
      if (this.isValidUuid(role_id)) {
        role = await this.roleRepository.findOne({ where: { id: role_id } });
      }
      if (!role) {
        role = await this.roleRepository.findOne({
          where: [{ slug: role_id }, { name: role_id }],
        });
      }
      if (!role) {
        throw new BadRequestException('Role not found');
      }
      user.role = role;
    }

    if ('phone' in updateData) {
      if (!updateData.phone || typeof updateData.phone !== 'string' || updateData.phone.trim() === '') {
        user.phone = null as any;
        delete updateData.phone;
      } else {
        updateData.phone = updateData.phone.trim();
      }
    }

    if ('last_name' in updateData) {
      if (!updateData.last_name || typeof updateData.last_name !== 'string' || updateData.last_name.trim() === '') {
        user.last_name = null as any;
        delete updateData.last_name;
      } else {
        updateData.last_name = updateData.last_name.trim();
      }
    }

    if ('avatar' in updateData) {
      if (!updateData.avatar || typeof updateData.avatar !== 'string' || updateData.avatar.trim() === '') {
        user.avatar = null as any;
        delete updateData.avatar;
      } else {
        updateData.avatar = updateData.avatar.trim();
      }
    }

    const rawDob = (updateData as any).dob;
    if ('dob' in updateData) {
      if (!rawDob || rawDob === '' || (typeof rawDob === 'string' && rawDob.trim() === '')) {
        user.dob = null as any;
        delete updateData.dob;
      } else if (typeof rawDob === 'string') {
        const parsed = new Date(rawDob);
        if (!isNaN(parsed.getTime())) {
          user.dob = parsed as any;
        } else {
          user.dob = null as any;
          delete updateData.dob;
        }
      }
    }

    // assign rest
    Object.assign(user, updateData);

    const updatedUser = (await this.userRepository.save(user)) as User;
    const { password: _, ...result } = updatedUser;
    return result;
  }

  async remove(id: string) {
    if (!this.isValidUuid(id)) {
      throw new NotFoundException('User not found');
    }
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
    const errors: any[] = [];

    for (const item of items) {
      try {
        const email = item.email ? String(item.email).trim().toLowerCase() : null;
        if (!email || !email.includes('@')) {
          errors.push({ item, error: 'Invalid or missing email' });
          continue;
        }

        const existingUser = await this.userRepository.findOne({ where: { email } });
        if (existingUser) {
          errors.push({ email, error: 'User with this email already exists' });
          continue;
        }

        let firstName = item.first_name || item.firstName;
        let lastName = item.last_name || item.lastName || '';
        if (!firstName && (item.name || item.fullName)) {
          const full = String(item.name || item.fullName).trim();
          const spaceIndex = full.indexOf(' ');
          if (spaceIndex > 0) {
            firstName = full.substring(0, spaceIndex);
            lastName = full.substring(spaceIndex + 1);
          } else {
            firstName = full;
          }
        }

        if (!firstName) {
          firstName = email.split('@')[0];
        }

        let role: Role | null = null;
        const rawRole = item.role_id || item.role || item.role_name || item.roleName;

        if (rawRole) {
          if (typeof rawRole === 'object' && rawRole !== null) {
            if (rawRole.id && this.isValidUuid(rawRole.id)) {
              role = await this.roleRepository.findOne({ where: { id: rawRole.id } });
            }
            if (!role && rawRole.name) {
              role = await this.roleRepository.findOne({
                where: [{ name: rawRole.name }, { slug: String(rawRole.name).toLowerCase() }],
              });
            }
            if (!role && rawRole.slug) {
              role = await this.roleRepository.findOne({ where: { slug: rawRole.slug } });
            }
          } else if (typeof rawRole === 'string') {
            const trimmed = rawRole.trim();
            if (this.isValidUuid(trimmed)) {
              role = await this.roleRepository.findOne({ where: { id: trimmed } });
            }
            if (!role) {
              role = await this.roleRepository.findOne({
                where: [
                  { slug: trimmed },
                  { slug: trimmed.toLowerCase() },
                  { name: trimmed },
                ],
              });
            }
          }
        }

        if (!role) {
          role = (await this.roleRepository.findOne({ where: { slug: 'user' } })) || defaultRole;
        }

        const rawPassword = item.password || 'Password@123';
        const hashedPassword = await bcrypt.hash(rawPassword, 10);

        let status = UserStatus.ACTIVE;
        if (item.status) {
          const s = String(item.status).toLowerCase();
          if (Object.values(UserStatus).includes(s as UserStatus)) {
            status = s as UserStatus;
          }
        }

        const phone = item.phone && String(item.phone).trim() ? String(item.phone).trim() : undefined;

        const newUser = this.userRepository.create({
          first_name: firstName,
          last_name: lastName,
          email,
          phone,
          avatar: item.avatar || undefined,
          dob: item.dob || undefined,
          status,
          password: hashedPassword,
          role: role || undefined,
        });

        const saved = (await this.userRepository.save(newUser)) as User;
        const { password: _, ...result } = saved;
        created.push(result);
      } catch (err: any) {
        errors.push({ item, error: err.message || 'Failed to create user' });
      }
    }

    return {
      success: true,
      count: created.length,
      items: created,
      errors: errors.length > 0 ? errors : undefined,
    };
  }
}
