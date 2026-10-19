import { Controller, Get, Param } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { SiteCategoryTypesService } from './category-types.service';

@ApiTags('Site - Category Types')
@Controller('api/v1/category-types')
export class SiteCategoryTypesController {
  constructor(private readonly service: SiteCategoryTypesService) {}

  @ApiOperation({
    summary: 'site-get-all-category-types',
    operationId: 'site-get-all-category-types',
    description: 'Get all active category types for public site',
  })
  @Get()
  findAll() {
    return this.service.findAllActive();
  }

  @ApiOperation({
    summary: 'site-get-category-type-by-slug',
    operationId: 'site-get-category-type-by-slug',
    description: 'Get a single active category type by slug or ID with its active categories',
  })
  @ApiParam({ name: 'slugOrId', description: 'Category Type slug (e.g. blogs) or UUID' })
  @Get(':slugOrId')
  findOne(@Param('slugOrId') slugOrId: string) {
    return this.service.findOneActive(slugOrId);
  }
}
