import axios, { AxiosResponse } from "axios";

export interface WebtoonInfo {
  _id: string;
  webtoonId: number;
  title: string;
  author: string;
  url: string;
  img: string;
  service: string;
  updateDays: string | string[];
  fanCount: number | null;
  searchKeyword: string;
  additional: AdditionalInfo;
}

export interface AdditionalInfo {
  new: boolean;
  rest: boolean;
  up: boolean;
  adult: boolean;
  singularityList: string[];
}

export interface ApiResponse {
  webtoons: WebtoonInfo[];
}

const apiURL = "https://korea-webtoon-api.herokuapp.com";
let currentPage = 0;

async function webtoonList(
  perPage: number = 10,
  service: string | undefined = undefined,
  date: string | undefined = undefined
): Promise<WebtoonInfo[]> {
  try {
    const response: AxiosResponse<ApiResponse> = await axios.get(
      `${apiURL}/?perPage=${perPage}&page=${currentPage}&service=${service}&updateDay=${date}`
    );
    console.log(
      `Url: ${apiURL}/?perPage=${perPage}&page=${currentPage}&service=${service}&updateDay=${date}`
    );

    const data = response.data;
    if (data && Array.isArray(data.webtoons)) {
      const webtoons = data.webtoons;
      if (webtoons.length > 0) {
        console.log(`Page ${currentPage + 1}:`, webtoons);
        currentPage++;
      } else {
        console.log("No more webtoons to fetch.");
      }

      return webtoons.map((webtoon) => ({
        ...webtoon,
        updateDays: Array.isArray(webtoon.updateDays)
          ? webtoon.updateDays.join(", ")
          : webtoon.updateDays,
      }));
    } else {
      console.error("Invalid API response:", data);
      return [];
    }
  } catch (error) {
    console.error("Error during API request:", error);
    return [];
  }
}

export async function getWebtoonsByUpdateDate(service: string, date: string) {
  return webtoonList(10, service, date);
}

export async function getWebtoonsByService(service: string) {
  return webtoonList(10, service);
}

export async function getKakaoWebtoons() {
  return getWebtoonsByService("kakao");
}

export async function getNaverWebtoons() {
  return getWebtoonsByService("naver");
}

export async function getKakaoWebtoonsByDate(date: string) {
  return getWebtoonsByUpdateDate("kakao", date);
}

export async function getNaverWebtoonsByDate(date: string) {
  return getWebtoonsByUpdateDate("naver", date);
}
