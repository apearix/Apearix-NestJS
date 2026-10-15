import { PartialType } from '@nestjs/swagger';
import { CreateLegalPageDto } from './create-pages.dto';

export class UpdateLegalPageDto extends PartialType(CreateLegalPageDto) {}
