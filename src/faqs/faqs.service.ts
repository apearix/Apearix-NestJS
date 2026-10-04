import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Faq } from './entities/faqs.entity';
import { CreateFaqDto } from './dto/create-faqs.dto';
import { UpdateFaqDto } from './dto/update-faqs.dto';

@Injectable()
export class FaqsService {
  constructor(@InjectRepository(Faq) private readonly repo: Repository<Faq>) {}

  async create(dto: CreateFaqDto) {
    const faq = this.repo.create(dto);
    return await this.repo.save(faq);
  }

  async findAll() {
    return await this.repo.find({ order: { order: 'ASC', created_at: 'DESC' } });
  }

  async findOne(id: string) {
    const item = await this.repo.findOne({ where: { id } });
    if (!item) throw new NotFoundException('FAQ not found');
    return item;
  }

  async update(id: string, dto: UpdateFaqDto) {
    const item = await this.findOne(id);
    Object.assign(item, dto);
    return await this.repo.save(item);
  }

  async remove(id: string) {
    const item = await this.findOne(id);
    await this.repo.softRemove(item);
    return { success: true, message: 'FAQ deleted successfully' };
  }

  async bulkStatus(ids: string[], is_active: boolean) {
    if (!ids || ids.length === 0) return { success: true, count: 0 };
    const faqs = await this.repo.findBy({ id: In(ids) });
    for (const f of faqs) {
      f.is_active = is_active;
    }
    await this.repo.save(faqs);
    return { success: true, count: faqs.length };
  }

  async bulkDelete(ids: string[]) {
    if (!ids || ids.length === 0) return { success: true, count: 0 };
    const faqs = await this.repo.findBy({ id: In(ids) });
    await this.repo.softRemove(faqs);
    return { success: true, count: ids.length };
  }

  async bulkImport(items: any[]) {
    const created: Faq[] = [];
    for (const item of items) {
      if (!item.question || !item.answer) continue;

      const newFaq = this.repo.create({
        question: item.question,
        answer: item.answer,
        category: item.category || 'general',
        order: item.order !== undefined ? Number(item.order) : 0,
        is_active: item.is_active !== undefined ? Boolean(item.is_active) : true,
      });
      const saved = await this.repo.save(newFaq);
      created.push(saved);
    }
    return { success: true, count: created.length, items: created };
  }
}
