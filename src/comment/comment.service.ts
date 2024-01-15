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
    const gallery = await this.galleryService.getGalleryOne(galleryId);
    const comment = await this.commentRepository.save({
      member,
      gallery,
      content,
    });
    return comment;
  }

  async getCommentList(galleryId) {
    const gallery = await this.galleryService.getGalleryOne(galleryId);
    const commentList = await this.commentRepository
      .createQueryBuilder("comment")
      .leftJoinAndSelect("comment.member", "member")
      .leftJoinAndSelect("comment.gallery", "gallery")
      .where("comment.gallery.id = :galleryId", { galleryId: gallery.id })
      .orderBy("gallery.id", "ASC")
      .getMany();
    return commentList;
  }

  async updateComment(commentId, content) {
    const comment = await this.commentRepository.findOne(commentId);
    comment.content = content;
    await this.commentRepository.save(comment);
  }

  async deleteComment(commentId) {
    const comment = await this.commentRepository.findOne(commentId);
    await this.commentRepository.remove(comment);
  }
}
