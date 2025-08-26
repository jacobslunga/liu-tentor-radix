export interface Solution {
  id: number;
  exam_id: number;
  pdf_url: string;
}

export interface ApiExam {
  id: number;
  course_code: string;
  exam_date: string;
  pdf_url: string;
}

export interface ApiResponse {
  exam: ApiExam;
  solutions: Solution[];
}
