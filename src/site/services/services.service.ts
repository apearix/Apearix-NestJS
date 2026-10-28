import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ServiceEntity } from '../../entities';

@Injectable()
export class SiteServicesService {
  constructor(@InjectRepository(ServiceEntity) private readonly repo: Repository<ServiceEntity>) {}

  private isValidUuid(str: string): boolean {
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);
  }

  async findAllActive(query: { search?: string; category?: string }) {
    const qb = this.repo
      .createQueryBuilder('service')
      .leftJoinAndSelect('service.category', 'category')
      .where('service.is_active = :isActive', { isActive: true })
      .orderBy('service.created_at', 'DESC');

    if (query.search && query.search.trim()) {
      const s = `%${query.search.trim()}%`;
      qb.andWhere('(service.title ILIKE :s OR service.description ILIKE :s)', { s });
    }

    if (query.category && query.category.trim()) {
      const cat = query.category.trim();
      if (this.isValidUuid(cat)) {
        qb.andWhere('service.category_id = :catId', { catId: cat });
      } else {
        qb.andWhere('LOWER(category.slug) = LOWER(:catSlug)', { catSlug: cat });
      }
    }

    return await qb.getMany();
  }

  async findOneActive(idOrSlug: string) {
    const isUuid = this.isValidUuid(idOrSlug);
    const whereCondition = isUuid
      ? [{ id: idOrSlug, is_active: true }, { slug: idOrSlug, is_active: true }]
      : { slug: idOrSlug, is_active: true };

    const item = await this.repo.findOne({
      where: whereCondition,
      relations: { category: true },
    });

    if (!item) {
      throw new NotFoundException('Service not found');
    }
    return item;
  }
}
