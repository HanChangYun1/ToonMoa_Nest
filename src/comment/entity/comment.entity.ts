import { Like } from "src/like/entity/like.entity";
import { Member } from "src/member/entity/member.entity";
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity()
export class Comment extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  service: string;

  @Column()
  webtoonId: string;

  @Column()
  content: string;

  @Column({ default: false })
  isRemoved: boolean;

  @ManyToOne(() => Comment, (parent) => parent.children, { nullable: true })
  @JoinColumn({ name: "parentId" })
  parent: Comment;

  @OneToMany(() => Comment, (children) => children.parent, {
    nullable: true,
    cascade: ["remove"],
  })
  @JoinColumn()
  children: Comment[];

  @ManyToOne(() => Member, (member) => member.comments)
  @JoinColumn()
  member: Member;

  @OneToMany(() => Like, (like) => like.comment, { nullable: true })
  likes: Like[];
}
