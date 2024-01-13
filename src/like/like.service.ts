import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Like } from "./entity/like.entity";
import { Repository } from "typeorm";
import { MemberService } from "src/member/member.service";
import { GalleryService } from "src/gallery/gallery.service";

@Injectable()
export class LikeService {
  constructor(
    @InjectRepository(Like)
    private likeRepository: Repository<Like>,
    private memberService: MemberService,
    private galleryService: GalleryService
  ) {}

  async handleLike(email, galleryId) {
    const member = await this.memberService.getUser(email);
    const gallery = await this.galleryService.getGalleryOne(galleryId);
    const existLike = await this.likeRepository
      .createQueryBuilder("like")
      .where("like.member.id = :memberId", { memberId: member.id })
      .andWhere("like.gallery.id = :galleryId", { galleryId: gallery.id })
      .getOne();
    if (!existLike) {
      const newLikeToon = await this.likeRepository.save({
        member,
        gallery,
      });
    } else {
      await this.likeRepository.remove(existLike);
    }
  }

  async getCount(galleryId) {
    const gallery = await this.galleryService.getGalleryOne(galleryId);
    const galleryCount = await this.likeRepository
      .createQueryBuilder("like")
      .where("like.gallery.id = :galleryId", { galleryId: gallery.id })
      .getCount();
    return galleryCount;
  }
}
