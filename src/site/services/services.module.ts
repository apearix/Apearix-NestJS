import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServiceEntity } from '../../entities';
import { SiteServicesController } from './services.controller';
import { SiteServicesService } from './services.service';

@Module({
  imports: [TypeOrmModule.forFeature([ServiceEntity])],
  controllers: [SiteServicesController],
  providers: [SiteServicesService],
})
export class SiteServicesModule {}
