import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiConsumes } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { UsersService } from './users.service';
import { StorageService } from '../../storage/storage.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@ApiTags('Admin - Users')
@Controller(['api/v1/admin/users', 'admin/users', 'users'])
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly storageService: StorageService,
  ) {}

  @ApiOperation({ summary: 'upload-user-avatar', operationId: 'upload-user-avatar' })
  @ApiConsumes('multipart/form-data')
  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      fileFilter: (req: any, file: any, callback: (error: Error | null, acceptFile: boolean) => void) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|gif|webp|svg\+xml)$/)) {
          return callback(new BadRequestException('Only image files are allowed!'), false);
        }
        callback(null, true);
      },
      limits: { fileSize: 5 * 1024 * 1024 },
    }),
  )
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }
    const result = await this.storageService.uploadFile(file, 'avatars');
    return {
      success: true,
      url: result.url,
      filename: result.filename,
    };
  }

  @ApiOperation({ summary: 'create-user', operationId: 'create-user' })
  @Post(['', 'create'])
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @ApiOperation({ summary: 'get-all-users', operationId: 'get-all-users' })
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @ApiOperation({ summary: 'bulk-status-users', operationId: 'bulk-status-users' })
  @Post('bulk-status')
  bulkStatus(@Body() body: { ids: string[]; status: string }) {
    return this.usersService.bulkStatus(body.ids, body.status);
  }

  @ApiOperation({ summary: 'bulk-delete-users', operationId: 'bulk-delete-users' })
  @Post('bulk-delete')
  bulkDelete(@Body() body: { ids: string[] }) {
    return this.usersService.bulkDelete(body.ids);
  }

  @ApiOperation({ summary: 'bulk-import-users', operationId: 'bulk-import-users' })
  @Post(['bulk-import', 'import'])
  bulkImport(@Body() body: any) {
    let items: any[] = [];
    if (Array.isArray(body)) {
      items = body;
    } else if (body && Array.isArray(body.items)) {
      items = body.items;
    } else if (body && Array.isArray(body.data)) {
      items = body.data;
    } else if (body && Array.isArray(body.users)) {
      items = body.users;
    } else if (body && typeof body === 'object' && Object.keys(body).length > 0) {
      items = [body];
    }

    if (!items || items.length === 0) {
      throw new BadRequestException('Items array is required for bulk import');
    }
    return this.usersService.bulkImport(items);
  }

  @ApiOperation({ summary: 'get-user-by-id', operationId: 'get-user-by-id' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @ApiOperation({ summary: 'update-user', description: 'Update user profile', operationId: 'update-user' })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @ApiOperation({ summary: 'delete-user', operationId: 'delete-user' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
