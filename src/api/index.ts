/**
 * API Module
 *
 * This module provides a clean, typed interface for all API interactions.
 * All API responses follow the standard format: { success: boolean, message: string, payload: T | null }
 *
 * Exports:
 * - Types: ApiResponse, University, Exam, Solution, etc.
 * - Hooks: useCourseExams, useExamDetail
 * - Functions: getCourseExams, getExamDetail (for direct calls)
 */

import axios, { type AxiosInstance } from "axios";
import useSWR from "swr";

// ============================================================================
// Base Types
// ============================================================================

/**
 * Standard API response wrapper returned by all endpoints
 */
export type ApiResponse<T> = {
  success: boolean;
  message: string;
  payload: T | null;
};

/**
 * Supported universities
 */
export type University = "LIU" | "KTH" | "CTH" | "LTH";

// ============================================================================
// Domain Types - Exams
// ============================================================================

/**
 * Grade statistics for an exam
 */
export type ExamStatistics = {
  "3"?: number;
  "4"?: number;
  "5"?: number;
  U?: number;
  G?: number;
  VG?: number;
};

/**
 * Single exam in a course listing
 */
export type Exam = {
  id: number;
  course_code: string;
  exam_date: string;
  pdf_url: string;
  exam_name: string;
  has_solution: boolean;
  statistics?: ExamStatistics;
  pass_rate?: number;
};

/**
 * Solution for an exam
 */
export type Solution = {
  id: number;
  exam_id: number;
  pdf_url: string;
};

/**
 * Payload for GET /v1/exams/:university/:courseCode
 */
export type CourseExamsPayload = {
  courseCode: string;
  courseName: string;
  exams: Exam[];
};

/**
 * Single exam data (without solution join)
 */
export type ExamData = {
  id: number;
  course_code: string;
  exam_date: string;
  pdf_url: string;
};

/**
 * Payload for GET /v1/exams/:examId
 */
export type ExamDetailPayload = {
  exam: ExamData;
  solution: Solution | null;
};

// ============================================================================
// API Client (internal)
// ============================================================================

const BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "https://liutentor-api-production.up.railway.app/api";

const client: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

// ============================================================================
// Endpoints (internal)
// ============================================================================

const endpoints = {
  courseExams: (courseCode: string, university: University = "LIU") =>
    `/v1/exams/${university}/${courseCode}`,

  examDetail: (examId: number) => `/v1/exams/${examId}`,
} as const;

// ============================================================================
// Fetcher (internal)
// ============================================================================

async function fetcher<T>(url: string): Promise<T> {
  const response = await client.get<ApiResponse<T>>(url);
  const data = response.data;

  if (!data.success || data.payload === null) {
    throw new Error(data.message || "Request failed");
  }

  return data.payload;
}

// ============================================================================
// Hooks
// ============================================================================

/**
 * Hook to fetch all exams for a course
 */
export function useCourseExams(
  courseCode: string,
  university: University = "LIU",
) {
  const { data, error, isLoading } = useSWR<CourseExamsPayload>(
    courseCode ? endpoints.courseExams(courseCode, university) : null,
    fetcher,
    { revalidateOnFocus: false, shouldRetryOnError: false },
  );

  return {
    courseData: data,
    isLoading,
    isError: !!error,
  };
}

/**
 * Hook to fetch a single exam with its solution
 */
export function useExamDetail(examId: number) {
  const { data, error, isLoading } = useSWR<ExamDetailPayload>(
    examId ? endpoints.examDetail(examId) : null,
    fetcher,
    { revalidateOnFocus: false },
  );

  return {
    examDetail: data,
    isLoading,
    isError: !!error,
  };
}

// ============================================================================
// Direct API Functions (for non-hook usage)
// ============================================================================

/**
 * Fetches all exams for a course at a university
 */
export async function getCourseExams(
  courseCode: string,
  university: University = "LIU",
): Promise<CourseExamsPayload> {
  return fetcher<CourseExamsPayload>(
    endpoints.courseExams(courseCode, university),
  );
}

/**
 * Fetches a single exam with its solution
 */
export async function getExamDetail(
  examId: number,
): Promise<ExamDetailPayload> {
  return fetcher<ExamDetailPayload>(endpoints.examDetail(examId));
}
