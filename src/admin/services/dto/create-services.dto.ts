import { IsString, IsBoolean, IsOptional, IsNotEmpty } from 'class-validator';

export class CreateServiceEntityDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsString()
  icon: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
