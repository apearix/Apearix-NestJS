import { IsString, IsBoolean, IsOptional, IsNumber, IsNotEmpty } from 'class-validator';

export class CreateCategoryTypeDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  description: string;

}
