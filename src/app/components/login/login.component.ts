import { Component, inject } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { EncrytionService } from '../../services/encrytion.service';
import { HttpResponse } from '@angular/common/http';
import { PasswordModule } from 'primeng/password';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { CardModule } from 'primeng/card';
import { MessageModule } from 'primeng/message';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule , PasswordModule , InputTextModule , ButtonModule , FloatLabelModule , CardModule , MessageModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  isLogin = true;
  authForm: FormGroup;
  loginForm!: FormGroup;
  router = inject(Router);
  constructor(private fb: FormBuilder, private auth : AuthService) {
    this.authForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

    ngOnInit(): void {
    this.loginForm = this.fb.group({
      loginId: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  toggleMode() {
    this.isLogin = !this.isLogin;
  }

  onSubmit() {
    if (this.authForm.invalid) return;

    if (this.isLogin) {
      this.auth.login(this.authForm.value).subscribe((response : HttpResponse<any> )=> {
        if (response.body.status === 1) {
          localStorage.setItem("profile",JSON.stringify(response.body));
          const token = response.headers.get("token");
          if (token) {
            localStorage.setItem("token",EncrytionService.decrypt(token));
          }
          else{
            console.log("no token")
          }
          this.router.navigate(['/chat']);
        }
        else {
          alert("something went wrong!");
        }
      })
    }
    else {
          this.auth.signup(this.authForm).subscribe((res: any) => {
      if(res.success === true){
        localStorage.setItem('loginUser', res.userID);
        localStorage.setItem('token',res.token);
        this.router.navigate(['/home']);
      }
      else{
        alert(res.message);
      }
    })
    }
  }
}
