import { Comment } from "src/comment/entity/comment.entity";
import { Member } from "src/member/entity/member.entity";
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity()
export class Like extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  service: string;

  @Column()
  webtoonId: string;

  @Column({ nullable: true })
  episode: string;

  @ManyToOne(() => Member, (member) => member.likes, { onDelete: "CASCADE" })
  @JoinColumn()
  member: Member;

  @ManyToOne(() => Comment, (comment) => comment.likes, {
    nullable: true,
    onDelete: "CASCADE",
  })
  @JoinColumn()
  comment: Comment;
}
