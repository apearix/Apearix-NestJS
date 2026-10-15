import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Category } from '../../entities';
import { CreateCategoryDto } from './dto/create-categories.dto';
import { UpdateCategoryDto } from './dto/update-categories.dto';

@Injectable()
export class CategoriesService {
  constructor(@InjectRepository(Category) private readonly repo: Repository<Category>) {}

  private generateSlug(name: string): string {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/[\s_]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  async create(dto: CreateCategoryDto) {
    const slug = dto.slug && dto.slug.trim() ? dto.slug.trim() : this.generateSlug(dto.name);
    const item = this.repo.create({
      ...dto,
      slug,
      is_active: dto.is_active !== undefined ? dto.is_active : true,
      order: dto.order !== undefined ? Number(dto.order) : 0,
    });
    return await this.repo.save(item);
  }

  async findAll() {
    return await this.repo.find({
      relations: { category_type: true, parent: true },
      order: { order: 'ASC', created_at: 'DESC' },
    });
  }

  async findOne(id: string) {
    const item = await this.repo.findOne({
      where: { id },
      relations: { category_type: true, parent: true },
    });
    if (!item) throw new NotFoundException('Category not found');
    return item;
  }

  async update(id: string, dto: UpdateCategoryDto) {
    const item = await this.findOne(id);
    if (dto.name && !dto.slug) {
      dto.slug = this.generateSlug(dto.name);
    }
    Object.assign(item, dto);
    return await this.repo.save(item);
  }

  async remove(id: string) {
    const item = await this.findOne(id);
    await this.repo.softRemove(item);
    return { success: true, message: 'Category deleted successfully' };
  }

  async bulkStatus(ids: string[], is_active: boolean) {
    if (!ids || ids.length === 0) return { success: true, count: 0 };
    const items = await this.repo.findBy({ id: In(ids) });
    for (const item of items) {
      item.is_active = is_active;
    }
    await this.repo.save(items);
    return { success: true, count: items.length };
  }

  async bulkDelete(ids: string[]) {
    if (!ids || ids.length === 0) return { success: true, count: 0 };
    const items = await this.repo.findBy({ id: In(ids) });
    await this.repo.softRemove(items);
    return { success: true, count: ids.length };
  }

  async bulkImport(items: any[]) {
    const created: Category[] = [];
    for (const raw of items) {
      if (!raw.name) continue;
      const slug = raw.slug && raw.slug.trim() ? raw.slug.trim() : this.generateSlug(raw.name);
      const item = this.repo.create({
        name: raw.name,
        slug,
        description: raw.description || '',
        icon_or_image: raw.icon_or_image || raw.image || '',
        order: raw.order !== undefined ? Number(raw.order) : 0,
        is_active: raw.is_active !== undefined ? Boolean(raw.is_active) : true,
        category_type_id: raw.category_type_id || undefined,
        parent_id: raw.parent_id || undefined,
        meta_title: raw.meta_title || '',
        meta_description: raw.meta_description || '',
      });
      const saved = await this.repo.save(item);
      created.push(saved);
    }
    return { success: true, count: created.length, items: created };
  }
}
