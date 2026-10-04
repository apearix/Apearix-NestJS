import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm'; 
import { LegalPage } from './entities/pages.entity';
import { CreateLegalPageDto } from './dto/create-pages.dto';
import { UpdateLegalPageDto } from './dto/update-pages.dto';

@Injectable()
export class LegalPagesService {
  constructor(@InjectRepository(LegalPage) private readonly repo: Repository<LegalPage>) {}

  async create(dto: CreateLegalPageDto) { return await this.repo.save(this.repo.create(dto)); }
  async findAll() { return await this.repo.find({ order: { created_at: 'DESC' } }); }
  async findOne(id: string) {
    const item = await this.repo.findOne({ where: { id } });
    if (!item) throw new NotFoundException('Item not found');
    return item;
  }
  async update(id: string, dto: UpdateLegalPageDto) {
    await this.findOne(id);
    await this.repo.update(id, dto);
    return this.findOne(id);
  }
  async remove(id: string) {
    const item = await this.findOne(id);
    await this.repo.softRemove(item);
    return { success: true, message: 'Deleted successfully' };
  }
}
