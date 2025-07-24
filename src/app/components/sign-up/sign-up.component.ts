import { Component } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Observable } from 'rxjs';
import { UserService } from '../../services/user.service';
import { AppState } from '../../store/app.state';
import { Store } from '@ngrx/store';
import { loginRequest } from '../../store/auth/auth.actions';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDividerModule,
  ],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.css'
})
export class SignUpComponent {
  file: File | null = null;

  constructor(
    private userService: UserService, 
    private formBuilder: FormBuilder,
    private store: Store<AppState>
  ) {

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

  onFileSelected(event: Event) {
    this.file = (event.target as HTMLInputElement).files![0];
    console.log(this.file);
    
  }

  onSubmit(): void {
    if (this.signUpForm.valid) {
      this.signUpResult$ = this.userService.createUser({
        username: this.signUpForm.value.username!,
        password: this.signUpForm.value.password!,
        confirmPassword: this.signUpForm.value.confirmPassword!,
        displayname: this.signUpForm.value.displayname!,
      }, this.file);
      this.signUpResult$.subscribe(() => {
        this.store.dispatch(loginRequest({
          username: this.signUpForm.value.username!,
          password: this.signUpForm.value.password!,
        }))
      })
      
    }
  }
}
