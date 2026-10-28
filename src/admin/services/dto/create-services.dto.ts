import { IsString, IsBoolean, IsOptional, IsNotEmpty, IsUUID } from 'class-validator';

export class CreateServiceEntityDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  slug?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNotEmpty()
  @IsString()
  icon: string;

  @IsOptional()
  @IsString()
  featured_image?: string;

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
