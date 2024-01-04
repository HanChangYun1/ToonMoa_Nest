import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Member extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  name: string;

  @Column()
  phonenum: string;

  @Column()
  photo: string;

  @Column({ nullable: true, unique: true })
  connectKey?: string;

  @Column({ nullable: true, unique: true })
  secretKey?: string;
}
