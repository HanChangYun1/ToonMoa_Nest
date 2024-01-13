import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Comment } from "./entity/comment.entity";
import { Repository } from "typeorm";
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

  async updateComment(commentId, content) {
    const comment = await this.commentRepository.findOne(commentId);
    if (!comment) return "댓글을 찾을 수 없습니다.";

    comment.content = content;
    await this.commentRepository.save(comment);
    return "댓글이 성공적으로 수정되었습니다.";
  }

  async deleteComment(commentId) {
    const comment = await this.commentRepository.findOne(commentId);
    if (!comment) return "댓글을 찾을 수 없습니다.";

    await this.commentRepository.remove(comment);
    return "댓글이 성공적으로 삭제되었습니다.";
  }
}
