import { Module } from "@nestjs/common";
import { LikeService } from "./like.service";
import { LikeController } from "./like.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Like } from "./entity/like.entity";
import { MemberModule } from "src/member/member.module";
import { GalleryModule } from "src/gallery/gallery.module";

@Module({
  imports: [TypeOrmModule.forFeature([Like]), MemberModule, GalleryModule],
  providers: [LikeService],
  controllers: [LikeController],
})
export class LikeModule {}
