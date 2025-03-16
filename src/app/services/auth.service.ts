import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private client: HttpClient) { }

  public login(username: string, password: string) {
    return this.client.post(`${environment.api}auth/login`, {
      username: username,
      password: password
    });
  }
}
