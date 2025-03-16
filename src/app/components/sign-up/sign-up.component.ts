import { Component } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.css'
})
export class SignUpComponent {

  constructor(private authService: AuthService, private formBuilder: FormBuilder) {

  }

  signUpResult$?: Observable<Object>;

  signUpForm = this.formBuilder.group({
    username: new FormControl('', [
      Validators.required
    ]),
    displayname: new FormControl('', [
      Validators.required
    ]),
    password: new FormControl('', [
      Validators.required
    ]),
    confirmPassword: new FormControl('', [
      Validators.required
    ]),
    about: ''
  });

  onSubmit(): void {
    if (this.signUpForm.valid) {
      this.signUpResult$ = this.authService.login(this.signUpForm.value.username!, this.signUpForm.value.password!);
      this.signUpResult$.subscribe((signUpResult) => {
        
        
      })
      
    }
  }
}
