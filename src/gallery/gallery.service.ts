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

  async createGallery(email, photos) {
    try {
      const contents = [];
      const member = await this.memberService.getUser(email);

      if (!member) return "잘못된 유저정보 입니다.";
      if (photos && photos.length > 0) {
        for (const photo of photos) {
          const photoUrl = await this.imageUpload(photo, member);
          contents.push(photoUrl);
        }
      }
      console.log(contents);

      const gallery = await this.galleryRepository.save({
        member,
        contents: contents,
      });
      return gallery;
    } catch (e) {
      throw new Error(e);
    }
  }

  async imageUpload(photo, member: Member) {
    const fileName = `${Date.now()}_${randomUUID()}`;
    // console.log(fileName);

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
        console.log(photoUrl);

        resolve(photoUrl);
      });

      blobStream.end(photo.buffer);
    });
  }
}
