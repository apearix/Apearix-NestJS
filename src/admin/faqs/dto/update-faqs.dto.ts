import { PartialType } from '@nestjs/swagger';
import { CreateFaqDto } from './create-faqs.dto';

export class UpdateFaqDto extends PartialType(CreateFaqDto) {}
