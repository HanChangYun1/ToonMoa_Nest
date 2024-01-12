import { Module } from "@nestjs/common";
import { CommentService } from "./comment.service";
import { CommentController } from "./comment.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Comment } from "./entity/comment.entity";
import { MemberModule } from "src/member/member.module";
import { GalleryModule } from "src/gallery/gallery.module";

@Module({
  imports: [TypeOrmModule.forFeature([Comment]), MemberModule, GalleryModule],
  providers: [CommentService],
  controllers: [CommentController],
  exports: [CommentService],
})
export class CommentModule {}
