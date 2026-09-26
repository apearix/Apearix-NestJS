import { ApiOperation } from '@nestjs/swagger';
import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ServicesService } from './services.service';
import { CreateServiceEntityDto } from './dto/create-services.dto';
import { UpdateServiceEntityDto } from './dto/update-services.dto';
// import { JwtAuthGuard } from '../admin-auth/jwt-auth.guard';

// @UseGuards(JwtAuthGuard)
@Controller('api/v1/admin/services')
export class ServicesController {
  constructor(private readonly service: ServicesService) {}

  @ApiOperation({ operationId: 'create-services' })
  @Post()
  create(@Body() dto: CreateServiceEntityDto) { return this.service.create(dto); }

  @ApiOperation({ operationId: 'get-all-services' })
  @Get()
  findAll() { return this.service.findAll(); }

  @ApiOperation({ operationId: 'get-services-by-id' })
  @Get(':id')
  findOne(@Param('id') id: string) { return this.service.findOne(+id); }

  @ApiOperation({ operationId: 'update-services' })
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateServiceEntityDto) { return this.service.update(+id, dto); }

  @ApiOperation({ operationId: 'delete-services' })
  @Delete(':id')
  remove(@Param('id') id: string) { return this.service.remove(+id); }
}
