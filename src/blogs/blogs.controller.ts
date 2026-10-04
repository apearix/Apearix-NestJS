import { ApiOperation, ApiConsumes } from '@nestjs/swagger';
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
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { BlogsService } from './blogs.service';
import { CreateBlogDto, BulkImportBlogDto } from './dto/create-blogs.dto';
import { UpdateBlogDto } from './dto/update-blogs.dto';

@Controller('api/v1/admin/blogs')
export class BlogsController {
  constructor(private readonly service: BlogsService) {}

  @ApiOperation({ operationId: 'upload-blog-image' })
  @ApiConsumes('multipart/form-data')
  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: join(process.cwd(), 'src', 'storage'),
        filename: (req: any, file: any, callback: (error: Error | null, filename: string) => void) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          callback(null, `blog-${uniqueSuffix}${ext}`);
        },
      }),
      fileFilter: (req: any, file: any, callback: (error: Error | null, acceptFile: boolean) => void) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|gif|webp|svg\+xml)$/)) {
          return callback(new BadRequestException('Only image files are allowed!'), false);
        }
        callback(null, true);
      },
      limits: { fileSize: 5 * 1024 * 1024 },
    }),
  )
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }
    return {
      success: true,
      url: `/api/proxy/storage/${file.filename}`,
      filename: file.filename,
    };
  }

  @ApiOperation({ operationId: 'create-blogs' })
  @Post()
  create(@Body() dto: CreateBlogDto) {
    return this.service.create(dto);
  }

  @ApiOperation({ operationId: 'get-all-blogs' })
  @Get()
  findAll() {
    return this.service.findAll();
  }

  @ApiOperation({ operationId: 'bulk-status-blogs' })
  @Post('bulk-status')
  bulkStatus(@Body() body: { ids: string[]; status: string }) {
    return this.service.bulkStatus(body.ids, body.status);
  }

  @ApiOperation({ operationId: 'bulk-delete-blogs' })
  @Post('bulk-delete')
  bulkDelete(@Body() body: { ids: string[] }) {
    return this.service.bulkDelete(body.ids);
  }

  @ApiOperation({ operationId: 'bulk-import-blogs' })
  @Post('bulk-import')
  bulkImport(@Body() body: any) {
    let items: any[] = [];
    if (Array.isArray(body)) {
      items = body;
    } else if (body && Array.isArray(body.items)) {
      items = body.items;
    } else if (body && Array.isArray(body.data)) {
      items = body.data;
    } else if (body && Array.isArray(body.blogs)) {
      items = body.blogs;
    } else if (body && typeof body === 'object' && Object.keys(body).length > 0) {
      items = [body];
    }

    if (!items || items.length === 0) {
      throw new BadRequestException('Items array is required for bulk import');
    }
    return this.service.bulkImport(items);
  }

  @ApiOperation({ operationId: 'get-blogs-by-id' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @ApiOperation({ operationId: 'update-blogs' })
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateBlogDto) {
    return this.service.update(id, dto);
  }

  @ApiOperation({ operationId: 'delete-blogs' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
