import { IsOptional, IsString, IsNumber, Min, Max } from 'class-validator';

export class UpdateApplicationNotesDto {
  @IsOptional()
  @IsString()
  admin_notes?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(5)
  rating?: number;
}
