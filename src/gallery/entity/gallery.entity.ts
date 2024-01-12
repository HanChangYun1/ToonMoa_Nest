import { Comment } from "src/comment/entity/comment.entity";
import { Like } from "src/like/entity/like.entity";
import { Member } from "src/member/entity/member.entity";
import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Gallery extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  contents: string;

  @OneToMany(() => Comment, comment => comment.gallery , { cascade: ["remove"]})
  comments: Comment[];

  @ManyToOne(() => Member, (member) => member.gallerys)
  @JoinColumn()
  member: Member;

  @OneToMany(() => Like, (like) => like.gallery, { cascade: ["remove"]})
  likes: Like[];
}
