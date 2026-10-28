import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../../entities';
import { CreateProductDto } from './dto/create-products.dto';
import { UpdateProductDto } from './dto/update-products.dto';

@Injectable()
export class ProductsService {
  constructor(@InjectRepository(Product) private readonly repo: Repository<Product>) {}

  private generateSlug(name: string): string {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/[\s_]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  async create(dto: CreateProductDto) {
    const slug = dto.slug && dto.slug.trim() ? dto.slug.trim() : this.generateSlug(dto.name);
    const is_active = dto.is_active !== undefined ? dto.is_active : (dto.isActive !== undefined ? dto.isActive : true);

    const product = this.repo.create({
      ...dto,
      slug,
      is_active,
    });
    return await this.repo.save(product);
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
    if (!item) throw new NotFoundException('Product not found');
    return item;
  }

  async update(id: string, dto: UpdateProductDto) {
    const item = await this.findOne(id);
    if (dto.name && !dto.slug && !item.slug) {
      dto.slug = this.generateSlug(dto.name);
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
