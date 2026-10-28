import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { SiteProductsService } from './products.service';

@ApiTags('Site - Products')
@Controller('api/v1/products')
export class SiteProductsController {
  constructor(private readonly service: SiteProductsService) {}

  @ApiOperation({
    summary: 'site-get-all-products',
    operationId: 'site-get-all-products',
    description: 'Get all active products for public site',
  })
  @ApiQuery({ name: 'search', required: false, description: 'Search by product name or description' })
  @ApiQuery({ name: 'category', required: false, description: 'Category slug or ID' })
  @Get()
  findAll(
    @Query('search') search?: string,
    @Query('category') category?: string,
  ) {
    return this.service.findAllActive({ search, category });
  }

  @ApiOperation({
    summary: 'site-get-product-by-id-or-slug',
    operationId: 'site-get-product-by-id-or-slug',
    description: 'Get a single active product by ID or slug',
  })
  @ApiParam({ name: 'idOrSlug', description: 'Product ID or Slug' })
  @Get(':idOrSlug')
  findOne(@Param('idOrSlug') idOrSlug: string) {
    return this.service.findOneActive(idOrSlug);
  }
}
