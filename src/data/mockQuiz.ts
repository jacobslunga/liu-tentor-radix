export type QuizQuestion = {
  id: number;
  question: string;
  options: string[];
  answer: number;
};

export type QuizPayload = {
  quiz: {
    questions: QuizQuestion[];
  };
  meta: {
    courseCode: string;
    sourceExamIds: number[];
    sourceCount: number;
  };
};

export const mockQuizPayload: QuizPayload = {
  quiz: {
    questions: [
      {
        id: 101,
        question:
          'Bestäm konstanten $a$ så att vektorerna $\\mathbf{u} = (a, -2, 1)$ och $\\mathbf{v} = (2, 4, -2)$ är parallella.',
        options: ['$a = 1$', '$a = -1$', '$a = 2$', '$a = -2$'],
        answer: 1,
      },
      {
        id: 102,
        question:
          'Vilka är egenvärderna till matrisen $A = \\begin{pmatrix} 3 & 1 \\\\ 2 & 2 \\end{pmatrix}$?',
        options: [
          '$\\lambda_1=1, \\lambda_2=4$',
          '$\\lambda_1=-1, \\lambda_2=-4$',
          '$\\lambda_1=2, \\lambda_2=3$',
          '$\\lambda_1=1, \\lambda_2=5$',
        ],
        answer: 0,
      },
      {
        id: 103,
        question:
          'Vad är den ortogonala projektionen av vektorn $\\mathbf{u} = (2, -1, 3)$ på den linje som spänns upp av vektorn $\\mathbf{v} = (1, 2, 2)$?',
        options: [
          '$(1, 2, 2)$',
          '$(\\frac{2}{3}, \\frac{4}{3}, \\frac{4}{3})$',
          '$(2, 4, 4)$',
          '$(\\frac{1}{3}, \\frac{2}{3}, \\frac{2}{3})$',
        ],
        answer: 1,
      },
      {
        id: 104,
        question:
          'Låt $A$ vara en $3 \\times 3$ matris med $\\det(A) = 5$. Vad är determinanten av matrisen $2A$?',
        options: ['5', '10', '25', '40'],
        answer: 3,
      },
    ],
  },
  meta: {
    courseCode: 'TATA24',
    sourceExamIds: [15533, 11253, 18725, 8372, 10552],
    sourceCount: 5,
  },
};
