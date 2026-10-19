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
  @Get()
  findAll(@Query('search') search?: string) {
    return this.service.findAllActive({ search });
  }

  @ApiOperation({
    summary: 'site-get-product-by-id',
    operationId: 'site-get-product-by-id',
    description: 'Get a single active product by ID',
  })
  @ApiParam({ name: 'id', description: 'Product ID' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOneActive(+id);
  }
}
