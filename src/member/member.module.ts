import { Module } from "@nestjs/common";
import { MemberController } from "./member.controller";
import { MemberService } from "./member.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Member } from "./entity/member.entity";
import { PassportModule } from "@nestjs/passport";
import { GoogleStrategy } from "./stratagy/google.strategy";
import { KakaoStrategy } from "./stratagy/kakao.strategy";
import { JwtModule } from "@nestjs/jwt";
import { StorageModule } from "./storage.module";
import { Storage } from "@google-cloud/storage";

@Module({
  imports: [
    TypeOrmModule.forFeature([Member]),
    PassportModule.register({ defaultStrategy: "google", session: true }),
    PassportModule.register({ defaultStrategy: "kakao", session: true }),
    JwtModule.register({
      secret: process.env.ACCESS_TOKEN_PRIVATE_KEY,
      signOptions: { expiresIn: "24h" },
    }),
    StorageModule,
  ],
  controllers: [MemberController],
  providers: [MemberService, GoogleStrategy, KakaoStrategy, Storage],
  exports: [MemberService],
})
export class MemberModule {}
