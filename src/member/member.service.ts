import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { sign, verify } from "jsonwebtoken";
import { Member } from "./entity/member.entity";
import { Repository } from "typeorm";
import { randomUUID } from "crypto";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class MemberService {
  constructor(
    @InjectRepository(Member)
    private memberRepository: Repository<Member>,
    private jwtService: JwtService
  ) {}
  private storage: Storage;
  private readonly bucketName = process.env.GCP_BUCKETNAME;

  private generateAccessToken(user: any): string {
    const secretKey = process.env.ACCESS_TOKEN_PRIVATE_KEY;
    const expiresIn = "24h";
    const accessToken = sign({ user }, secretKey, { expiresIn });
    return accessToken;
  }

  async findByEmailOrSave(email, photo, name): Promise<Member> {
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

  // async update(token, dto: UpdateUserDto, photo) {
  //   const decodeToken = await this.decodeToken(token);
  //   const { user, type } = decodeToken;

  //   if (type === "localBuyer") {
  //     const localBuyer = await this.memberRepository.findOne({
  //       where: { email: user.email },
  //     });
  //     if (dto.email) localBuyer.email = dto.email;
  //     if (dto.name) localBuyer.name = dto.name;
  //     if (photo) {
  //       this.imageUpload(photo, localBuyer);
  //     }
  //     const updateBuyer = await this.memberRepository.save(localBuyer);
  //     return updateBuyer;
  //   } else if (type === "socialBuyer") {
  //     const socialBuyer = await this.memberRepository.findOne({
  //       where: { email: user.email },
  //     });
  //     if (dto.email) socialBuyer.email = dto.email;
  //     if (dto.name) socialBuyer.name = dto.name;
  //     if (photo) {
  //       this.imageUpload(photo, socialBuyer);
  //     }
  //     const updateBuyer = await this.memberRepository.save(socialBuyer);
  //     return updateBuyer;
  //   } else {
  //     return "잘못된 유저정보 입니다.";
  //   }
  // }

  async imageUpload(photo, buyer) {
    const fileName = `${Date.now()}_${randomUUID()}`;
    const bucket = this.storage.bucket(this.bucketName);
    const blob = bucket.file(fileName);
    const blobStream = blob.createWriteStream();

    await new Promise((resolve, reject) => {
      blobStream.on("error", (error) => {
        throw new Error(`Unable to upload profile picture: ${error}`);
      });

      blobStream.on("finish", async () => {
        const photoUrl = `https://storage.googleapis.com/${this.bucketName}/${fileName}`;
        buyer.photo = photoUrl;
      });

      blobStream.end(photo.buffer);
    });
  }

  async withdrawal(token) {
    const decodeToken = await this.decodeToken(token);
    const { user, type } = decodeToken;

    const member = await this.memberRepository.findOne({
      where: { email: user.email },
    });
    if (!member) return "잘못된 유저정보입니다.";

    const deleteResult = await this.memberRepository.delete({
      id: member.id,
    });
    if (deleteResult.affected === 1) {
      return "삭제 성공!";
    } else {
      return "삭제 실패";
    }
  }

  async getBuyer(token) {
    const decodeToken = await this.decodeToken(token);
    const { user, type } = decodeToken;

    const member = await this.memberRepository.findOne({
      where: { email: user.email },
    });
    if (!member) return "잘못된 유저정보입니다.";
    return member;
  }

  async decodeToken(token) {
    try {
      const verifiedToken = token.split(" ")[1];
      const decodeToken2 = this.jwtService.verify(verifiedToken, {
        secret: process.env.ACCESS_TOKEN_PRIVATE_KEY,
      });
      const decodeToken = verify(
        verifiedToken,
        process.env.ACCESS_TOKEN_PRIVATE_KEY
      );
      return decodeToken2;
    } catch (e) {
      console.error("decodeToken Error:", e);
      return null;
    }
  }
}
