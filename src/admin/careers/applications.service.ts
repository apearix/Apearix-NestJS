import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JobApplication, ApplicationStatus } from '../../entities';
import { UpdateApplicationStatusDto } from './dto/update-application-status.dto';
import { UpdateApplicationNotesDto } from './dto/update-application-notes.dto';

@Injectable()
export class ApplicationsService {
  constructor(
    @InjectRepository(JobApplication)
    private readonly appRepo: Repository<JobApplication>,
  ) {}

  async findAll(query?: { search?: string; status?: string; jobId?: string }) {
    const qb = this.appRepo
      .createQueryBuilder('app')
      .leftJoinAndSelect('app.job', 'job')
      .orderBy('app.created_at', 'DESC');

    if (query?.search) {
      qb.andWhere(
        '(LOWER(app.first_name) LIKE :search OR LOWER(app.last_name) LIKE :search OR LOWER(app.email) LIKE :search OR LOWER(app.phone) LIKE :search)',
        { search: `%${query.search.toLowerCase()}%` },
      );
    }

    if (query?.status && query.status !== 'all') {
      qb.andWhere('app.status = :status', { status: query.status });
    }

    if (query?.jobId && query.jobId !== 'all') {
      qb.andWhere('app.job_id = :jobId', { jobId: query.jobId });
    }

    return await qb.getMany();
  }

  async findOne(id: string): Promise<JobApplication> {
    const app = await this.appRepo.findOne({
      where: { id },
      relations: { job: true },
    });

    if (!app) {
      throw new NotFoundException(`Application #${id} not found`);
    }

    return app;
  }

  async updateStatus(id: string, dto: UpdateApplicationStatusDto): Promise<JobApplication> {
    const app = await this.findOne(id);
    app.status = dto.status;
    return await this.appRepo.save(app);
  }

  async updateNotes(id: string, dto: UpdateApplicationNotesDto): Promise<JobApplication> {
    const app = await this.findOne(id);
    if (dto.admin_notes !== undefined) app.admin_notes = dto.admin_notes;
    if (dto.rating !== undefined) app.rating = dto.rating;
    return await this.appRepo.save(app);
  }

  async remove(id: string) {
    const app = await this.findOne(id);
    await this.appRepo.softRemove(app);
    return { success: true, message: 'Application deleted successfully' };
  }

  async getStats() {
    const counts = await this.appRepo
      .createQueryBuilder('app')
      .select('app.status', 'status')
      .addSelect('COUNT(app.id)', 'count')
      .groupBy('app.status')
      .getRawMany();

    const stats: Record<string, number> = {
      total: 0,
      applied: 0,
      reviewing: 0,
      shortlisted: 0,
      interviewing: 0,
      offered: 0,
      hired: 0,
      rejected: 0,
    };

    counts.forEach((item) => {
      const c = parseInt(item.count, 10);
      stats[item.status] = c;
      stats.total += c;
    });

    return stats;
  }
}
