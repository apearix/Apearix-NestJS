import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Job, JobApplication } from '../../entities';
import { SiteCareersController } from './site-careers.controller';
import { SiteCareersService } from './site-careers.service';
import { StorageModule } from '../../storage/storage.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Job, JobApplication]),
    StorageModule,
  ],
  controllers: [SiteCareersController],
  providers: [SiteCareersService],
  exports: [SiteCareersService],
})
export class SiteCareersModule {}
