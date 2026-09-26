import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategoryType } from './entities/category-types.entity';
import { CreateCategoryTypeDto } from './dto/create-category-types.dto';
import { UpdateCategoryTypeDto } from './dto/update-category-types.dto';

@Injectable()
export class CategoryTypesService {
  constructor(@InjectRepository(CategoryType) private readonly repo: Repository<CategoryType>) {}

  async create(dto: CreateCategoryTypeDto) { return await this.repo.save(this.repo.create(dto)); }
  async findAll() { return await this.repo.find({ order: { createdAt: 'DESC' } }); }
  async findOne(id: number) {
    const item = await this.repo.findOne({ where: { id } });
    if (!item) throw new NotFoundException('Item not found');
    return item;
  }
  async update(id: number, dto: UpdateCategoryTypeDto) {
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
