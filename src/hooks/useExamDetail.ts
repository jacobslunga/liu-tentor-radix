import useSWR from "swr";
import { API_ENDPOINTS } from "../api/endpoints";
import { fetcher } from "../api/fetchers";
import { ExamWithSolutions } from "@/types/exam";

interface ExamDetail {
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
