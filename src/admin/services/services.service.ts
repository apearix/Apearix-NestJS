import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ServiceEntity } from '../../entities';
import { CreateServiceEntityDto } from './dto/create-services.dto';
import { UpdateServiceEntityDto } from './dto/update-services.dto';

@Injectable()
export class ServicesService {
  constructor(@InjectRepository(ServiceEntity) private readonly repo: Repository<ServiceEntity>) {}

  async create(dto: CreateServiceEntityDto) {
    return await this.repo.save(this.repo.create(dto));
  }

  async findAll() {
    return await this.repo.find({ order: { createdAt: 'DESC' } });
  }

  async findOne(id: number) {
    const item = await this.repo.findOne({ where: { id } });
    if (!item) throw new NotFoundException('Service not found');
    return item;
  }

  async update(id: number, dto: UpdateServiceEntityDto) {
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
