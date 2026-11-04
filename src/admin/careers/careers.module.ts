import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Job, JobApplication } from '../../entities';
import { CareersController } from './careers.controller';
import { CareersService } from './careers.service';
import { ApplicationsController } from './applications.controller';
import { ApplicationsService } from './applications.service';

@Module({
  imports: [TypeOrmModule.forFeature([Job, JobApplication])],
  controllers: [CareersController, ApplicationsController],
  providers: [CareersService, ApplicationsService],
  exports: [CareersService, ApplicationsService],
})
export class CareersModule {}
