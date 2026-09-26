import { PartialType } from '@nestjs/mapped-types';
import { CreateLegalPageDto } from './create-legal-pages.dto';

export class UpdateLegalPageDto extends PartialType(CreateLegalPageDto) {}
