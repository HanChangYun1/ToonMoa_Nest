import { Module } from "@nestjs/common";
import { MemberController } from "./member.controller";
import { MemberService } from "./member.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Member } from "./entity/member.entity";
import { StorageModule } from "./storage.module";
import { Storage } from "@google-cloud/storage";

@Module({
  imports: [
    TypeOrmModule.forFeature([Member]),
    StorageModule,
  ],
  controllers: [MemberController],
  providers: [MemberService, Storage],
  exports: [MemberService,Storage],
})
export class MemberModule {}
