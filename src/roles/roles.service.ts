import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Role } from './entities/role.entity';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  private generateSlug(name: string): string {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }

  async create(createRoleDto: CreateRoleDto) {
    const slug = createRoleDto.slug || this.generateSlug(createRoleDto.name);
    
    // Check if role name or slug already exists
    const existing = await this.roleRepository.findOne({
      where: [{ name: createRoleDto.name }, { slug }],
    });
    if (existing) {
      throw new BadRequestException('Role name or slug already exists');
    }

    const role = this.roleRepository.create({
      ...createRoleDto,
      slug,
    });
    return await this.roleRepository.save(role);
  }

  async findAll() {
    return await this.roleRepository.find({
      relations: { users: true },
      order: { created_at: 'DESC' },
    });
  }

  async findOne(id: string) {
    const role = await this.roleRepository.findOne({
      where: { id },
      relations: { users: true },
    });
    if (!role) throw new NotFoundException('Role not found');
    return role;
  }

  async update(id: string, updateRoleDto: UpdateRoleDto) {
    const role = await this.findOne(id);

    if (updateRoleDto.name && !updateRoleDto.slug) {
      updateRoleDto.slug = this.generateSlug(updateRoleDto.name);
    }

    Object.assign(role, updateRoleDto);
    return await this.roleRepository.save(role);
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.roleRepository.softDelete(id);
    return { success: true, message: 'Role deleted' };
  }

  async bulkDelete(ids: string[]) {
    if (!ids || ids.length === 0) return { success: true, count: 0 };
    await this.roleRepository.softDelete(ids);
    return { success: true, count: ids.length };
  }

  async bulkImport(items: any[]) {
    const created: Role[] = [];
    for (const item of items) {
      if (!item.name) continue;
      const slug = item.slug || this.generateSlug(item.name);
      
      const existing = await this.roleRepository.findOne({
        where: [{ name: item.name }, { slug }],
      });
      if (existing) continue;

      const newRole = this.roleRepository.create({
        name: item.name,
        slug,
        description: item.description || '',
      });
      const saved = await this.roleRepository.save(newRole);
      created.push(saved);
    }
    return { success: true, count: created.length, items: created };
  }
}
