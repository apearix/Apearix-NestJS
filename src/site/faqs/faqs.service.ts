import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Faq } from '../../entities';

@Injectable()
export class SiteFaqsService {
  constructor(@InjectRepository(Faq) private readonly repo: Repository<Faq>) {}

  async findAllActive(query: { category?: string; search?: string }) {
    const qb = this.repo
      .createQueryBuilder('faq')
      .where('faq.is_active = :isActive', { isActive: true })
      .orderBy('faq.order', 'ASC')
      .addOrderBy('faq.created_at', 'DESC');

    if (query.category && query.category.trim()) {
      qb.andWhere('LOWER(faq.category) = LOWER(:category)', {
        category: query.category.trim(),
      });
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
    });
    if (!item) {
      throw new NotFoundException('FAQ not found');
    }
    return item;
  }
}
