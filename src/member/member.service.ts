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
    private memberRepository: Repository<Member>,
    private jwtService: JwtService,
    private storage: Storage
  ) {
    this.storage = new Storage({
      projectId: "toonmoa",
      keyFilename: "./toonmoa-3bbc9ada2044.json",
    });
  }
  private readonly bucketName = process.env.GCP_BUCKETNAME;

  async testLogin() {
    try {
      const member = await this.memberRepository.findOne({
        where: { email: "hansyooni11@gmail.com" },
      });
      const token = await this.login(member);
      const accessToken = `Bearer ${token}`;
      return accessToken;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async login(user: Member): Promise<string> {
    const payload = { email: user.email };
    const accesstoken = this.generateAccessToken(payload);
    return accesstoken;
  }

  private generateAccessToken(user: any): string {
    const secretKey = process.env.ACCESS_TOKEN_PRIVATE_KEY;
    const expiresIn = "24h";
    const accessToken = this.jwtService.sign(
      { user },
      { expiresIn, secret: secretKey }
    );
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
  async findByEmailOrSave2(email, profile){
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

  async update(token, dto: UpdateUserDto, photo) {
    try {
      const decodeToken = await this.decodeToken(token);
      const { user } = decodeToken;

      const member = await this.getUser(user.email);

      if (!member) return "잘못된 유저정보 입니다.";
      if (dto.name) member.name = dto.name;
      if (dto.phonenum) member.phonenum = dto.phonenum;
      if (photo) {
        await this.imageUpload(photo, member);
      }
      const updateBuyer = await this.memberRepository.save(member);
      return updateBuyer;
    } catch (e) {
      throw new Error(e);
    }
  }

  async imageUpload(photo, member: Member) {
    const fileName = `${Date.now()}_${randomUUID()}`;
    const bucket = this.storage.bucket(this.bucketName);

    const blob = bucket.file(fileName);

    const blobStream = blob.createWriteStream();

    await new Promise<void>((resolve, reject) => {
      blobStream.on("error", (error) => {
        throw new Error(`Unable to upload profile picture: ${error}`);
      });

      blobStream.on("finish", async () => {
        console.log("Finish event triggered");
        const photoUrl = `https://storage.googleapis.com/${this.bucketName}/${fileName}`;
        member.photo = photoUrl;
        resolve();
      });

      blobStream.end(photo.buffer);
    });
  }

  async withdrawal(token) {
    const decodeToken = await this.decodeToken(token);
    const { user } = decodeToken;

    const member = await this.getUser(user.email);
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

  async getMember(token) {
    try {
      const decodeToken = await this.decodeToken(token);

      const { user } = decodeToken;

      const member = await this.getUser(user.email);
      return member;
    } catch (e) {
      console.error("잘못된 유저정보입니다:", e);
    }
  }

  async decodeToken(token) {
    try {
      const verifiedToken = token.split(" ")[1];
      const decodeToken = this.jwtService.verify(verifiedToken, {
        secret: process.env.ACCESS_TOKEN_PRIVATE_KEY,
      });
      return decodeToken;
    } catch (e) {
      console.error("decodeToken Error:", e);
      return null;
    }
  }
}
