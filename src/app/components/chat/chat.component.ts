import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ChatService } from '../../services/chat.service';
import { ChatMessage } from '../../model/chatMessage';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, OnDestroy {
  messages: ChatMessage[] = [];
  text = '';
  from = 'User' + Math.floor(Math.random() * 1000);
  sub: Subscription | null = null;


  constructor(private chatService: ChatService) { }


  ngOnInit(): void {
    this.chatService.connect();
    this.sub = this.chatService.onMessage().subscribe(msg => {
      this.messages.push(msg);
    });
  }


  ngOnDestroy(): void {
    this.sub?.unsubscribe();
    this.chatService.disconnect();
  }


  send(): void {
    if (!this.text.trim()) return;
    const msg: ChatMessage = { from: this.from, text: this.text };
    this.chatService.sendMessage(msg);
    this.text = '';
  }
}
