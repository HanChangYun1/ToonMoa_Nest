import { Gallery } from "src/gallery/entity/gallery.entity";
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
  content: string;

  @Column({ default: false })
  isRemoved: boolean;

  @ManyToOne(() => Member, (member) => member.comments)
  @JoinColumn()
  member: Member;

  @ManyToOne(() => Gallery, (gallery) => gallery.comments)
  @JoinColumn()
  gallery: Gallery;

}
