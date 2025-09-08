import { ApiResponse } from "@/types/api";
import axios from "axios";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "https://api.liutentor.se/api",
  timeout: 10000,
});

export const fetchExamById = async (
  examId: string | number
): Promise<ApiResponse> => {
  const response = await apiClient.get(`/exams/${examId}`);
  return response.data;
};

export default apiClient;
