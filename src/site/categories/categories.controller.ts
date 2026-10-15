import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { SiteCategoriesService } from './categories.service';

@ApiTags('Site - Categories')
@Controller('api/v1/categories')
export class SiteCategoriesController {
  constructor(private readonly service: SiteCategoriesService) {}

  @ApiOperation({
    summary: 'Get all active categories for public site',
    operationId: 'site-get-all-categories',
  })
  @ApiQuery({ name: 'type', required: false, description: 'Filter by category type slug or UUID (e.g. blogs)' })
  @ApiQuery({ name: 'parent_id', required: false, description: 'Filter by parent category UUID' })
  @Get()
  findAll(@Query('type') type?: string, @Query('parent_id') parent_id?: string) {
    return this.service.findAllActive({ type, parent_id });
  }

  @ApiOperation({
    summary: 'Get a single active category by slug or ID',
    operationId: 'site-get-category-by-slug',
  })
  @ApiParam({ name: 'slugOrId', description: 'Category slug or UUID' })
  @Get(':slugOrId')
  findOne(@Param('slugOrId') slugOrId: string) {
    return this.service.findOneActive(slugOrId);
  }
}
