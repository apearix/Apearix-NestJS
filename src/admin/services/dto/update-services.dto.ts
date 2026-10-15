import { PartialType } from '@nestjs/mapped-types';
import { CreateServiceEntityDto } from './create-services.dto';

export class UpdateServiceEntityDto extends PartialType(CreateServiceEntityDto) {}
