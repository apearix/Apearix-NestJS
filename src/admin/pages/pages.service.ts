import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { LegalPage, PageStatus } from '../../entities';
import { CreateLegalPageDto } from './dto/create-pages.dto';
import { UpdateLegalPageDto } from './dto/update-pages.dto';

@Injectable()
export class LegalPagesService {
  constructor(@InjectRepository(LegalPage) private readonly repo: Repository<LegalPage>) {}

  async create(dto: CreateLegalPageDto) {
    const page = this.repo.create(dto);
    return await this.repo.save(page);
  }

  async findAll() {
    return await this.repo.find({ order: { created_at: 'DESC' } });
  }

  async findOne(id: string) {
    const item = await this.repo.findOne({ where: { id } });
    if (!item) throw new NotFoundException('Page not found');
    return item;
  }

  async update(id: string, dto: UpdateLegalPageDto) {
    const page = await this.findOne(id);
    Object.assign(page, dto);
    return await this.repo.save(page);
  }

  async remove(id: string) {
    const item = await this.findOne(id);
    await this.repo.softRemove(item);
    return { success: true, message: 'Deleted successfully' };
  }

  async bulkStatus(ids: string[], status: PageStatus) {
    if (!ids || ids.length === 0) return { success: true, count: 0 };
    const pages = await this.repo.findBy({ id: In(ids) });
    for (const p of pages) {
      p.status = status;
    }
    await this.repo.save(pages);
    return { success: true, count: pages.length };
  }

  async bulkDelete(ids: string[]) {
    if (!ids || ids.length === 0) return { success: true, count: 0 };
    const pages = await this.repo.findBy({ id: In(ids) });
    await this.repo.softRemove(pages);
    return { success: true, count: ids.length };
  }

  async bulkImport(items: any[]) {
    const created: LegalPage[] = [];
    for (const item of items) {
      if (!item.title || !item.slug) continue;

      const status: PageStatus = item.status || PageStatus.PUBLISHED;

      const newPage = this.repo.create({
        title: item.title,
        slug: item.slug,
        content: item.content || '',
        status,
        meta_title: item.meta_title || item.seo?.meta_title || item.title,
        meta_description: item.meta_description || item.seo?.meta_description || '',
        published_at: item.published_at || (status === PageStatus.PUBLISHED ? new Date() : null),
      });
      const saved = await this.repo.save(newPage);
      created.push(saved);
    }
    return { success: true, count: created.length, items: created };
  }
}
