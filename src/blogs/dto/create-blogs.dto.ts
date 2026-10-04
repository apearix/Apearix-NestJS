import {
  IsString,
  IsBoolean,
  IsOptional,
  IsNotEmpty,
  IsEnum,
  ValidateNested,
  MaxLength,
  Matches,
  IsArray,
  IsDateString,
  IsUUID,
} from 'class-validator';
import { Type } from 'class-transformer';
import { BlogStatus } from '../entities/blogs.entity';

export class PublishingDto {
  @IsOptional()
  @IsEnum(BlogStatus)
  status?: BlogStatus;

  @IsOptional()
  @IsString()
  author_id?: string;

  @IsOptional()
  @IsString()
  published_at?: string | null;
}

export class SeoDto {
  @IsOptional()
  @IsString()
  @MaxLength(60, { message: 'Meta title 60 characters se chota hona chahiye' })
  meta_title?: string;

  @IsOptional()
  @IsString()
  @MaxLength(160, { message: 'Meta description 160 characters se chota hona chahiye' })
  meta_description?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500, { message: 'Canonical URL 500 characters se zyada nahi ho sakta' })
  canonical_url?: string;
}

export class CreateBlogDto {
  @IsNotEmpty({ message: 'Title zaroori hai' })
  @IsString()
  @MaxLength(200, { message: 'Title 200 characters se zyada nahi ho sakta' })
  title: string;

  @IsNotEmpty({ message: 'Slug zaroori hai' })
  @IsString()
  @MaxLength(220, { message: 'Slug 220 characters se zyada nahi ho sakta' })
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message: 'Slug sirf lowercase letters, numbers aur hyphens (-) contain kar sakta hai',
  })
  slug: string;

  @IsOptional()
  @IsBoolean()
  is_manual_slug?: boolean;

  @IsOptional()
  @IsString()
  @MaxLength(1000, { message: 'Excerpt 1,000 characters se zyada nahi ho sakta' })
  excerpt?: string;

  @IsNotEmpty({ message: 'Content zaroori hai' })
  @IsString()
  @MaxLength(100000, { message: 'Content 1,00,000 characters (HTML ke sath) se zyada nahi ho sakta' })
  content: string;

  @IsOptional()
  @IsString()
  featured_image?: string;

  @IsOptional()
  @IsEnum(BlogStatus)
  status?: BlogStatus;

  @IsOptional()
  @IsUUID('4', { message: 'author_id valid UUID honi chahiye' })
  author_id?: string;

  @IsOptional()
  @IsDateString()
  published_at?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(60, { message: 'Meta title 60 characters se chota hona chahiye' })
  meta_title?: string;

  @IsOptional()
  @IsString()
  @MaxLength(160, { message: 'Meta description 160 characters se chota hona chahiye' })
  meta_description?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500, { message: 'Canonical URL 500 characters se zyada nahi ho sakta' })
  canonical_url?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => PublishingDto)
  publishing?: PublishingDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => SeoDto)
  seo?: SeoDto;
}

export class BulkImportBlogDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateBlogDto)
  items: CreateBlogDto[];
}