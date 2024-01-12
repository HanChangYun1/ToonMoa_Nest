import { Module } from "@nestjs/common";
import { GalleryController } from "./gallery.controller";
import { GalleryService } from "./gallery.service";
import { MemberModule } from "src/member/member.module";
import { Gallery } from "./entity/gallery.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Storage } from "@google-cloud/storage";
import { StorageModule } from "src/member/storage.module";

@Module({
  imports: [TypeOrmModule.forFeature([Gallery]), MemberModule, StorageModule],
  controllers: [GalleryController],
  providers: [GalleryService, Storage],
  exports: [GalleryService],
})
export class GalleryModule {}
