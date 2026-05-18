import { Component, inject, OnInit } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { EncrytionService } from '../../services/encrytion.service';
import { HttpResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';

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

  router = inject(Router);

  constructor(
    private fb: FormBuilder,
    private auth: AuthService
  ) {}

  ngOnInit(): void {

    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;
  }

  onSubmit() {

    if (this.loginForm.invalid) {
      console.log(this.loginForm.errors);
      return;
    }

    this.auth.login(this.loginForm.value)
      .subscribe((response: HttpResponse<any>) => {

        console.log(response);

        if (response.body.responseStatus == "001") {

          localStorage.setItem(
            "profile",
            JSON.stringify(response.body)
          );

          const token = response.headers.get("token");

          if (token) {
            localStorage.setItem(
              "token",
              EncrytionService.decrypt(token)
            );
          }

          this.router.navigate(['/chat']);

        } else {
          alert(response.body.responseMessage);
        }
      });
  }
}
