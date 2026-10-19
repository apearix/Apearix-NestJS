import { Controller, Get, Param } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { SitePagesService } from './pages.service';

@ApiTags('Site - Pages')
@Controller('api/v1/pages')
export class SitePagesController {
  constructor(private readonly service: SitePagesService) {}

  @ApiOperation({
    summary: 'site-get-all-pages',
    operationId: 'site-get-all-pages',
    description: 'Get all published legal/static pages',
  })
  @Get()
  findAll() {
    return this.service.findAllPublished();
  }

  @ApiOperation({
    summary: 'site-get-page-by-slug',
    operationId: 'site-get-page-by-slug',
    description: 'Get a single published page by slug or ID',
  })
  @ApiParam({ name: 'slugOrId', description: 'Page slug (e.g. privacy-policy) or UUID' })
  @Get(':slugOrId')
  findOne(@Param('slugOrId') slugOrId: string) {
    return this.service.findOnePublished(slugOrId);
  }
}
