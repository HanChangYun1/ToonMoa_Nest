import { Like } from "src/like/entity/like.entity";
import { Member } from "src/member/entity/member.entity";
import {
  BaseEntity,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity()
export class Comment extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Like, (like) => like.comment)
  @JoinColumn()
  like: Like;
}
