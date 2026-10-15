import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../../entities';

@Injectable()
export class SiteProductsService {
  constructor(@InjectRepository(Product) private readonly repo: Repository<Product>) {}

  async findAllActive(query: { search?: string }) {
    const qb = this.repo
      .createQueryBuilder('product')
      .where('product.isActive = :isActive', { isActive: true })
      .orderBy('product.createdAt', 'DESC');

    if (query.search && query.search.trim()) {
      const s = `%${query.search.trim()}%`;
      qb.andWhere('(product.name ILIKE :s OR product.description ILIKE :s)', { s });
    }

    return await qb.getMany();
  }

  async findOneActive(id: number) {
    const item = await this.repo.findOne({
      where: { id, isActive: true },
    });
    if (!item) {
      throw new NotFoundException('Product not found');
    }
    return item;
  }
}
