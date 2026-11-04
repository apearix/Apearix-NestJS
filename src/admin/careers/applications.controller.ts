import {
  Controller,
  Get,
  Patch,
  Delete,
  Param,
  Body,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ApplicationsService } from './applications.service';
import { UpdateApplicationStatusDto } from './dto/update-application-status.dto';
import { UpdateApplicationNotesDto } from './dto/update-application-notes.dto';

@ApiTags('Admin - Job Applications')
@Controller('api/v1/admin/careers/applications')
export class ApplicationsController {
  constructor(private readonly service: ApplicationsService) {}

  @ApiOperation({ summary: 'get-all-applications', operationId: 'get-all-applications' })
  @Get()
  findAll(
    @Query('search') search?: string,
    @Query('status') status?: string,
    @Query('jobId') jobId?: string,
  ) {
    return this.service.findAll({ search, status, jobId });
  }

  @ApiOperation({ summary: 'get-applications-stats', operationId: 'get-applications-stats' })
  @Get('stats')
  getStats() {
    return this.service.getStats();
  }

  @ApiOperation({ summary: 'get-application-by-id', operationId: 'get-application-by-id' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @ApiOperation({ summary: 'update-application-status', operationId: 'update-application-status' })
  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateApplicationStatusDto,
  ) {
    return this.service.updateStatus(id, dto);
  }

  @ApiOperation({ summary: 'update-application-notes', operationId: 'update-application-notes' })
  @Patch(':id/notes')
  updateNotes(
    @Param('id') id: string,
    @Body() dto: UpdateApplicationNotesDto,
  ) {
    return this.service.updateNotes(id, dto);
  }

  @ApiOperation({ summary: 'delete-application', operationId: 'delete-application' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
