import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LegalPagesService } from './pages.service';
import { LegalPagesController } from './pages.controller';
import { LegalPage } from '../../entities';

@Module({
  imports: [TypeOrmModule.forFeature([LegalPage])],
  controllers: [LegalPagesController],
  providers: [LegalPagesService],
})
export class LegalPagesModule {}
