import { API_ENDPOINTS } from "../api/endpoints";
import { fetcher } from "../api/fetchers";
import useSWR from "swr";

export interface CourseExam {
  id: number;
  course_code: string;
  exam_date: string;
  pdf_url: string;
  exam_name: string;
  has_solution: boolean;
  statistics: {
    "3"?: number;
    "4"?: number;
    "5"?: number;
    U?: number;
    G?: number;
  };
  pass_rate: number;
}

export interface CourseData {
  course_code: string;
  course_name_swe: string;
  course_name_eng: string;
  exams: CourseExam[];
}

export const useCourseExams = (courseCode: string) => {
  const { data, error, isLoading } = useSWR(
    courseCode ? API_ENDPOINTS.courseExams(courseCode) : null,
    fetcher,
    { revalidateOnFocus: false, shouldRetryOnError: false }
  );

  return {
    courseData: data as CourseData | undefined,
    isLoading,
    isError: error,
  };
};
