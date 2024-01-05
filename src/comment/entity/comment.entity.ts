import { Like } from "src/like/entity/like.entity";
import { Member } from "src/member/entity/member.entity";
import {
  BaseEntity,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity()
export class Comment extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToMany(() => Like, (like) => like.comment)
  likes: Like[];
}
