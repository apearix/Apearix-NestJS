import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Job, JobStatus, JobApplication, ApplicationStatus } from '../../entities';
import { ApplyJobDto } from './dto/apply-job.dto';

@Injectable()
export class SiteCareersService {
  constructor(
    @InjectRepository(Job)
    private readonly jobRepo: Repository<Job>,
    @InjectRepository(JobApplication)
    private readonly appRepo: Repository<JobApplication>,
  ) {}

  async findAllPublished(query?: {
    search?: string;
    department?: string;
    job_type?: string;
    workplace_type?: string;
  }) {
    const qb = this.jobRepo
      .createQueryBuilder('job')
      .where('job.status = :status', { status: JobStatus.PUBLISHED })
      .orderBy('job.is_featured', 'DESC')
      .addOrderBy('job.order', 'ASC')
      .addOrderBy('job.created_at', 'DESC');

    if (query?.search) {
      qb.andWhere(
        '(LOWER(job.title) LIKE :search OR LOWER(job.department) LIKE :search OR LOWER(job.location) LIKE :search)',
        { search: `%${query.search.toLowerCase()}%` },
      );
    }

    if (query?.department && query.department !== 'all') {
      qb.andWhere('job.department = :department', { department: query.department });
    }

    if (query?.job_type && query.job_type !== 'all') {
      qb.andWhere('job.job_type = :job_type', { job_type: query.job_type });
    }

    if (query?.workplace_type && query.workplace_type !== 'all') {
      qb.andWhere('job.workplace_type = :workplace_type', {
        workplace_type: query.workplace_type,
      });
    }

    const items = await qb.getMany();

    const departments = Array.from(
      new Set(items.map((job) => job.department).filter(Boolean)),
    );

    return {
      items,
      departments,
      total: items.length,
    };
  }

  async findBySlug(slug: string): Promise<Job> {
    const job = await this.jobRepo.findOne({
      where: { slug, status: JobStatus.PUBLISHED },
    });

    if (!job) {
      throw new NotFoundException(`Job opening not found`);
    }

    await this.jobRepo.increment({ id: job.id }, 'views_count', 1);

    return job;
  }

  async findById(id: string): Promise<Job> {
    const job = await this.jobRepo.findOne({
      where: { id, status: JobStatus.PUBLISHED },
    });

    if (!job) {
      throw new NotFoundException(`Job opening not found`);
    }

    return job;
  }

  async createApplication(
    jobId: string,
    dto: ApplyJobDto,
    resumeUrl: string,
    resumeFilename: string,
  ): Promise<JobApplication> {
    const job = await this.findById(jobId);

    if (job.deadline && new Date() > new Date(job.deadline)) {
      throw new BadRequestException('This job application deadline has passed.');
    }

    const existing = await this.appRepo.findOne({
      where: { job_id: jobId, email: dto.email.toLowerCase().trim() },
    });

    if (existing) {
      throw new BadRequestException(
        'You have already submitted an application for this role.',
      );
    }

    const app = new JobApplication();
    app.job_id = jobId;
    app.first_name = dto.first_name.trim();
    app.last_name = dto.last_name.trim();
    app.email = dto.email.toLowerCase().trim();
    app.phone = dto.phone?.trim() || '';
    app.resume_url = resumeUrl;
    app.resume_filename = resumeFilename;
    app.portfolio_url = dto.portfolio_url?.trim() || '';
    app.linkedin_url = dto.linkedin_url?.trim() || '';
    app.github_url = dto.github_url?.trim() || '';
    app.cover_letter = dto.cover_letter?.trim() || '';
    app.current_ctc = dto.current_ctc?.trim() || '';
    app.expected_ctc = dto.expected_ctc?.trim() || '';
    app.notice_period = dto.notice_period?.trim() || '';
    app.status = ApplicationStatus.APPLIED;

    return await this.appRepo.save(app);
  }
}
