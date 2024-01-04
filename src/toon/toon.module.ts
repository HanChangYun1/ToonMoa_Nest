import { Module } from "@nestjs/common";
import { ToonController } from "./toon.controller";
import { ToonService } from "./toon.service";

@Module({
  controllers: [ToonController],
  providers: [ToonService],
})
export class ToonModule {}
