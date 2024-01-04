import { Comment } from "src/comment/entity/comment.entity";
import { Member } from "src/member/entity/member.entity";
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity()
export class Like extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  toonName: string;

  @Column()
  episode: string;

  @OneToOne(() => Member, (member) => member.like)
  @JoinColumn()
  member: Member;

  @OneToOne(() => Comment, (comment) => comment.like)
  @JoinColumn()
  comment: Comment;
}
