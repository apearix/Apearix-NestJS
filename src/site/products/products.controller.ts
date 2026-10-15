import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { SiteProductsService } from './products.service';

@ApiTags('Site - Products')
@Controller('api/v1/products')
export class SiteProductsController {
  constructor(private readonly service: SiteProductsService) {}

  @ApiOperation({
    summary: 'Get all active products for public site',
    operationId: 'site-get-all-products',
  })
  @ApiQuery({ name: 'search', required: false, description: 'Search by product name or description' })
  @Get()
  findAll(@Query('search') search?: string) {
    return this.service.findAllActive({ search });
  }

  @ApiOperation({
    summary: 'Get a single active product by ID',
    operationId: 'site-get-product-by-id',
  })
  @ApiParam({ name: 'id', description: 'Product ID' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOneActive(+id);
  }
}
