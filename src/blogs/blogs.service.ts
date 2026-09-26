import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Blog } from './entities/blogs.entity';
import { CreateBlogDto } from './dto/create-blogs.dto';
import { UpdateBlogDto } from './dto/update-blogs.dto';

@Injectable()
export class BlogsService {
  constructor(@InjectRepository(Blog) private readonly repo: Repository<Blog>) {}

  async create(dto: CreateBlogDto) { return await this.repo.save(this.repo.create(dto)); }
  async findAll() { return await this.repo.find({ order: { createdAt: 'DESC' } }); }
  async findOne(id: number) {
    const item = await this.repo.findOne({ where: { id } });
    if (!item) throw new NotFoundException('Item not found');
    return item;
  }
  async update(id: number, dto: UpdateBlogDto) {
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
