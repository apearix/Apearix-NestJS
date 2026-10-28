import { IsString, IsBoolean, IsOptional, IsNumber, IsNotEmpty, IsUUID } from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  slug?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  price?: number;

  @IsOptional()
  @IsString()
  sku?: string;

  @IsOptional()
  @IsString()
  image_or_thumbnail?: string;

  @IsOptional()
  @IsUUID('4', { message: 'category_id must be a valid UUID' })
  category_id?: string;

  @IsOptional()
  @IsBoolean()
  is_active?: boolean;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean; // Backwards compatibility

  @IsOptional()
  @IsString()
  meta_title?: string;

  @IsOptional()
  @IsString()
  meta_description?: string;
}
