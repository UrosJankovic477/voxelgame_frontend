import { Component, Input, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder
  ) {

  }

  loginResult$?: Observable<Object>

  loginForm = this.formBuilder.group({
    username: new FormControl('', [
      Validators.required
    ]),
    password: new FormControl('', [
      Validators.required
    ]),
  });

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.loginResult$ = this.authService.login(this.loginForm.value.username!, this.loginForm.value.password!);
      this.loginResult$.subscribe((loginResult) => {
        
        
      })
      
    }
  }
 
}
