import { ApiOperation } from '@nestjs/swagger';
import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { FaqsService } from './faqs.service';
import { CreateFaqDto } from './dto/create-faqs.dto';
import { UpdateFaqDto } from './dto/update-faqs.dto';
// import { JwtAuthGuard } from '../admin-auth/jwt-auth.guard';

// @UseGuards(JwtAuthGuard)
@Controller('api/v1/admin/faqs')
export class FaqsController {
  constructor(private readonly service: FaqsService) {}

  @ApiOperation({ operationId: 'create-faqs' })
  @Post()
  create(@Body() dto: CreateFaqDto) { return this.service.create(dto); }

  @ApiOperation({ operationId: 'get-all-faqs' })
  @Get()
  findAll() { return this.service.findAll(); }

  @ApiOperation({ operationId: 'get-faqs-by-id' })
  @Get(':id')
  findOne(@Param('id') id: string) { return this.service.findOne(+id); }

  @ApiOperation({ operationId: 'update-faqs' })
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateFaqDto) { return this.service.update(+id, dto); }

  @ApiOperation({ operationId: 'delete-faqs' })
  @Delete(':id')
  remove(@Param('id') id: string) { return this.service.remove(+id); }
}
