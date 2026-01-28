import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl = 'http://10.8.0.8:8184/auth/';
  router = inject(Router);

  constructor(private http: HttpClient) { }

  signup(credentials: any): Observable<any> {
    return this.http.post(`${this.baseUrl}signup`, credentials);
  }

  login(credentials: any): Observable<any> {
    return this.http.post(`${this.baseUrl}login`, credentials , {
      observe: 'response',
    });
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('profile');
    this.router.navigate(['/']);
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }
}
