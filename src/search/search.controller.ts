import { Controller, Get, Body, Param } from "@nestjs/common";
import { SearchService } from "./search.service";
import { webtoonSearch } from "src/api/webtoonSearch";
import { SearchHistory } from "./entity/search.entity";

@Controller("search")
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get("/")
  async getSearchToon(
    @Param("memberId") memberId: number,
    @Body("keyword") keyword: string
  ): Promise<void> {
    const member = await this.searchService.findMemberById(memberId);
    await this.searchService.addSearchHistory(member, keyword);
    return await webtoonSearch(keyword);
  }

  @Get("/history/:memberId")
  async getSearchToonHistory(
    @Param("memberId") memberId: number
  ): Promise<SearchHistory[]> {
    const member = await this.searchService.findMemberById(memberId);
    return this.searchService.getSearchHistory(member);
  }
}
