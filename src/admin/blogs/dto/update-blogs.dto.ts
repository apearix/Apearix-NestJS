import { PartialType } from '@nestjs/mapped-types';
import { CreateBlogDto } from './create-blogs.dto';

export class UpdateBlogDto extends PartialType(CreateBlogDto) {}
