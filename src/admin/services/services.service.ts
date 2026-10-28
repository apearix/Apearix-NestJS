import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ServiceEntity } from '../../entities';
import { CreateServiceEntityDto } from './dto/create-services.dto';
import { UpdateServiceEntityDto } from './dto/update-services.dto';

@Injectable()
export class ServicesService {
  constructor(@InjectRepository(ServiceEntity) private readonly repo: Repository<ServiceEntity>) {}

  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/[\s_]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  async create(dto: CreateServiceEntityDto) {
    const slug = dto.slug && dto.slug.trim() ? dto.slug.trim() : this.generateSlug(dto.title);
    const is_active = dto.is_active !== undefined ? dto.is_active : (dto.isActive !== undefined ? dto.isActive : true);

    const service = this.repo.create({
      ...dto,
      slug,
      is_active,
    });
    return await this.repo.save(service);
  }

  async findAll() {
    return await this.repo.find({
      relations: { category: true },
      order: { created_at: 'DESC' },
    });
  }

  async findOne(id: string) {
    const item = await this.repo.findOne({
      where: { id },
      relations: { category: true },
    });
    if (!item) throw new NotFoundException('Service not found');
    return item;
  }

  async update(id: string, dto: UpdateServiceEntityDto) {
    const item = await this.findOne(id);
    if (dto.title && !dto.slug && !item.slug) {
      dto.slug = this.generateSlug(dto.title);
    }
    if (dto.isActive !== undefined && dto.is_active === undefined) {
      dto.is_active = dto.isActive;
    }
    Object.assign(item, dto);
    return await this.repo.save(item);
  }

  async remove(id: string) {
    const item = await this.findOne(id);
    await this.repo.softRemove(item);
    return { success: true, message: 'Deleted successfully' };
  }
}
