import { Component, Input, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { catchError, EMPTY, Observable } from 'rxjs';
import { Store, StoreModule } from '@ngrx/store';
import { loginFailure, loginRequest, loginSuccess } from '../../store/auth/auth.actions';
import { AuthEffects } from '../../store/auth/auth.effects';
import { CommonModule, NgIf } from '@angular/common';
import { AppState } from '../../store/app.state';
import { UserModel } from '../../models/user.model';
import { authReducer } from '../../store/auth/auth.reducer';
import { selectLoginErrorMessage, selectLoginToken } from '../../store/auth/auth.selectors';
import { Router, RouterModule } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule, 
    CommonModule, 
    StoreModule, 
    RouterModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    MatDividerModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {

  constructor(
    private store: Store<AppState>,
    private formBuilder: FormBuilder,
    private router: Router
  ) {

  }

  ngOnInit(): void {
    this.store.subscribe();
    this.token$ = this.store.select(selectLoginToken);
    this.errorMessage$ = this.store.select(selectLoginErrorMessage);
    this.token$.subscribe((token) => {
      this.token = token;
    });
    this.errorMessage$.subscribe((errorMessage) => {
      this.errorMessage = errorMessage;
    });
  }

  token$: Observable<string | null> = EMPTY;
  errorMessage$: Observable<string | undefined> = EMPTY;

  token: string | null = null;
  errorMessage?: string;
  
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
      this.store.dispatch(loginRequest({
        username: this.loginForm.value.username!, password: this.loginForm.value.password!
      }));
      this.router.navigate(['/']);
    }
    else {
      this.store.dispatch(loginFailure({ errorMessage: 'Type username and password.' }));
    }
  }
 
}
