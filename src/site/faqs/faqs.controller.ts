import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { SiteFaqsService } from './faqs.service';

@ApiTags('Site - FAQs')
@Controller('api/v1/faqs')
export class SiteFaqsController {
  constructor(private readonly service: SiteFaqsService) {}

  @ApiOperation({
    summary: 'Get all active FAQs for public site',
    operationId: 'site-get-all-faqs',
  })
  @ApiQuery({ name: 'category', required: false, description: 'Filter by FAQ category (e.g. general)' })
  @ApiQuery({ name: 'search', required: false, description: 'Search question or answer' })
  @Get()
  findAll(@Query('category') category?: string, @Query('search') search?: string) {
    return this.service.findAllActive({ category, search });
  }

  @ApiOperation({
    summary: 'Get a single active FAQ by ID',
    operationId: 'site-get-faq-by-id',
  })
  @ApiParam({ name: 'id', description: 'FAQ UUID' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOneActive(id);
  }
}
