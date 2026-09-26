import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { LegalPagesService } from './legal-pages.service';
import { CreateLegalPageDto } from './dto/create-legal-pages.dto';
import { UpdateLegalPageDto } from './dto/update-legal-pages.dto';
// import { JwtAuthGuard } from '../admin-auth/jwt-auth.guard';

// @UseGuards(JwtAuthGuard)
@Controller('api/v1/admin/legal-pages')
export class LegalPagesController {
  constructor(private readonly service: LegalPagesService) {}

  @Post()
  create(@Body() dto: CreateLegalPageDto) { return this.service.create(dto); }

  @Get()
  findAll() { return this.service.findAll(); }

  @Get(':id')
  findOne(@Param('id') id: string) { return this.service.findOne(+id); }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateLegalPageDto) { return this.service.update(+id, dto); }

  @Delete(':id')
  remove(@Param('id') id: string) { return this.service.remove(+id); }
}
