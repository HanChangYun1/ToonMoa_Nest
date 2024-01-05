import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Member } from "../../member/entity/member.entity";

@Entity()
export class SearchHistory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  keyword: string;

  @ManyToOne(() => Member, (member) => member.searchHistory)
  member: Member;
}
