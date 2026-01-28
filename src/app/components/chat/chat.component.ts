import { Component, OnDestroy, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { ChatService } from '../../services/chat.service';
import { ChatMessage } from '../../model/chatMessage';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, OnDestroy {

  @ViewChild('scrollBox') private scrollBox!: ElementRef;

  messages: ChatMessage[] = [];
  content = '';
  id : number = 1;
  profile = JSON.parse(localStorage.getItem('profile') || '{}');
  senderId: number = this.profile?.id;

  conversationId!: number;
  sub!: Subscription;

  constructor(
    private chatService: ChatService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // Example: get conversationId dynamically (route / selection)
    this.conversationId = 1;

    this.chatService.connect(this.conversationId);

    this.sub = this.chatService.onMessage().subscribe(msg => {
      this.messages.push(msg);
      setTimeout(() => this.scrollToBottom());
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
    this.chatService.disconnect();
  }

  send(): void {
    if (!this.content.trim()) return;

    const msg: ChatMessage = {
      id : this.id,
      conversationId: this.conversationId,
      senderId: this.senderId,
      content: this.content
    };

    this.chatService.sendMessage(msg);
    this.content = '';
  }

  logout(): void {
    this.authService.logout();
  }

  private scrollToBottom(): void {
    if (this.scrollBox) {
      this.scrollBox.nativeElement.scrollTop =
        this.scrollBox.nativeElement.scrollHeight;
    }
  }

  trackById(index: number, msg: ChatMessage): any {
    return msg.id ?? index;
  }
}
