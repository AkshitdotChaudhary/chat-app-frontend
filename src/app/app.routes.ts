import { Routes } from '@angular/router';
import { ChatComponent } from './components/chat/chat.component';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { ProfileComponent } from './components/profile/profile.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: LoginComponent,
    title: 'Sign in | Convo'
  },
  {
    path: 'signup',
    component: SignupComponent,
    title: 'Create account | Convo'
  },
  {
    path: 'chat',
    component: ChatComponent,
    title: 'Chats | Convo'
  },
  {
    path: 'profile',
    component: ProfileComponent,
    title: 'Profile | Convo'
  },
  {
    path: '**',
    redirectTo: 'chat'
  }
];
