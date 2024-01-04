import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";
import { MemberModule } from "./member/member.module";
import { ToonModule } from "./toon/toon.module";
import { SearchModule } from "./search/search.module";
import { SocketModule } from "./socket/socket.module";

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: "postgres",
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [__dirname + "/**/*.entity{.ts,.js}"],
      synchronize: true,
    }),
    MemberModule,
    ToonModule,
    SearchModule,
    SocketModule,
  ],
})
export class AppModule {}
