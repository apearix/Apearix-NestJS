import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { SiteBlogsService } from './blogs.service';

@ApiTags('Site - Blogs')
@Controller('api/v1/blogs')
export class SiteBlogsController {
  constructor(private readonly service: SiteBlogsService) {}

  @ApiOperation({
    summary: 'Get all published blogs for public site',
    operationId: 'site-get-all-blogs',
  })
  @ApiQuery({ name: 'search', required: false, description: 'Search by title or excerpt' })
  @ApiQuery({ name: 'page', required: false, description: 'Page number (optional)' })
  @ApiQuery({ name: 'limit', required: false, description: 'Items per page (optional)' })
  @Get()
  findAll(
    @Query('search') search?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.service.findAllPublished({
      search,
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
    });
  }

  @ApiOperation({
    summary: 'Get a single published blog by slug or ID',
    operationId: 'site-get-blog-by-slug',
  })
  @ApiParam({ name: 'slugOrId', description: 'Blog slug or UUID' })
  @Get(':slugOrId')
  findOne(@Param('slugOrId') slugOrId: string) {
    return this.service.findOnePublished(slugOrId);
  }
}
