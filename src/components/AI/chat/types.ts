export interface Message {
  role: "user" | "assistant";
  content: string;
}

export interface ChatWindowProps {
  examDetail: {
    exam: { id: string };
    solutions: unknown[];
  };
  isOpen: boolean;
  onClose: () => void;
}
