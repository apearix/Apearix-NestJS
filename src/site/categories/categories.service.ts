import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../../entities';

@Injectable()
export class SiteCategoriesService {
  constructor(@InjectRepository(Category) private readonly repo: Repository<Category>) {}

  private isValidUuid(str: string): boolean {
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);
  }

  async findAllActive(query: { type?: string; parent_id?: string }) {
    const qb = this.repo
      .createQueryBuilder('category')
      .leftJoinAndSelect('category.category_type', 'category_type')
      .leftJoinAndSelect('category.parent', 'parent')
      .leftJoinAndSelect('category.children', 'children', 'children.is_active = :childActive', {
        childActive: true,
      })
      .where('category.is_active = :isActive', { isActive: true })
      .orderBy('category.order', 'ASC')
      .addOrderBy('category.created_at', 'DESC');

    if (query.type && query.type.trim()) {
      const t = query.type.trim();
      if (this.isValidUuid(t)) {
        qb.andWhere('category.category_type_id = :typeId', { typeId: t });
      } else {
        qb.andWhere('LOWER(category_type.slug) = LOWER(:typeSlug)', { typeSlug: t });
      }
    }

    if (query.parent_id && query.parent_id.trim()) {
      qb.andWhere('category.parent_id = :parentId', { parentId: query.parent_id.trim() });
    }

    return await qb.getMany();
  }

  async findOneActive(slugOrId: string) {
    const whereCondition = this.isValidUuid(slugOrId)
      ? [
          { id: slugOrId, is_active: true },
          { slug: slugOrId, is_active: true },
        ]
      : { slug: slugOrId, is_active: true };

    const item = await this.repo.findOne({
      where: whereCondition,
      relations: { category_type: true, parent: true, children: true },
    });

    if (!item) {
      throw new NotFoundException('Category not found');
    }

    if (item.children) {
      item.children = item.children.filter((c) => c.is_active);
    }

    return item;
  }
}
