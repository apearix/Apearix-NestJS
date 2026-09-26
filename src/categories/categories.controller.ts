import { ApiOperation } from '@nestjs/swagger';
import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-categories.dto';
import { UpdateCategoryDto } from './dto/update-categories.dto';
// import { JwtAuthGuard } from '../admin-auth/jwt-auth.guard';

// @UseGuards(JwtAuthGuard)
@Controller('api/v1/admin/categories')
export class CategoriesController {
  constructor(private readonly service: CategoriesService) {}

  @ApiOperation({ operationId: 'create-categories' })
  @Post()
  create(@Body() dto: CreateCategoryDto) { return this.service.create(dto); }

  @ApiOperation({ operationId: 'get-all-categories' })
  @Get()
  findAll() { return this.service.findAll(); }

  @ApiOperation({ operationId: 'get-categories-by-id' })
  @Get(':id')
  findOne(@Param('id') id: string) { return this.service.findOne(+id); }

  @ApiOperation({ operationId: 'update-categories' })
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateCategoryDto) { return this.service.update(+id, dto); }

  @ApiOperation({ operationId: 'delete-categories' })
  @Delete(':id')
  remove(@Param('id') id: string) { return this.service.remove(+id); }
}
