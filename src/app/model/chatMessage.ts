export interface ChatMessage {
    id: number;
    conversationId: number;
    senderId: number;
    content: string;
    createdAt?: string;
}
