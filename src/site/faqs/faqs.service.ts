import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Faq } from '../../entities';

@Injectable()
export class SiteFaqsService {
  constructor(@InjectRepository(Faq) private readonly repo: Repository<Faq>) {}

  private isValidUuid(str: string): boolean {
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);
  }

  async findAllActive(query: { category?: string; search?: string }) {
    const qb = this.repo
      .createQueryBuilder('faq')
      .leftJoinAndSelect('faq.category', 'category')
      .where('faq.is_active = :isActive', { isActive: true })
      .orderBy('faq.order', 'ASC')
      .addOrderBy('faq.created_at', 'DESC');

    if (query.category && query.category.trim()) {
      const cat = query.category.trim();
      if (this.isValidUuid(cat)) {
        qb.andWhere('faq.category_id = :catId', { catId: cat });
      } else {
        qb.andWhere('(LOWER(category.slug) = LOWER(:cat) OR LOWER(category.name) = LOWER(:cat))', {
          cat,
        });
      }
    }

    if (query.search && query.search.trim()) {
      const s = `%${query.search.trim()}%`;
      qb.andWhere('(faq.question ILIKE :s OR faq.answer ILIKE :s)', { s });
    }

    return await qb.getMany();
  }

  async findOneActive(id: string) {
    const item = await this.repo.findOne({
      where: { id, is_active: true },
      relations: { category: true },
    });
    if (!item) {
      throw new NotFoundException('FAQ not found');
    }
    return item;
  }
}
