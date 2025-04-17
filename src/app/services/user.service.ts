import { HttpClient, HttpParams,  } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserDto } from '../dto/user.dto';
import { Observable } from 'rxjs';
import { environment } from '../../../environment';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private client: HttpClient) { }

  public getUser(username: string): Observable<User> {
    return this.client.get<User>(`${environment.api}user/${username}`);
  }

  public getUsersLike(term: string) {
    this.client.get(`${environment.api}user/?name=${term}`);
  }

  public editUser(user: UserDto) {
    
  }
}
