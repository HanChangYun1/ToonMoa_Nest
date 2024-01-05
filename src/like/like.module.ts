import { Module } from "@nestjs/common";
import { LikeService } from "./like.service";
import { LikeController } from "./like.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Like } from "./entity/like.entity";
import { MemberModule } from "src/member/member.module";
import { CommentModule } from "src/comment/comment.module";

@Module({
  imports: [TypeOrmModule.forFeature([Like]), MemberModule, CommentModule],
  providers: [LikeService],
  controllers: [LikeController],
})
export class LikeModule {}
