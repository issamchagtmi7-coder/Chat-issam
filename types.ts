export enum Sender {
  USER = 'user',
  AI = 'ai',
}

export interface ChatMessage {
  id: string;
  sender: Sender;
  text: string;
  isStreaming?: boolean;
  isAwaitingResponse?: boolean;
}

export enum View {
  CHAT = 'chat',
  PHOTO_EDITOR = 'photo_editor',
}
