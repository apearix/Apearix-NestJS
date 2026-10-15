import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-products.dto';
import { UpdateProductDto } from './dto/update-products.dto';

@ApiTags('Admin - Products')
@Controller('api/v1/admin/products')
export class ProductsController {
  constructor(private readonly service: ProductsService) {}

  @ApiOperation({ operationId: 'create-products' })
  @Post()
  create(@Body() dto: CreateProductDto) {
    return this.service.create(dto);
  }

  @ApiOperation({ operationId: 'get-all-products' })
  @Get()
  findAll() {
    return this.service.findAll();
  }

  @ApiOperation({ operationId: 'get-products-by-id' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(+id);
  }

  @ApiOperation({ operationId: 'update-products' })
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateProductDto) {
    return this.service.update(+id, dto);
  }

  @ApiOperation({ operationId: 'delete-products' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(+id);
  }
}
