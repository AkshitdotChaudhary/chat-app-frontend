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
  private baseUrl = environment.apiUrl;
  private stompClient: Client | null = null;
  private messagesSubject = new Subject<ChatMessage>();

  connect(conversationId: Number): void {
    const socket = new SockJS(`${this.baseUrl}/ws`);
    this.stompClient = Stomp.over(() => socket);

    if (this.stompClient) {
      this.stompClient.onConnect = () => {
        this.stompClient?.subscribe('/topic/conversation/' + conversationId, (msg: IMessage | null) => {
          if (msg && msg.body) {
            const payload = JSON.parse(msg.body) as ChatMessage;
            this.messagesSubject.next(payload);
          }
        });
      };
      this.stompClient.activate();
    }
  }

  disconnect(): void {
    this.stompClient?.deactivate();
    this.stompClient = null;
  }

  sendMessage(message: ChatMessage): void {
    if (this.stompClient && this.stompClient.connected) {
      this.stompClient.publish({
        destination: `/app/chat.send/${message.conversationId}`,
        body: JSON.stringify(message)
      });
    } else {
      console.warn('STOMP client not connected');
    }
  }

  onMessage(): Observable<ChatMessage> {
    return this.messagesSubject.asObservable();
  }

  loadPreviousMessages(){
    
  }
}
