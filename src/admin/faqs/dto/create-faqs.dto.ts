import { IsString, IsBoolean, IsOptional, IsNumber, IsNotEmpty } from 'class-validator';

export class CreateFaqDto {
  @IsNotEmpty()
  @IsString()
  question: string;

  @IsNotEmpty()
  @IsString()
  answer: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsNumber()
  order?: number;

  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}
