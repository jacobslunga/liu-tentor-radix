export interface Message {
  id?: string;
  role: "user" | "assistant";
  content: string;
  created_at?: string;
  model?: string;
}
