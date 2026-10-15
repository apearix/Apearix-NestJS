import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LegalPage } from '../../entities';
import { SitePagesController } from './pages.controller';
import { SitePagesService } from './pages.service';

@Module({
  imports: [TypeOrmModule.forFeature([LegalPage])],
  controllers: [SitePagesController],
  providers: [SitePagesService],
})
export class SitePagesModule {}
