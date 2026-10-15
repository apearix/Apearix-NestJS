import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { SiteServicesService } from './services.service';

@ApiTags('Site - Services')
@Controller('api/v1/services')
export class SiteServicesController {
  constructor(private readonly service: SiteServicesService) {}

  @ApiOperation({
    summary: 'Get all active services for public site',
    operationId: 'site-get-all-services',
  })
  @ApiQuery({ name: 'search', required: false, description: 'Search by service title or description' })
  @Get()
  findAll(@Query('search') search?: string) {
    return this.service.findAllActive({ search });
  }

  @ApiOperation({
    summary: 'Get a single active service by ID',
    operationId: 'site-get-service-by-id',
  })
  @ApiParam({ name: 'id', description: 'Service ID' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOneActive(+id);
  }
}
