import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Like } from "./entity/like.entity";
import { Repository } from "typeorm";
import { MemberService } from "src/member/member.service";
import { CommentService } from "src/comment/comment.service";

@Injectable()
export class LikeService {
  constructor(
    @InjectRepository(Like)
    private likeRepository: Repository<Like>,
    private memberService: MemberService,
  ) {}

  
}
