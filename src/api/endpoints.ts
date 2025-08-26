export const API_ENDPOINTS = {
  courseExams: (courseCode: string) => `/courses/${courseCode}/exams`,
  examDetails: (examId: number) => `/exams/${examId}`,
  upload: `/uploads`,
  approveUpload: (uploadId: number) => `/uploads/${uploadId}/approve`,
  deleteUpload: (uploadId: number) => `/uploads/${uploadId}`,
};
