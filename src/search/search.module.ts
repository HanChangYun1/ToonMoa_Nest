import { Module } from "@nestjs/common";
import { SearchController } from "./search.controller";
import { SearchHistory } from "./entity/search.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Member } from "src/member/entity/member.entity";
import { SearchService } from "./search.service";

@Module({
  imports: [TypeOrmModule.forFeature([SearchHistory, Member])],
  controllers: [SearchController],
  providers: [SearchService],
})
export class SearchModule {}
