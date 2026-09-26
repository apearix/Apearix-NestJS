import { ApiOperation } from '@nestjs/swagger';
import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { BlogsService } from './blogs.service';
import { CreateBlogDto } from './dto/create-blogs.dto';
import { UpdateBlogDto } from './dto/update-blogs.dto';
// import { JwtAuthGuard } from '../admin-auth/jwt-auth.guard';

// @UseGuards(JwtAuthGuard)
@Controller('api/v1/admin/blogs')
export class BlogsController {
  constructor(private readonly service: BlogsService) {}

  @ApiOperation({ operationId: 'create-blogs' })
  @Post()
  create(@Body() dto: CreateBlogDto) { return this.service.create(dto); }

  @ApiOperation({ operationId: 'get-all-blogs' })
  @Get()
  findAll() { return this.service.findAll(); }

  @ApiOperation({ operationId: 'get-blogs-by-id' })
  @Get(':id')
  findOne(@Param('id') id: string) { return this.service.findOne(+id); }

  @ApiOperation({ operationId: 'update-blogs' })
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateBlogDto) { return this.service.update(+id, dto); }

  @ApiOperation({ operationId: 'delete-blogs' })
  @Delete(':id')
  remove(@Param('id') id: string) { return this.service.remove(+id); }
}
