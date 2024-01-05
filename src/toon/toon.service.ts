import { Injectable } from "@nestjs/common";
import { WebtoonDateList, WebtoonServiceList } from "src/api/webtoonList";

@Injectable()
export class ToonService {
  getToonService(service: string) {
    WebtoonServiceList(service);
  }

  getToonDate(service: string, updateday: string) {
    WebtoonDateList(service, updateday);
  }
}
