import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { CareersService } from './careers.service';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { JobStatus } from '../../entities';

@ApiTags('Admin - Careers')
@Controller('api/v1/admin/careers')
export class CareersController {
  constructor(private readonly service: CareersService) {}

  @ApiOperation({ summary: 'create-job', operationId: 'create-job' })
  @Post()
  create(@Body() dto: CreateJobDto) {
    return this.service.create(dto);
  }

  @ApiOperation({ summary: 'get-all-jobs', operationId: 'get-all-jobs' })
  @Get()
  findAll(
    @Query('search') search?: string,
    @Query('status') status?: string,
    @Query('department') department?: string,
  ) {
    return this.service.findAll({ search, status, department });
  }

  @ApiOperation({ summary: 'get-careers-stats', operationId: 'get-careers-stats' })
  @Get('stats')
  getStats() {
    return this.service.getStats();
  }

  @ApiOperation({ summary: 'bulk-status-jobs', operationId: 'bulk-status-jobs' })
  @Post('bulk-status')
  bulkStatus(@Body() body: { ids: string[]; status: JobStatus }) {
    return this.service.bulkStatus(body.ids, body.status);
  }

  @ApiOperation({ summary: 'bulk-delete-jobs', operationId: 'bulk-delete-jobs' })
  @Post('bulk-delete')
  bulkDelete(@Body() body: { ids: string[] }) {
    return this.service.bulkDelete(body.ids);
  }

  @ApiOperation({ summary: 'get-job-by-id', operationId: 'get-job-by-id' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @ApiOperation({ summary: 'update-job', operationId: 'update-job' })
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateJobDto) {
    return this.service.update(id, dto);
  }

  @ApiOperation({ summary: 'delete-job', operationId: 'delete-job' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
