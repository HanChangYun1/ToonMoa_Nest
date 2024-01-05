import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { SearchHistory } from "./entity/search.entity";
import { Member } from "src/member/entity/member.entity";

@Injectable()
export class SearchService {
  constructor(
    @InjectRepository(SearchHistory)
    private readonly searchHistoryRepository: Repository<SearchHistory>,
    @InjectRepository(Member)
    private readonly memberRepository: Repository<Member>
  ) {}

  async findMemberById(memberId: number): Promise<Member> {
    return await this.memberRepository.findOne({ where: { id: memberId } });
  }

  async addSearchHistory(member: Member, keyword: string): Promise<void> {
    const searchHistory = new SearchHistory();
    searchHistory.keyword = keyword;
    searchHistory.member = member;
    await this.searchHistoryRepository.save(searchHistory);
  }

  async getSearchHistory(member: Member): Promise<SearchHistory[]> {
    return this.searchHistoryRepository.find({
      where: { member: { id: member.id } },
      order: { id: "DESC" },
      take: 10,
    });
  }
}
