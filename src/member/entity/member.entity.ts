import { Like } from "src/like/entity/like.entity";
import { SearchHistory } from "src/search/entity/search.entity";
import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
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

  @OneToMany(() => Like, (like) => like.member)
  like: Like;

  @OneToMany(() => SearchHistory, (searchHistory) => searchHistory.member)
  searchHistory: SearchHistory[];
}
