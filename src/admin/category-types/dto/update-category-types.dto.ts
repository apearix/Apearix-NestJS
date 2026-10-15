import { PartialType } from '@nestjs/mapped-types';
import { CreateCategoryTypeDto } from './create-category-types.dto';

export class UpdateCategoryTypeDto extends PartialType(CreateCategoryTypeDto) {}
