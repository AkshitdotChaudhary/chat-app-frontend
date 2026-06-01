import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import SockJS from 'sockjs-client';
import { Client, IMessage, Stomp } from '@stomp/stompjs';
import { ChatMessage } from '../model/chatMessage';
import { environment } from '../../environment/environment.development';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private baseUrl = environment.wsUrl;
  private stompClient: Client | null = null;
  private messagesSubject = new Subject<ChatMessage>();

  connect(conversationId: number): void {
    if (this.stompClient?.connected) {
      return;
    }

    const socket = new SockJS(this.baseUrl);
    this.stompClient = Stomp.over(() => socket);
    this.stompClient.debug = () => undefined;

    this.stompClient.onConnect = () => {
      this.stompClient?.subscribe(`/topic/conversation/${conversationId}`, (msg: IMessage | null) => {
        if (msg?.body) {
          this.messagesSubject.next(JSON.parse(msg.body) as ChatMessage);
        }
      });
    };

    this.stompClient.onStompError = frame => {
      console.warn('STOMP error', frame.headers['message']);
    };

    try {
      this.stompClient.activate();
    } catch (error) {
      console.warn('Unable to connect to chat server', error);
    }
  }

  reconnect(conversationId: number): void {
    this.disconnect();
    this.connect(conversationId);
  }

  get connected(): boolean {
    return !!this.stompClient?.connected;
  }

  sendMessage(message: ChatMessage): boolean {
    if (!this.stompClient?.connected) {
      console.warn('STOMP client not connected');
      return false;
    }

    this.stompClient.publish({
      destination: `/app/chat.send/${message.conversationId}`,
      body: JSON.stringify(message)
    });
    return true;
  }

  disconnect(): void {
    if (this.stompClient) {
      this.stompClient.deactivate();
      this.stompClient = null;
    }
  }

  onMessage(): Observable<ChatMessage> {
    return this.messagesSubject.asObservable();
  }

  loadPreviousMessages(): ChatMessage[] {
    return [];
  }
}
