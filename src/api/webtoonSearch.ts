import axios from "axios";

interface WebtoonResult {
  title: string;
  author: string;
}

interface ApiResponse {
  results: WebtoonResult[];
}

export async function webtoonSearch(keyword: string): Promise<void> {
  try {
    const apiURL = "https://korea-webtoon-api.herokuapp.com/search";
    const params = { keyword };
    const response = await axios.get<ApiResponse>(apiURL, { params });
    const data = response.data;

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
