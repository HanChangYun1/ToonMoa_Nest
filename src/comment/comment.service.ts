import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Comment } from "./entity/comment.entity";
import { Repository, Transaction } from "typeorm";
import { MemberService } from "src/member/member.service";
import { GalleryService } from "src/gallery/gallery.service";

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>,
    private memberService: MemberService,
    private galleryService: GalleryService
  ) {}

  async createComment(email, galleryId, content) {
    const member = await this.memberService.getUser(email);
    if (!member) return "잘못된 유저정보입니다.";

    const gallery = await this.galleryService.getGallery(galleryId);
    if (!gallery) return "잘못된 갤러리정보입니다.";

    const comment = await this.commentRepository.save({
      member,
      gallery,
      content,
    });

    return comment;
  }

  async getCommentList(galleryId) {
    const gallery = await this.galleryService.getGallery(galleryId);
    if (!gallery) return "잘못된 갤러리정보입니다.";

    const commentList = await this.commentRepository
      .createQueryBuilder("comment")
      .where("comment.gallery.id = :galleryId", { galleryId: gallery.id })
      .getMany();
    return commentList;
  }
}
