import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, IsNull } from 'typeorm';
import { CategoryType } from '../../entities';
import { CreateCategoryTypeDto } from './dto/create-category-types.dto';
import { UpdateCategoryTypeDto } from './dto/update-category-types.dto';

@Injectable()
export class CategoryTypesService implements OnModuleInit {
  constructor(@InjectRepository(CategoryType) private readonly repo: Repository<CategoryType>) {}

  async onModuleInit() {
    try {
      // Fix missing slugs
      const itemsWithoutSlug = await this.repo.find({ where: { slug: IsNull() } });
      for (const item of itemsWithoutSlug) {
        item.slug = this.generateSlug(item.name || item.id);
        await this.repo.save(item);
      }

      // Seed default category types if not present
      const defaultTypes = [
        { name: 'Blog Category', slug: 'blogs', description: 'Categories for Blogs and Articles' },
        { name: 'FAQ Category', slug: 'faqs', description: 'Categories for FAQs and Knowledge Base' },
        { name: 'Product Category', slug: 'products', description: 'Categories for Products' },
        { name: 'Service Category', slug: 'services', description: 'Categories for Services' },
      ];

      for (const def of defaultTypes) {
        const exists = await this.repo.findOne({ where: { slug: def.slug } });
        if (!exists) {
          await this.repo.save(this.repo.create({ ...def, is_active: true }));
        }
      }
    } catch (_e) {
      // Ignore initial boot errors if table is not yet created
    }
  }

  private generateSlug(name: string): string {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/[\s_]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  async create(dto: CreateCategoryTypeDto) {
    const slug = dto.slug && dto.slug.trim() ? dto.slug.trim() : this.generateSlug(dto.name);
    const item = this.repo.create({
      ...dto,
      slug,
      is_active: dto.is_active !== undefined ? dto.is_active : true,
    });
    return await this.repo.save(item);
  }

  async findAll() {
    return await this.repo.find({ order: { created_at: 'DESC' } });
  }

  async findOne(id: string) {
    const item = await this.repo.findOne({ where: { id } });
    if (!item) throw new NotFoundException('Category Type not found');
    return item;
  }

  async update(id: string, dto: UpdateCategoryTypeDto) {
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
    return { success: true, message: 'Category Type deleted successfully' };
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
    const created: CategoryType[] = [];
    for (const raw of items) {
      if (!raw.name) continue;
      const slug = raw.slug && raw.slug.trim() ? raw.slug.trim() : this.generateSlug(raw.name);
      const item = this.repo.create({
        name: raw.name,
        slug,
        description: raw.description || '',
        is_active: raw.is_active !== undefined ? Boolean(raw.is_active) : true,
      });
      const saved = await this.repo.save(item);
      created.push(saved);
    }
    return { success: true, count: created.length, items: created };
  }
}
