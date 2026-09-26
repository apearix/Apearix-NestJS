import { ApiOperation } from '@nestjs/swagger';
import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { CategoryTypesService } from './category-types.service';
import { CreateCategoryTypeDto } from './dto/create-category-types.dto';
import { UpdateCategoryTypeDto } from './dto/update-category-types.dto';
// import { JwtAuthGuard } from '../admin-auth/jwt-auth.guard';

// @UseGuards(JwtAuthGuard)
@Controller('api/v1/admin/category-types')
export class CategoryTypesController {
  constructor(private readonly service: CategoryTypesService) {}

  @ApiOperation({ operationId: 'create-category-types' })
  @Post()
  create(@Body() dto: CreateCategoryTypeDto) { return this.service.create(dto); }

  @ApiOperation({ operationId: 'get-all-category-types' })
  @Get()
  findAll() { return this.service.findAll(); }

  @ApiOperation({ operationId: 'get-category-types-by-id' })
  @Get(':id')
  findOne(@Param('id') id: string) { return this.service.findOne(+id); }

  @ApiOperation({ operationId: 'update-category-types' })
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateCategoryTypeDto) { return this.service.update(+id, dto); }

  @ApiOperation({ operationId: 'delete-category-types' })
  @Delete(':id')
  remove(@Param('id') id: string) { return this.service.remove(+id); }
}
