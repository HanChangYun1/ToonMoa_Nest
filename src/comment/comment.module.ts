import { Module } from "@nestjs/common";
import { CommentService } from "./comment.service";
import { CommentController } from "./comment.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Comment } from "./entity/comment.entity";
import { MemberModule } from "src/member/member.module";

@Module({
  imports: [TypeOrmModule.forFeature([Comment]), MemberModule],
  providers: [CommentService],
  controllers: [CommentController],
  exports: [CommentService],
})
export class CommentModule {}
