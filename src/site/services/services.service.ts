import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ServiceEntity } from '../../entities';

@Injectable()
export class SiteServicesService {
  constructor(@InjectRepository(ServiceEntity) private readonly repo: Repository<ServiceEntity>) {}

  async findAllActive(query: { search?: string }) {
    const qb = this.repo
      .createQueryBuilder('service')
      .where('service.isActive = :isActive', { isActive: true })
      .orderBy('service.createdAt', 'DESC');

    if (query.search && query.search.trim()) {
      const s = `%${query.search.trim()}%`;
      qb.andWhere('(service.title ILIKE :s OR service.description ILIKE :s)', { s });
    }

    return await qb.getMany();
  }

  async findOneActive(id: number) {
    const item = await this.repo.findOne({
      where: { id, isActive: true },
    });
    if (!item) {
      throw new NotFoundException('Service not found');
    }
    return item;
  }
}
