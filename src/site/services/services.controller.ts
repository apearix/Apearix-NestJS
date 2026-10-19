import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { SiteServicesService } from './services.service';

@ApiTags('Site - Services')
@Controller('api/v1/services')
export class SiteServicesController {
  constructor(private readonly service: SiteServicesService) {}

  @ApiOperation({
    summary: 'site-get-all-services',
    operationId: 'site-get-all-services',
    description: 'Get all active services for public site',
  })
  @ApiQuery({ name: 'search', required: false, description: 'Search by service title or description' })
  @Get()
  findAll(@Query('search') search?: string) {
    return this.service.findAllActive({ search });
  }

  @ApiOperation({
    summary: 'site-get-service-by-id',
    operationId: 'site-get-service-by-id',
    description: 'Get a single active service by ID',
  })
  @ApiParam({ name: 'id', description: 'Service ID' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOneActive(+id);
  }
}
