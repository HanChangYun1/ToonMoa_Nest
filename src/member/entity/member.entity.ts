import { Like } from "src/like/entity/like.entity";
import {
  BaseEntity,
  Column,
  Entity,
  OneToOne,
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

  @Column({ nullable: true })
  phonenum: string;

  @Column()
  photo: string;

  @Column({ nullable: true, unique: true })
  connectKey?: string;

  @Column({ nullable: true, unique: true })
  secretKey?: string;

  @OneToOne(() => Like, (like) => like.member)
  like: Like;
}
