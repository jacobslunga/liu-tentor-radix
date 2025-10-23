export type Exam = {
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
    VG?: number;
    U?: number;
    G?: number;
  };
  pass_rate?: number;
};

export type CourseExamResponse = {
  course_code: string;
  course_name_swe: string;
  course_name_eng: string;
  exams: Exam[];
};

/**
 * course_code
: 
"TATA42"
exam_date
: 
"2025-08-28"
id
: 
15438
pdf_url
: 
"https:
 * 
 */

export type ExamWithSolutions = {
  exam: {
    course_code: string;
    exam_date: string;
    id: number;
    pdf_url: string;
  };
  solutions: {
    id: number;
    exam_id: number;
    pdf_url: string;
  }[];
};
