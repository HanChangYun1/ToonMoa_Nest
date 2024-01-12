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

export async function webtoonList(
  page: number = 0,
  perPage: number = 10,
  service: string | undefined = undefined,
  updateDay: string | undefined = undefined
): Promise<WebtoonInfo[]> {
  try {
    const response: AxiosResponse<ApiResponse> = await axios.get(
      `${apiURL}/?service=${service}`
    );
    const data = response.data;

    if (data && Array.isArray(data.webtoons)) {
      const sortedWebtoons = data.webtoons.sort(
        (a, b) => (b.fanCount || 0) - (a.fanCount || 0)
      );
      return sortedWebtoons.map((webtoon) => ({
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

export async function getWebtoonsByService(service: string) {
  return webtoonList(0, 10, service);
}

export async function getKakaoWebtoons() {
  return getWebtoonsByService("kakao");
}

export async function getNaverWebtoons() {
  return getWebtoonsByService("naver");
}
