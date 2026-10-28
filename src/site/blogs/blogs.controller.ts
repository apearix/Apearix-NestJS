import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { SiteBlogsService } from './blogs.service';

@ApiTags('Site - Blogs')
@Controller('api/v1/blogs')
export class SiteBlogsController {
  constructor(private readonly service: SiteBlogsService) {}

  @ApiOperation({
    summary: 'site-get-all-blogs',
    operationId: 'site-get-all-blogs',
    description: 'Get all published blogs for public site',
  })
  @ApiQuery({ name: 'search', required: false, description: 'Search by title or excerpt' })
  @ApiQuery({ name: 'category', required: false, description: 'Filter by Category Slug or ID' })
  @ApiQuery({ name: 'page', required: false, description: 'Page number (optional)' })
  @ApiQuery({ name: 'limit', required: false, description: 'Items per page (optional)' })
  @Get()
  findAll(
    @Query('search') search?: string,
    @Query('category') category?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.service.findAllPublished({
      search,
      category,
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
    });
  }

  @ApiOperation({
    summary: 'site-get-blog-by-slug',
    operationId: 'site-get-blog-by-slug',
    description: 'Get a single published blog by slug or ID',
  })
  @ApiParam({ name: 'slugOrId', description: 'Blog slug or UUID' })
  @Get(':slugOrId')
  findOne(@Param('slugOrId') slugOrId: string) {
    return this.service.findOnePublished(slugOrId);
  }
}
