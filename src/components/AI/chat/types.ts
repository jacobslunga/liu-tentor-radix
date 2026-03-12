export interface Message {
  role: 'user' | 'assistant';
  content: string;
  context?: string;
}
