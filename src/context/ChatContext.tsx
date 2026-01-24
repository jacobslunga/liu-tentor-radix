import { createContext, useContext, ReactNode, FC } from "react";
import {
  useChatMessages,
  UseChatMessagesReturn,
} from "@/components/AI/chat/hooks/useChatMessages";
import { ExamWithSolutions } from "@/types/exam";

const ChatStateContext = createContext<UseChatMessagesReturn | null>(null);

interface ChatProviderProps {
  children: ReactNode;
  examDetail: ExamWithSolutions;
}

export const ChatProvider: FC<ChatProviderProps> = ({
  children,
  examDetail,
}) => {
  const chatLogic = useChatMessages({
    examId: examDetail.exam.id,
    courseCode: examDetail.exam.course_code,
    examUrl: examDetail.exam.pdf_url,
    solutionUrl:
      examDetail.solutions.length > 0 ? examDetail.solutions[0].pdf_url : null,
  });

  return (
    <ChatStateContext.Provider value={chatLogic}>
      {children}
    </ChatStateContext.Provider>
  );
};

export const useChatState = () => {
  const context = useContext(ChatStateContext);
  if (!context) {
    throw new Error("useChatState must be used within a ChatProvider");
  }
  return context;
};
