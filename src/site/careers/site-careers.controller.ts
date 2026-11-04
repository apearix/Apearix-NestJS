import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Query,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiConsumes } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { SiteCareersService } from './site-careers.service';
import { ApplyJobDto } from './dto/apply-job.dto';
import { StorageService } from '../../storage/storage.service';

@ApiTags('Site - Careers')
@Controller('api/v1/site/careers')
export class SiteCareersController {
  constructor(
    private readonly service: SiteCareersService,
    private readonly storageService: StorageService,
  ) {}

  @ApiOperation({ summary: 'get-all-published-jobs', operationId: 'get-all-published-jobs' })
  @Get()
  findAllPublished(
    @Query('search') search?: string,
    @Query('department') department?: string,
    @Query('job_type') job_type?: string,
    @Query('workplace_type') workplace_type?: string,
  ) {
    return this.service.findAllPublished({
      search,
      department,
      job_type,
      workplace_type,
    });
  }

  @ApiOperation({ summary: 'get-published-job-by-slug', operationId: 'get-published-job-by-slug' })
  @Get(':slug')
  findBySlug(@Param('slug') slug: string) {
    return this.service.findBySlug(slug);
  }

  @ApiOperation({ summary: 'apply-for-job', operationId: 'apply-for-job' })
  @ApiConsumes('multipart/form-data')
  @Post(':id/apply')
  @UseInterceptors(
    FileInterceptor('resume', {
      limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
      fileFilter: (req: any, file: any, callback: (error: Error | null, acceptFile: boolean) => void) => {
        const allowedMime = [
          'application/pdf',
          'application/msword',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'application/octet-stream', // Some browsers send binary stream for docs
        ];
        const allowedExt = ['.pdf', '.doc', '.docx'];
        const fileExt = (file.originalname || '').toLowerCase();
        const hasValidExt = allowedExt.some((ext) => fileExt.endsWith(ext));

        if (allowedMime.includes(file.mimetype) || hasValidExt) {
          callback(null, true);
        } else {
          callback(
            new BadRequestException(
              'Only PDF, DOC, and DOCX resume formats are allowed.',
            ),
            false,
          );
        }
      },
    }),
  )
  async apply(
    @Param('id') jobId: string,
    @Body() dto: ApplyJobDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('A resume or CV file is required.');
    }

    const uploaded = await this.storageService.uploadFile(file, 'careers/resumes');
    const application = await this.service.createApplication(
      jobId,
      dto,
      uploaded.url,
      uploaded.filename,
    );

    return {
      success: true,
      message: 'Your application has been submitted successfully! Our talent team will review it shortly.',
      data: {
        id: application.id,
        first_name: application.first_name,
        last_name: application.last_name,
        email: application.email,
      },
    };
  }
}
