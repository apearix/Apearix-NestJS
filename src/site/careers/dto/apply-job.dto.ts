import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsOptional,
  MaxLength,
} from 'class-validator';

export class ApplyJobDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(120)
  first_name: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(120)
  last_name: string;

  @IsNotEmpty()
  @IsEmail()
  @MaxLength(160)
  email: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  phone?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  portfolio_url?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  linkedin_url?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  github_url?: string;

  @IsOptional()
  @IsString()
  cover_letter?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  current_ctc?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  expected_ctc?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  notice_period?: string;
}
