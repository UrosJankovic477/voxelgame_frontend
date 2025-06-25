import { HttpClient, HttpParams, HttpResponse,  } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserDto } from '../dto/user.dto';
import { map, Observable, of, withLatestFrom } from 'rxjs';
import { environment } from '../../../environment';
import { User } from '../models/user.model';
import { AppState } from '../store/app.state';
import { Store } from '@ngrx/store';
import { selectLoginUser } from '../store/auth/auth.selectors';
import { loggedInUserUpdateRequest } from '../store/auth/auth.actions';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private client: HttpClient,
    private store: Store<AppState>
  ) { }

  public getUser(username: string): Observable<User> {
    return this.client.get<User>(`${environment.api}user/${username}`);
  }

  public getUsersLike(term: string) {
    return this.client.get(`${environment.api}user/?name=${term}`);
  }

  public editUser(user: UserDto, token: string) {
    console.log('amogus');
    
    return this.client.put(`${environment.api}user`, user, {
      observe: 'response',
      headers:
      {
        'Authorization': `Bearer ${token}`
      }
    }).pipe(
      map(response => {
        if (response.ok) {
          this.store.dispatch(loggedInUserUpdateRequest());
        }

        return response
      })

    );
  }

  public createUser(user: UserDto) {
    return this.client.post(`${environment.api}/signup`, user);
  }
}
