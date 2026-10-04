import { ApiOperation } from '@nestjs/swagger';
import { Controller, Get, Post, Body, Patch, Param, Delete, BadRequestException } from '@nestjs/common';
import { LegalPagesService } from './pages.service';
import { CreateLegalPageDto } from './dto/create-pages.dto';
import { UpdateLegalPageDto } from './dto/update-pages.dto';
import { PageStatus } from './entities/pages.entity';

@Controller(['pages', 'api/v1/admin/pages'])
export class LegalPagesController {
  constructor(private readonly service: LegalPagesService) {}

  @ApiOperation({ operationId: 'create-pages' })
  @Post()
  create(@Body() dto: CreateLegalPageDto) { return this.service.create(dto); }

  @ApiOperation({ operationId: 'get-all-pages' })
  @Get()
  findAll() { return this.service.findAll(); }

  @ApiOperation({ operationId: 'bulk-status-pages' })
  @Post('bulk-status')
  bulkStatus(@Body() body: { ids: string[]; status: PageStatus }) {
    return this.service.bulkStatus(body.ids, body.status);
  }

  @ApiOperation({ operationId: 'bulk-delete-pages' })
  @Post('bulk-delete')
  bulkDelete(@Body() body: { ids: string[] }) {
    return this.service.bulkDelete(body.ids);
  }

  @ApiOperation({ operationId: 'bulk-import-pages' })
  @Post('bulk-import')
  bulkImport(@Body() body: any) {
    let items: any[] = [];
    if (Array.isArray(body)) {
      items = body;
    } else if (body && Array.isArray(body.items)) {
      items = body.items;
    } else if (body && Array.isArray(body.data)) {
      items = body.data;
    } else if (body && Array.isArray(body.pages)) {
      items = body.pages;
    } else if (body && typeof body === 'object' && Object.keys(body).length > 0) {
      items = [body];
    }

    if (!items || items.length === 0) {
      throw new BadRequestException('Items array is required for bulk import');
    }
    return this.service.bulkImport(items);
  }

  @ApiOperation({ operationId: 'get-pages-by-id' })
  @Get(':id')
  findOne(@Param('id') id: string) { return this.service.findOne(id); }

  @ApiOperation({ operationId: 'update-pages' })
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateLegalPageDto) { return this.service.update(id, dto); }

  @ApiOperation({ operationId: 'delete-pages' })
  @Delete(':id')
  remove(@Param('id') id: string) { return this.service.remove(id); }
}
