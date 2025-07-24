import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environment';
import { LoginResault as LoginResult } from '../models/login-resault.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private client: HttpClient) { }

  public login(username: string, password: string) {
    return this.client.post<LoginResult>(`${environment.api}/auth/login`, {
      username: username,
      password: password
    });
  }
}
