import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Controller, Get, Post, Body, Patch, Param, Delete, BadRequestException } from '@nestjs/common';
import { CategoryTypesService } from './category-types.service';
import { CreateCategoryTypeDto } from './dto/create-category-types.dto';
import { UpdateCategoryTypeDto } from './dto/update-category-types.dto';

@ApiTags('Admin - Category Types')
@Controller('api/v1/admin/category-types')
export class CategoryTypesController {
  constructor(private readonly service: CategoryTypesService) {}

  @ApiOperation({ operationId: 'create-category-types' })
  @Post()
  create(@Body() dto: CreateCategoryTypeDto) {
    return this.service.create(dto);
  }

  @ApiOperation({ operationId: 'get-all-category-types' })
  @Get()
  findAll() {
    return this.service.findAll();
  }

  @ApiOperation({ operationId: 'bulk-status-category-types' })
  @Post('bulk-status')
  bulkStatus(@Body() body: { ids: string[]; is_active: boolean }) {
    return this.service.bulkStatus(body.ids, body.is_active);
  }

  @ApiOperation({ operationId: 'bulk-delete-category-types' })
  @Post('bulk-delete')
  bulkDelete(@Body() body: { ids: string[] }) {
    return this.service.bulkDelete(body.ids);
  }

  @ApiOperation({ operationId: 'bulk-import-category-types' })
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

  @ApiOperation({ operationId: 'get-category-types-by-id' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @ApiOperation({ operationId: 'update-category-types' })
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateCategoryTypeDto) {
    return this.service.update(id, dto);
  }

  @ApiOperation({ operationId: 'delete-category-types' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
