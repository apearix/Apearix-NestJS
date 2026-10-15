import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategoryType } from '../../entities';

@Injectable()
export class SiteCategoryTypesService {
  constructor(@InjectRepository(CategoryType) private readonly repo: Repository<CategoryType>) {}

  private isValidUuid(str: string): boolean {
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);
  }

  async findAllActive() {
    return await this.repo.find({
      where: { is_active: true },
      order: { created_at: 'DESC' },
    });
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
      relations: { categories: true },
    });

    if (!item) {
      throw new NotFoundException('Category Type not found');
    }

    if (item.categories) {
      item.categories = item.categories
        .filter((c) => c.is_active)
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    }

    return item;
  }
}
