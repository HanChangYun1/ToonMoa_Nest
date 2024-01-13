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
    if (!member) return "잘못된 유저정보입니다.";

    const gallery = await this.galleryService.getGallery(galleryId);
    if (!gallery) return "잘못된 갤러리정보입니다.";

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
      return "좋아요 성공";
    } else {
      await this.likeRepository.remove(existLike);
      return "좋아요 취소 완료";
    }
  }

  async getCount(galleryId) {
    const gallery = await this.galleryService.getGallery(galleryId);
    if (!gallery) return "잘못된 갤러리정보입니다.";

    const galleryCount = await this.likeRepository
      .createQueryBuilder("like")
      .where("like.gallery.id = :galleryId", { galleryId: gallery.id })
      .getCount();

    return galleryCount;
  }
}
