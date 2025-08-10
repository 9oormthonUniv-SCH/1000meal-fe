import axios from 'axios';
import { Store } from "@/types/store";

export async function getStoreList(): Promise<Store[]> {
  try {
    const response = await axios.get<Store[]>(`${process.env.NEXT_PUBLIC_API_URL}/stores`);
    return response.data;
  } catch (error) {
    console.error('가게 목록을 불러오는데 실패했습니다:', error);
    return [];
  }
}