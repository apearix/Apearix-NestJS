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
  @ApiQuery({ name: 'category', required: false, description: 'Category slug or ID' })
  @Get()
  findAll(
    @Query('search') search?: string,
    @Query('category') category?: string,
  ) {
    return this.service.findAllActive({ search, category });
  }

  @ApiOperation({
    summary: 'site-get-service-by-id-or-slug',
    operationId: 'site-get-service-by-id-or-slug',
    description: 'Get a single active service by ID or slug',
  })
  @ApiParam({ name: 'idOrSlug', description: 'Service ID or Slug' })
  @Get(':idOrSlug')
  findOne(@Param('idOrSlug') idOrSlug: string) {
    return this.service.findOneActive(idOrSlug);
  }
}
