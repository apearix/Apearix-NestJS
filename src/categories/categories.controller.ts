import { ApiOperation } from '@nestjs/swagger';
import { Controller, Get, Post, Body, Patch, Param, Delete, BadRequestException } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-categories.dto';
import { UpdateCategoryDto } from './dto/update-categories.dto';

@Controller(['categories', 'api/v1/admin/categories'])
export class CategoriesController {
  constructor(private readonly service: CategoriesService) {}

  @ApiOperation({ operationId: 'create-categories' })
  @Post()
  create(@Body() dto: CreateCategoryDto) {
    return this.service.create(dto);
  }

  @ApiOperation({ operationId: 'get-all-categories' })
  @Get()
  findAll() {
    return this.service.findAll();
  }

  @ApiOperation({ operationId: 'bulk-status-categories' })
  @Post('bulk-status')
  bulkStatus(@Body() body: { ids: string[]; is_active: boolean }) {
    return this.service.bulkStatus(body.ids, body.is_active);
  }

  @ApiOperation({ operationId: 'bulk-delete-categories' })
  @Post('bulk-delete')
  bulkDelete(@Body() body: { ids: string[] }) {
    return this.service.bulkDelete(body.ids);
  }

  @ApiOperation({ operationId: 'bulk-import-categories' })
  @Post('bulk-import')
  bulkImport(@Body() body: any) {
    let items: any[] = [];
    if (Array.isArray(body)) {
      items = body;
    } else if (body && Array.isArray(body.items)) {
      items = body.items;
    } else if (body && Array.isArray(body.data)) {
      items = body.data;
    } else if (body && typeof body === 'object' && Object.keys(body).length > 0) {
      items = [body];
    }

    if (!items || items.length === 0) {
      throw new BadRequestException('Items array is required for bulk import');
    }
    return this.service.bulkImport(items);
  }

  @ApiOperation({ operationId: 'get-categories-by-id' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @ApiOperation({ operationId: 'update-categories' })
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateCategoryDto) {
    return this.service.update(id, dto);
  }

  @ApiOperation({ operationId: 'delete-categories' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
