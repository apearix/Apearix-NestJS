import { ApiOperation } from '@nestjs/swagger';
import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { LegalPagesService } from './pages.service';
import { CreateLegalPageDto } from './dto/create-pages.dto';
import { UpdateLegalPageDto } from './dto/update-pages.dto';
// import { JwtAuthGuard } from '../admin-auth/jwt-auth.guard';

// @UseGuards(JwtAuthGuard)
@Controller('api/v1/admin/pages')
export class LegalPagesController {
  constructor(private readonly service: LegalPagesService) {}

  @ApiOperation({ operationId: 'create-pages' })
  @Post()
  create(@Body() dto: CreateLegalPageDto) { return this.service.create(dto); }

  @ApiOperation({ operationId: 'get-all-pages' })
  @Get()
  findAll() { return this.service.findAll(); }

  @ApiOperation({ operationId: 'get-pages-by-id' })
  @Get(':id')
  findOne(@Param('id') id: string) { return this.service.findOne(+id); }

  @ApiOperation({ operationId: 'update-pages' })
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateLegalPageDto) { return this.service.update(+id, dto); }

  @ApiOperation({ operationId: 'delete-pages' })
  @Delete(':id')
  remove(@Param('id') id: string) { return this.service.remove(+id); }
}
