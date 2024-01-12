import { Gallery } from "src/gallery/entity/gallery.entity";
import { Comment } from "src/comment/entity/comment.entity";
import { Like } from "src/like/entity/like.entity";
import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity()
export class Member extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  name: string;

  @Column()
  photo: string;

  @OneToMany(() => Gallery, (gallery) => gallery.member, { cascade: ['remove'] })
  gallerys: Gallery[];

  @OneToMany(() => Like, (like) => like.member)
  likes: Like[];

  @OneToMany(() => Comment, (comment) => comment.member, {
    cascade: ["remove"],
  })
  comments: Comment[];
}
