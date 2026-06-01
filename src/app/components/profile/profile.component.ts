import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-profile',
  imports: [RouterLink],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  profile = JSON.parse(localStorage.getItem('profile') || '{}');

  get displayName(): string {
    return this.profile?.name || this.profile?.username || this.profile?.email || 'Akshit Choudhary';
  }

  get email(): string {
    return this.profile?.username || this.profile?.email || 'demo@chat.local';
  }

  get initials(): string {
    return this.displayName.slice(0, 2).toUpperCase();
  }
}
