import { Module } from '@nestjs/common';
import { GalleryController } from './gallery.controller';
import { GalleryService } from './gallery.service';
import { MemberModule } from 'src/member/member.module';
import { Gallery } from './entity/gallery.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Gallery]), MemberModule],
  controllers: [GalleryController],
  providers: [GalleryService]
})
export class GalleryModule {}
