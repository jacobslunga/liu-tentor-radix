import { API_ENDPOINTS } from "../api/endpoints";
import { ExamWithSolutions } from "@/types/exam";
import { fetcher } from "../api/fetchers";
import useSWR from "swr";

export interface ExamDetail {
  examDetail: ExamWithSolutions;
  isLoading: any;
  isError: any;
}

export const useExamDetails = (examId: number): ExamDetail => {
  const { data, error, isLoading } = useSWR(
    API_ENDPOINTS.examDetails(examId),
    fetcher,
    { revalidateOnFocus: false }
  );

  return {
    examDetail: data,
    isLoading,
    isError: error,
  };
};
