import { Controller, Get, Param } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { SitePagesService } from './pages.service';

@ApiTags('Site - Pages')
@Controller('api/v1/pages')
export class SitePagesController {
  constructor(private readonly service: SitePagesService) {}

  @ApiOperation({
    summary: 'Get all published legal/static pages',
    operationId: 'site-get-all-pages',
  })
  @Get()
  findAll() {
    return this.service.findAllPublished();
  }

  @ApiOperation({
    summary: 'Get a single published page by slug or ID',
    operationId: 'site-get-page-by-slug',
  })
  @ApiParam({ name: 'slugOrId', description: 'Page slug (e.g. privacy-policy) or UUID' })
  @Get(':slugOrId')
  findOne(@Param('slugOrId') slugOrId: string) {
    return this.service.findOnePublished(slugOrId);
  }
}
