import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LegalPage, PageStatus } from '../../entities';

@Injectable()
export class SitePagesService {
  constructor(@InjectRepository(LegalPage) private readonly repo: Repository<LegalPage>) {}

  private isValidUuid(str: string): boolean {
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);
  }

  async findAllPublished() {
    return await this.repo.find({
      where: { status: PageStatus.PUBLISHED },
      order: { created_at: 'DESC' },
    });
  }

  async findOnePublished(slugOrId: string) {
    const whereCondition = this.isValidUuid(slugOrId)
      ? [
          { id: slugOrId, status: PageStatus.PUBLISHED },
          { slug: slugOrId, status: PageStatus.PUBLISHED },
        ]
      : { slug: slugOrId, status: PageStatus.PUBLISHED };

    const item = await this.repo.findOne({ where: whereCondition });
    if (!item) {
      throw new NotFoundException('Page not found');
    }
    return item;
  }
}
