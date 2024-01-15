import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";
import { MemberModule } from "./member/member.module";
import { ToonModule } from "./toon/toon.module";
import { LikeModule } from "./like/like.module";
import { CommentModule } from "./comment/comment.module";
import { GalleryModule } from "./gallery/gallery.module";

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: "postgres",
      ...(process.env.DATABASE_URL
        ? { url: process.env.DATABASE_URL }
        : {
            host: process.env.DB_HOST,
            port: +process.env.DB_PORT,
            username: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_DATABASE,
            entities: [__dirname + "/**/*.entity{.ts,.js}"],
          }),
      synchronize: true,
      // ssl: {
      //   rejectUnauthorized: false,
      // },
    }),
    MemberModule,
    ToonModule,
    LikeModule,
    CommentModule,
    GalleryModule,
  ],
})
export class AppModule {}
