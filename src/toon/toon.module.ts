import { Module } from "@nestjs/common";
import { ToonController } from "./toon.controller";

@Module({
  controllers: [ToonController],
})
export class ToonModule {}
