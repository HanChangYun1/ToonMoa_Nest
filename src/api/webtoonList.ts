import axios, { AxiosResponse } from "axios";

interface WebtoonInfo {
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

interface AdditionalInfo {
  new: boolean;
  rest: boolean;
  up: boolean;
  adult: boolean;
  singularityList: string[];
}

interface ApiResponse {
  webtoons: WebtoonInfo[];
}

export async function WebtoonList(
  page: number = 0,
  perPage: number = 10,
  service: string | undefined = undefined,
  updateDay: string | undefined = undefined
): Promise<WebtoonInfo[]> {
  try {
    const apiURL = "https://korea-webtoon-api.herokuapp.com";
    const params = { page, perPage, service, updateDay };
    const response: AxiosResponse<ApiResponse> = await axios.get(apiURL, {
      params,
    });
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

export async function WebtoonServiceList(service: string) {
  const serviceWebtoons = await WebtoonList(0, 10, service);
  return serviceWebtoons;
}

export async function WebtoonDateList(service: string, updateday: string) {
  const dateWebtoons = await WebtoonList(0, 10, service, updateday);
  return dateWebtoons;
}
