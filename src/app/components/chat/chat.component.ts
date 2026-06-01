import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { ChatMessage } from '../../model/chatMessage';
import { AuthService } from '../../services/auth.service';
import { ChatService } from '../../services/chat.service';

interface Conversation {
  id: number;
  name: string;
  initials: string;
  lastMessage: string;
  time: string;
  unread: number;
  online: boolean;
  pinned?: boolean;
  group?: boolean;
}

type MessageStatus = 'sent' | 'offline';

interface UiMessage extends ChatMessage {
  createdAt: string;
  status?: MessageStatus;
}

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, OnDestroy {
  @ViewChild('scrollBox') private scrollBox?: ElementRef<HTMLDivElement>;

  profile = JSON.parse(localStorage.getItem('profile') || '{}');
  senderId = Number(this.profile?.id || 101);
  content = '';
  searchTerm = '';
  activeFilter: 'all' | 'unread' | 'groups' = 'all';
  conversationId = 1;
  isSidebarOpen = false;
  private nextMessageId = 1000;
  private sub?: Subscription;

  conversations: Conversation[] = [
    { id: 1, name: 'Design Team', initials: 'DT', lastMessage: 'Final UI pass is ready.', time: '10:42', unread: 2, online: true, pinned: true, group: true },
    { id: 2, name: 'Akshit Choudhary', initials: 'AC', lastMessage: 'Can we test the profile page?', time: '09:18', unread: 0, online: true },
    { id: 3, name: 'Product Updates', initials: 'PU', lastMessage: 'WebSocket endpoint is connected.', time: 'Yesterday', unread: 4, online: false, group: true },
    { id: 4, name: 'Friends', initials: 'FR', lastMessage: 'Movie plan after work?', time: 'Tue', unread: 0, online: false, group: true },
    { id: 5, name: 'Support', initials: 'SP', lastMessage: 'Ticket #482 has been resolved.', time: 'Mon', unread: 0, online: true }
  ];

  messagesByConversation: Record<number, UiMessage[]> = {
    1: [
      { id: 11, conversationId: 1, senderId: 201, content: 'Can everyone check the new desktop layout?', createdAt: '10:35' },
      { id: 12, conversationId: 1, senderId: this.senderId, content: 'Yes. Sidebar, header, and composer are aligned now.', createdAt: '10:37', status: 'sent' },
      { id: 13, conversationId: 1, senderId: 202, content: 'Mobile should keep the recent chats visible above the active thread.', createdAt: '10:40' }
    ],
    2: [
      { id: 21, conversationId: 2, senderId: 202, content: 'Profile page looks much closer to a real messaging app now.', createdAt: '09:18' }
    ],
    3: [
      { id: 31, conversationId: 3, senderId: 203, content: 'Backend connection can be live, but the UI still works offline for review.', createdAt: 'Yesterday' }
    ],
    4: [],
    5: []
  };

  constructor(
    private chatService: ChatService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.chatService.connect(this.conversationId);
    this.sub = this.chatService.onMessage().subscribe(msg => this.receiveMessage(msg));
    queueMicrotask(() => this.scrollToBottom());
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
    this.chatService.disconnect();
  }

  get displayName(): string {
    return this.profile?.username || this.profile?.email || 'Akshit';
  }

  get displayInitials(): string {
    return this.displayName.slice(0, 2).toUpperCase();
  }

  get activeConversation(): Conversation {
    return this.conversations.find(c => c.id === this.conversationId) ?? this.conversations[0];
  }

  get messages(): UiMessage[] {
    return this.messagesByConversation[this.conversationId] ?? [];
  }

  get filteredConversations(): Conversation[] {
    const query = this.searchTerm.trim().toLowerCase();

    return this.conversations.filter(conversation => {
      const matchesSearch =
        !query ||
        conversation.name.toLowerCase().includes(query) ||
        conversation.lastMessage.toLowerCase().includes(query);
      const matchesFilter =
        this.activeFilter === 'all' ||
        (this.activeFilter === 'unread' && conversation.unread > 0) ||
        (this.activeFilter === 'groups' && conversation.group);

      return matchesSearch && matchesFilter;
    });
  }

  selectConversation(conversation: Conversation): void {
    this.conversationId = conversation.id;
    conversation.unread = 0;
    this.chatService.reconnect(this.conversationId);
    this.isSidebarOpen = false;
    queueMicrotask(() => this.scrollToBottom());
  }

  setFilter(filter: 'all' | 'unread' | 'groups'): void {
    this.activeFilter = filter;
  }

  send(): void {
    const text = this.content.trim();
    if (!text) {
      return;
    }

    const message: UiMessage = {
      id: this.nextMessageId++,
      conversationId: this.conversationId,
      senderId: this.senderId,
      content: text,
      createdAt: this.timeNow()
    };

    message.status = this.chatService.sendMessage(message) ? 'sent' : 'offline';
    this.pushMessage(message);
    this.content = '';
  }

  logout(): void {
    this.authService.logout();
  }

  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  trackByConversationId(index: number, conversation: Conversation): number {
    return conversation.id;
  }

  trackByMessageId(index: number, message: UiMessage): number {
    return message.id;
  }

  private receiveMessage(message: ChatMessage): void {
    if (this.messagesByConversation[message.conversationId]?.some(item => item.id === message.id)) {
      return;
    }

    this.pushMessage({
      ...message,
      createdAt: message.createdAt || this.timeNow()
    });
  }

  private pushMessage(message: UiMessage): void {
    const conversationMessages = this.messagesByConversation[message.conversationId] ?? [];
    this.messagesByConversation = {
      ...this.messagesByConversation,
      [message.conversationId]: [...conversationMessages, message]
    };

    const conversation = this.conversations.find(item => item.id === message.conversationId);
    if (conversation) {
      conversation.lastMessage = message.content;
      conversation.time = message.createdAt;
    }

    setTimeout(() => this.scrollToBottom());
  }

  private scrollToBottom(): void {
    const box = this.scrollBox?.nativeElement;
    if (box) {
      box.scrollTop = box.scrollHeight;
    }
  }

  private timeNow(): string {
    return new Intl.DateTimeFormat('en-IN', {
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date());
  }
}
