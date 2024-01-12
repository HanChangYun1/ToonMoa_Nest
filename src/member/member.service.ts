import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Member } from "./entity/member.entity";
import { Repository } from "typeorm";
import { randomUUID } from "crypto";
import { JwtService } from "@nestjs/jwt";
import { UpdateUserDto } from "./dto/updateuser.dto";
import { Storage } from "@google-cloud/storage";

@Injectable()
export class MemberService {
  constructor(
    @InjectRepository(Member)
    private memberRepository: Repository<Member>
  ) {}

  async findByEmailOrSave(email, profile) {
    const name = profile.nickname;
    const photo = profile.profile_image_url;
    const isUser = await this.getUser(email);
    if (!isUser) {
      const newUser = await this.memberRepository.save({
        email,
        photo,
        name,
      });
      return newUser;
    }
    return isUser;
  }

  async getUser(email: string): Promise<Member> {
    const user = await this.memberRepository.findOne({
      where: { email: email },
    });
    return user;
  }

  async getMember(email) {
    try {
      const member = await this.getUser(email);
      return member;
    } catch (e) {
      console.error("잘못된 유저정보입니다:", e);
    }
  }
}
