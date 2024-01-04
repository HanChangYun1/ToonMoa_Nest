import axios from "axios";

interface WebtoonResult {
  title: string;
  author: string;
  // 여기에 다른 웹툰 정보에 대한 필드를 추가할 수 있습니다.
}

interface ApiResponse {
  results: WebtoonResult[];
}

export async function webtoonSearch(keyword: string): Promise<void> {
  try {
    // API 엔드포인트와 요청 파라미터 설정
    const apiURL = "https://korea-webtoon-api.herokuapp.com/search";
    const params = { keyword };

    // API에 GET 요청 보내기
    const response = await axios.get<ApiResponse>(apiURL, { params });

    // 응답 데이터 확인
    const data = response.data;

    // API 응답이 정상적인 경우에만 결과 처리
    if (data && Array.isArray(data.results)) {
      for (const result of data.results) {
        const { title, author } = result;
        console.log(`Title: ${title}, Author: ${author}`);
      }
    } else {
      console.error("Invalid API response:", data);
    }
  } catch (error) {
    console.error("Error during API request:", error);
  }
}

const result = webtoonSearch("호랑이형님");
console.log(result);
