import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Faq } from './entities/faqs.entity';
import { CreateFaqDto } from './dto/create-faqs.dto';
import { UpdateFaqDto } from './dto/update-faqs.dto';

@Injectable()
export class FaqsService {
  constructor(@InjectRepository(Faq) private readonly repo: Repository<Faq>) {}

  async create(dto: CreateFaqDto) { return await this.repo.save(this.repo.create(dto)); }
  async findAll() { return await this.repo.find({ order: { createdAt: 'DESC' } }); }
  async findOne(id: number) {
    const item = await this.repo.findOne({ where: { id } });
    if (!item) throw new NotFoundException('Item not found');
    return item;
  }
  async update(id: number, dto: UpdateFaqDto) {
    await this.findOne(id);
    await this.repo.update(id, dto);
    return this.findOne(id);
  }
  async remove(id: number) {
    const item = await this.findOne(id);
    await this.repo.remove(item);
    return { success: true, message: 'Deleted successfully' };
  }
}
