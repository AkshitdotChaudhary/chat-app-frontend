import { CommonModule } from '@angular/common';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { EncrytionService } from '../../services/encrytion.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  passwordVisible = false;
  loading = false;
  errorMessage = '';
  private router = inject(Router);

  constructor(
    private fb: FormBuilder,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;
  }

  onSubmit(): void {
    this.errorMessage = '';

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.auth.login(this.loginForm.value).subscribe({
      next: response => this.handleLoginResponse(response),
      error: error => this.handleLoginError(error)
    });
  }

  continueAsDemo(): void {
    this.saveSession({
      id: 101,
      username: 'demo@chat.local',
      responseStatus: '001'
    }, 'demo-token');
    this.router.navigate(['/chat']);
  }

  private handleLoginResponse(response: HttpResponse<any>): void {
    this.loading = false;

    if (response.body?.responseStatus === '001') {
      const encryptedToken = response.headers.get('token');
      const token = encryptedToken ? EncrytionService.decrypt(encryptedToken) : 'session-token';
      this.saveSession(response.body, token);
      this.router.navigate(['/chat']);
      return;
    }

    this.errorMessage = response.body?.responseMessage || 'Unable to sign in with those credentials.';
  }

  private handleLoginError(error: HttpErrorResponse): void {
    this.loading = false;
    this.errorMessage = error.status === 0
      ? 'Backend is not reachable. Use demo mode to review the UI.'
      : 'Login failed. Check your details and try again.';
  }

  private saveSession(profile: unknown, token: string): void {
    localStorage.setItem('profile', JSON.stringify(profile));
    localStorage.setItem('token', token);
  }
}
