import { Controller, Get, Param } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { SiteCategoryTypesService } from './category-types.service';

@ApiTags('Site - Category Types')
@Controller('api/v1/category-types')
export class SiteCategoryTypesController {
  constructor(private readonly service: SiteCategoryTypesService) {}

  @ApiOperation({
    summary: 'Get all active category types for public site',
    operationId: 'site-get-all-category-types',
  })
  @Get()
  findAll() {
    return this.service.findAllActive();
  }

  @ApiOperation({
    summary: 'Get a single active category type by slug or ID with its active categories',
    operationId: 'site-get-category-type-by-slug',
  })
  @ApiParam({ name: 'slugOrId', description: 'Category Type slug (e.g. blogs) or UUID' })
  @Get(':slugOrId')
  findOne(@Param('slugOrId') slugOrId: string) {
    return this.service.findOneActive(slugOrId);
  }
}
