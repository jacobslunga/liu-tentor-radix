export type QuizQuestion = {
  id: number;
  question: string;
  options: string[];
  answer: number;
};

export type MultipleChoiceQuizResponse = {
  quiz: {
    questions: QuizQuestion[];
  };
  meta: {
    courseCode: string;
    sourceExamIds: number[];
    sourceCount: number;
  };
};
