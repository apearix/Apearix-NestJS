import { IsString, IsBoolean, IsOptional, IsNumber, IsNotEmpty } from 'class-validator';

export class CreateLegalPageDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  slug: string;

  @IsNotEmpty()
  @IsString()
  content: string;

}
