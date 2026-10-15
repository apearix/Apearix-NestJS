import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  BadRequestException,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

@ApiTags('Admin - Roles')
@Controller(['api/v1/admin/roles', 'roles'])
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @ApiOperation({ summary: 'create-role', operationId: 'create-role' })
  @Post()
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.rolesService.create(createRoleDto);
  }

  @ApiOperation({ summary: 'get-all-roles', operationId: 'get-all-roles' })
  @Get()
  findAll() {
    return this.rolesService.findAll();
  }

  @ApiOperation({ summary: 'bulk-delete-roles', operationId: 'bulk-delete-roles' })
  @Post('bulk-delete')
  bulkDelete(@Body() body: { ids: string[] }) {
    return this.rolesService.bulkDelete(body.ids);
  }

  @ApiOperation({ summary: 'bulk-import-roles', operationId: 'bulk-import-roles' })
  @Post('bulk-import')
  bulkImport(@Body() body: any) {
    let items: any[] = [];
    if (Array.isArray(body)) {
      items = body;
    } else if (body && Array.isArray(body.items)) {
      items = body.items;
    } else if (body && Array.isArray(body.data)) {
      items = body.data;
    } else if (body && Array.isArray(body.roles)) {
      items = body.roles;
    } else if (body && typeof body === 'object' && Object.keys(body).length > 0) {
      items = [body];
    }

    if (!items || items.length === 0) {
      throw new BadRequestException('Items array is required for bulk import');
    }
    return this.rolesService.bulkImport(items);
  }

  @ApiOperation({ summary: 'get-role-by-id', operationId: 'get-role-by-id' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.rolesService.findOne(id);
  }

  @ApiOperation({ summary: 'update-role', operationId: 'update-role' })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    return this.rolesService.update(id, updateRoleDto);
  }

  @ApiOperation({ summary: 'delete-role', operationId: 'delete-role' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.rolesService.remove(id);
  }
}
