import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Like } from "./entity/like.entity";
import { Repository } from "typeorm";

@Injectable()
export class LikeService {
  constructor(
    @InjectRepository(Like)
    private memberRepository: Repository<Like>
  ) {}
}
