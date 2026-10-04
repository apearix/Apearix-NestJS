import { ApiOperation } from '@nestjs/swagger';
import { Controller, Get, Post, Body, Patch, Param, Delete, BadRequestException } from '@nestjs/common';
import { FaqsService } from './faqs.service';
import { CreateFaqDto } from './dto/create-faqs.dto';
import { UpdateFaqDto } from './dto/update-faqs.dto';

@Controller(['faqs', 'api/v1/admin/faqs'])
export class FaqsController {
  constructor(private readonly service: FaqsService) {}

  @ApiOperation({ operationId: 'create-faqs' })
  @Post()
  create(@Body() dto: CreateFaqDto) { return this.service.create(dto); }

  @ApiOperation({ operationId: 'get-all-faqs' })
  @Get()
  findAll() { return this.service.findAll(); }

  @ApiOperation({ operationId: 'bulk-status-faqs' })
  @Post('bulk-status')
  bulkStatus(@Body() body: { ids: string[]; is_active: boolean }) {
    return this.service.bulkStatus(body.ids, body.is_active);
  }

  @ApiOperation({ operationId: 'bulk-delete-faqs' })
  @Post('bulk-delete')
  bulkDelete(@Body() body: { ids: string[] }) {
    return this.service.bulkDelete(body.ids);
  }

  @ApiOperation({ operationId: 'bulk-import-faqs' })
  @Post('bulk-import')
  bulkImport(@Body() body: any) {
    let items: any[] = [];
    if (Array.isArray(body)) {
      items = body;
    } else if (body && Array.isArray(body.items)) {
      items = body.items;
    } else if (body && Array.isArray(body.data)) {
      items = body.data;
    } else if (body && Array.isArray(body.faqs)) {
      items = body.faqs;
    } else if (body && typeof body === 'object' && Object.keys(body).length > 0) {
      items = [body];
    }

    if (!items || items.length === 0) {
      throw new BadRequestException('Items array is required for bulk import');
    }
    return this.service.bulkImport(items);
  }

  @ApiOperation({ operationId: 'get-faqs-by-id' })
  @Get(':id')
  findOne(@Param('id') id: string) { return this.service.findOne(id); }

  @ApiOperation({ operationId: 'update-faqs' })
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateFaqDto) { return this.service.update(id, dto); }

  @ApiOperation({ operationId: 'delete-faqs' })
  @Delete(':id')
  remove(@Param('id') id: string) { return this.service.remove(id); }
}
