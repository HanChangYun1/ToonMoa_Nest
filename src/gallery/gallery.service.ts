import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Gallery } from "./entity/gallery.entity";
import { Repository } from "typeorm";
import { Storage } from "@google-cloud/storage";
import { Member } from "src/member/entity/member.entity";
import { randomUUID } from "crypto";
import { MemberService } from "src/member/member.service";

@Injectable()
export class GalleryService {
  constructor(
    @InjectRepository(Gallery)
    private galleryRepository: Repository<Gallery>,
    private storage: Storage,
    private memberService: MemberService
  ) {
    this.storage = new Storage({
      projectId: "toonmoa",
      keyFilename: "./toonmoa-3bbc9ada2044.json",
    });
  }
  private readonly bucketName = process.env.GCP_BUCKETNAME;

  async createGallery(email: string, photos) {
    const contents = [];
    const member = await this.memberService.getUser(email);

    if (!member) return "잘못된 유저정보 입니다.";
    if (photos && photos.length > 0) {
      for (const photo of photos) {
        const photoUrl = await this.imageUpload(photo, member);
        contents.push(photoUrl);
      }
    }

    const gallery = await this.galleryRepository.save({
      member,
      contents: contents,
    });
    return gallery;
  }

  async getGalleryById(id: number): Promise<Gallery> {
    const gallery = await this.galleryRepository
      .createQueryBuilder("gallery")
      .leftJoinAndSelect("gallery.member", "member")
      .where("gallery.id = :galleryId", { galleryId: id })
      .getOne();

    if (!gallery) {
      throw new Error(`Gallery with ID ${id} not found`);
    }

    return gallery;
  }

  async getAllGallery(page: number = 1) {
    const galleryList = await this.galleryRepository
      .createQueryBuilder("gallery")
      .leftJoinAndSelect("gallery.member", "member")
      .orderBy("gallery.id", "DESC")
      .skip((page - 1) * 10)
      .take(10)
      .getMany();
    return galleryList;
  }

  async getMyGallery(email: string, page: number = 1) {
    const member = await this.memberService.getUser(email);
    if (!member) return "잘못된 유저정보 입니다.";

    const galleryList = await this.galleryRepository
      .createQueryBuilder("gallery")
      .leftJoinAndSelect("gallery.member", "member")
      .where("gallery.member.id = :memberId", { memberId: member.id })
      .orderBy("gallery.id", "DESC")
      .skip((page - 1) * 10)
      .take(10)
      .getMany();
    return galleryList;
  }

  async updateGallery(email: string, photos, galleryId) {
    const contents = [];
    const member = await this.memberService.getUser(email);
    if (!member) return "잘못된 유저정보 입니다.";

    const gallery = await this.getGallery(galleryId);
    if (gallery.member.id != member.id) return "권한이 없습니다";

    if (photos && photos.length > 0) {
      gallery.contents = [];
      for (const photo of photos) {
        const photoUrl = await this.imageUpload(photo, member);
        gallery.contents.push(photoUrl);
      }
    }

    const updateGallery = await this.galleryRepository.save(gallery);
    return updateGallery;
  }

  async deleteGallery(email: string, galleryId) {
    try {
      const member = await this.memberService.getUser(email);
      if (!member) return "잘못된 유저정보 입니다.";

      const gallery = await this.getGallery(galleryId);
      if (gallery.member.id != member.id) return "권한이 없습니다";

      await this.galleryRepository.remove(gallery);

      return "갤러리가 삭제되었습니다.";
    } catch (e) {
      throw new Error(e);
    }
  }

  async getGallery(galleryId: string): Promise<Gallery> {
    const gallery = await this.galleryRepository
      .createQueryBuilder("gallery")
      .leftJoinAndSelect("gallery.member", "member")
      .where("gallery.id = :galleryId", { galleryId: Number(galleryId) })
      .getOne();
    return gallery;
  }

  async imageUpload(photo, member: Member) {
    const fileName = `${Date.now()}_${randomUUID()}`;

    const bucket = this.storage.bucket(this.bucketName);

    const blob = bucket.file(fileName);

    const blobStream = blob.createWriteStream();

    return await new Promise<string>((resolve, reject) => {
      blobStream.on("error", (error) => {
        throw new Error(`Unable to upload profile picture: ${error}`);
      });

      blobStream.on("finish", async () => {
        console.log("Finish event triggered");
        const photoUrl = `https://storage.googleapis.com/${this.bucketName}/${fileName}`;
        resolve(photoUrl);
      });

      blobStream.end(photo.buffer);
    });
  }
}
