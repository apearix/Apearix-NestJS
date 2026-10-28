import { IsString, IsBoolean, IsOptional, IsNumber, IsNotEmpty, IsUUID } from 'class-validator';

export class CreateFaqDto {
  @IsNotEmpty()
  @IsString()
  question: string;

  @IsNotEmpty()
  @IsString()
  answer: string;

  @IsOptional()
  @IsUUID('4', { message: 'category_id must be a valid UUID' })
  category_id?: string;

  @IsOptional()
  @IsString()
  category?: string; // Fallback for legacy / raw category names

  @IsOptional()
  @IsNumber()
  order?: number;

  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}
