import axios, { AxiosResponse } from "axios";

// TypeScript 인터페이스 정의
interface WebtoonInfo {
  _id: string;
  webtoonId: number;
  title: string;
  author: string;
  url: string;
  img: string;
  service: string;
  updateDays: string | string[]; // updateDays는 string 배열
  fanCount: number | null; // fanCount가 null일 수 있음
  searchKeyword: string;
  additional: AdditionalInfo;
}

interface AdditionalInfo {
  new: boolean;
  rest: boolean;
  up: boolean;
  adult: boolean;
  singularityList: string[]; // singularityList는 string 배열
}

interface ApiResponse {
  webtoons: WebtoonInfo[];
}

// API 요청 함수
async function WebtoonList(
  page: number = 0,
  perPage: number = 1,
  service: string | undefined = undefined,
  updateDay: string | undefined = undefined
): Promise<WebtoonInfo[]> {
  try {
    // API 엔드포인트와 요청 파라미터 설정
    const apiURL = "https://korea-webtoon-api.herokuapp.com";
    const params = { page, perPage, service, updateDay };

    // API에 GET 요청 보내기
    const response: AxiosResponse<ApiResponse> = await axios.get(apiURL, {
      params,
    });

    // 응답 데이터 확인
    const data = response.data;

    // API 응답이 정상적인 경우에만 결과 처리
    if (data && Array.isArray(data.webtoons)) {
      return data.webtoons.map((webtoon) => {
        return {
          ...webtoon,
          updateDays: Array.isArray(webtoon.updateDays)
            ? webtoon.updateDays.join(", ")
            : webtoon.updateDays,
        };
      });
    } else {
      console.error("Invalid API response:", data);
      return [];
    }
  } catch (error) {
    console.error("Error during API request:", error);
    return [];
  }
}

// 예시: 웹툰 정보 요청 및 출력
async function fetchAndPrintWebtoons() {
  const webtoonList = await WebtoonList();

  // 받아온 웹툰 정보 출력
  webtoonList.forEach((webtoon) => {
    console.log(webtoon);
  });
}

// 함수 호출
fetchAndPrintWebtoons();
