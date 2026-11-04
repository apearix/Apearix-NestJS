import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsOptional,
  IsBoolean,
  IsNumber,
  IsArray,
  IsDateString,
  MaxLength,
} from 'class-validator';
import { JobStatus, JobType, WorkplaceType } from '../../../entities';

export class CreateJobDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(250)
  title: string;

  @IsOptional()
  @IsString()
  @MaxLength(260)
  slug?: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  department: string;

  @IsOptional()
  @IsEnum(JobType)
  job_type?: JobType;

  @IsOptional()
  @IsEnum(WorkplaceType)
  workplace_type?: WorkplaceType;

  @IsOptional()
  @IsString()
  @MaxLength(150)
  location?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  experience_level?: string;

  @IsOptional()
  @IsNumber()
  salary_min?: number;

  @IsOptional()
  @IsNumber()
  salary_max?: number;

  @IsOptional()
  @IsString()
  @MaxLength(10)
  salary_currency?: string;

  @IsOptional()
  @IsBoolean()
  is_salary_disclosed?: boolean;

  @IsNotEmpty()
  @IsString()
  overview: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  responsibilities?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  requirements?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  benefits?: string[];

  @IsOptional()
  @IsEnum(JobStatus)
  status?: JobStatus;

  @IsOptional()
  @IsBoolean()
  is_featured?: boolean;

  @IsOptional()
  @IsNumber()
  order?: number;

  @IsOptional()
  @IsDateString()
  deadline?: string;
}
