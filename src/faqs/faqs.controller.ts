import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { FaqsService } from './faqs.service';
import { CreateFaqDto } from './dto/create-faqs.dto';
import { UpdateFaqDto } from './dto/update-faqs.dto';
// import { JwtAuthGuard } from '../admin-auth/jwt-auth.guard';

// @UseGuards(JwtAuthGuard)
@Controller('api/v1/admin/faqs')
export class FaqsController {
  constructor(private readonly service: FaqsService) {}

  @Post()
  create(@Body() dto: CreateFaqDto) { return this.service.create(dto); }

  @Get()
  findAll() { return this.service.findAll(); }

  @Get(':id')
  findOne(@Param('id') id: string) { return this.service.findOne(+id); }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateFaqDto) { return this.service.update(+id, dto); }

  @Delete(':id')
  remove(@Param('id') id: string) { return this.service.remove(+id); }
}
