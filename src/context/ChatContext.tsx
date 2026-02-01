import { ReactNode, FC } from "react";
import { useChatMessages } from "@/components/AI/chat/hooks/useChatMessages";
import { ChatStateContext } from "./chatStateContext";
import type { ExamDetailPayload } from "@/api";

interface ChatProviderProps {
  children: ReactNode;
  examDetail: ExamDetailPayload;
}

export const ChatProvider: FC<ChatProviderProps> = ({
  children,
  examDetail,
}) => {
  const chatLogic = useChatMessages({
    examId: examDetail.exam.id,
    courseCode: examDetail.exam.course_code,
    examUrl: examDetail.exam.pdf_url,
    solutionUrl: examDetail.solution?.pdf_url ?? null,
  });

  return (
    <ChatStateContext.Provider value={chatLogic}>
      {children}
    </ChatStateContext.Provider>
  );
};
