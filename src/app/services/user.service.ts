import { HttpClient, HttpParams,  } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private client: HttpClient) { }

  public getUser(username: string): Observable<User> {
    return this.client.get(`user/${username}`);
  }

  public getUsersLike(term: string) {
    this.client.get(`user/?name=${term}`);
  }

  public editUser(user: User) {

  }
}
