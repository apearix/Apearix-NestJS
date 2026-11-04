import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Job, JobStatus, JobApplication } from '../../entities';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';

@Injectable()
export class CareersService {
  constructor(
    @InjectRepository(Job)
    private readonly jobRepo: Repository<Job>,
    @InjectRepository(JobApplication)
    private readonly appRepo: Repository<JobApplication>,
  ) {}

  private slugify(text: string): string {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  private async generateUniqueSlug(title: string, currentId?: string): Promise<string> {
    const baseSlug = this.slugify(title);
    let slug = baseSlug;
    let counter = 1;

    while (true) {
      const existing = await this.jobRepo.findOne({
        where: { slug },
        withDeleted: true,
      });

      if (!existing || (currentId && existing.id === currentId)) {
        return slug;
      }

      slug = `${baseSlug}-${counter}`;
      counter++;
    }
  }

  async create(dto: CreateJobDto): Promise<Job> {
    const slug = dto.slug
      ? this.slugify(dto.slug)
      : await this.generateUniqueSlug(dto.title);

    const job = this.jobRepo.create({
      ...dto,
      slug,
      deadline: dto.deadline ? new Date(dto.deadline) : null,
      responsibilities: dto.responsibilities || [],
      requirements: dto.requirements || [],
      benefits: dto.benefits || [],
      order: dto.order !== undefined ? Number(dto.order) : 0,
      status: dto.status || JobStatus.PUBLISHED,
    });

    return await this.jobRepo.save(job);
  }

  async findAll(query?: { search?: string; status?: string; department?: string }) {
    const qb = this.jobRepo
      .createQueryBuilder('job')
      .leftJoinAndSelect('job.applications', 'application')
      .orderBy('job.order', 'ASC')
      .addOrderBy('job.created_at', 'DESC');

    if (query?.search) {
      qb.andWhere(
        '(LOWER(job.title) LIKE :search OR LOWER(job.department) LIKE :search OR LOWER(job.location) LIKE :search)',
        { search: `%${query.search.toLowerCase()}%` },
      );
    }

    if (query?.status && query.status !== 'all') {
      qb.andWhere('job.status = :status', { status: query.status });
    }

    if (query?.department && query.department !== 'all') {
      qb.andWhere('job.department = :department', { department: query.department });
    }

    const items = await qb.getMany();
    return items.map((job) => {
      const count = job.applications ? job.applications.length : 0;
      const { applications, ...rest } = job as any;
      return {
        ...rest,
        applicant_count: count,
      };
    });
  }

  async findOne(id: string): Promise<any> {
    const job = await this.jobRepo.findOne({
      where: { id },
      relations: { applications: true },
    });

    if (!job) {
      throw new NotFoundException(`Job posting #${id} not found`);
    }

    const count = job.applications ? job.applications.length : 0;
    return {
      ...job,
      applicant_count: count,
    };
  }

  async update(id: string, dto: UpdateJobDto): Promise<Job> {
    const job = await this.jobRepo.findOne({ where: { id } });
    if (!job) {
      throw new NotFoundException(`Job posting #${id} not found`);
    }

    if (dto.title && (!dto.slug || dto.slug === job.slug)) {
      if (dto.title !== job.title && !dto.slug) {
        job.slug = await this.generateUniqueSlug(dto.title, id);
      }
    } else if (dto.slug && dto.slug !== job.slug) {
      job.slug = await this.generateUniqueSlug(dto.slug, id);
    }

    if (dto.deadline !== undefined) {
      job.deadline = dto.deadline ? new Date(dto.deadline) : null;
    }

    Object.assign(job, {
      ...dto,
      slug: job.slug,
      deadline: job.deadline,
    });

    return await this.jobRepo.save(job);
  }

  async remove(id: string) {
    const job = await this.jobRepo.findOne({ where: { id } });
    if (!job) {
      throw new NotFoundException(`Job posting #${id} not found`);
    }
    await this.jobRepo.softRemove(job);
    return { success: true, message: 'Job posting deleted successfully' };
  }

  async bulkStatus(ids: string[], status: JobStatus) {
    if (!ids || ids.length === 0) return { success: true, count: 0 };
    await this.jobRepo.update({ id: In(ids) }, { status });
    return { success: true, count: ids.length };
  }

  async bulkDelete(ids: string[]) {
    if (!ids || ids.length === 0) return { success: true, count: 0 };
    const items = await this.jobRepo.findBy({ id: In(ids) });
    await this.jobRepo.softRemove(items);
    return { success: true, count: items.length };
  }

  async getStats() {
    const totalJobs = await this.jobRepo.count();
    const activeJobs = await this.jobRepo.count({ where: { status: JobStatus.PUBLISHED } });
    const totalApplications = await this.appRepo.count();
    return {
      totalJobs,
      activeJobs,
      totalApplications,
    };
  }
}
