import { IsEnum, IsNotEmpty } from 'class-validator';
import { ApplicationStatus } from '../../../entities';

export class UpdateApplicationStatusDto {
  @IsNotEmpty()
  @IsEnum(ApplicationStatus)
  status: ApplicationStatus;
}
