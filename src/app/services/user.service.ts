import { HttpClient, HttpParams, HttpResponse,  } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserDto } from '../dto/user.dto';
import { EMPTY, map, Observable, of, withLatestFrom } from 'rxjs';
import { environment } from '../../../environment';
import { UserModel } from '../models/user.model';
import { AppState } from '../store/app.state';
import { Store } from '@ngrx/store';
import { selectLoginUser } from '../store/auth/auth.selectors';
import { loggedInUserUpdateRequest } from '../store/auth/auth.actions';
import { VoxelBuildModel } from '../models/voxel-build.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private client: HttpClient,
    private store: Store<AppState>
  ) { }

  public getUser(username: string): Observable<UserModel> {
    return this.client.get<UserModel>(`${environment.api}/user/${username}`);
  }

  public getUserSubscriptions(token: string): Observable<UserModel[]> {
    return this.client.get<UserModel[]>(`${environment.api}/subscriptions`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  }

  public getUserBuilds(username: string, count: number, page: number) {
    let url = new URL(`/user/${username}/builds`, environment.api);
    if (count) {
      url.searchParams.set('count', `${count}`);
    }
    if (page) {
      url.searchParams.set('page', `${page}`);
    }
    return this.client.get<VoxelBuildModel[]>(url.toString());
  }

  public getUsersLike(term: string) {
    return this.client.get(`${environment.api}/user/?name=${term}`);
  }

  public editUser(user: UserDto, image: File | null, token: string) {
    const formData = new FormData();
    if (image != null) {
      formData.append('image', image);
    }
    formData.append('user', JSON.stringify(user));

    return this.client.put(`${environment.api}/user`, formData, {
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

  public createUser(user: UserDto, image: File | null) {
    const formData = new FormData();
    if (image != null) {
      formData.append('image', image);
    }
    formData.append('user', JSON.stringify(user));
    return this.client.post(`${environment.api}/user/sign-up`, formData, {
      observe: 'body',
      responseType: 'text'
    });
  }

  public deleteUser(username: string, token: string) {
    return this.client.delete(`${environment.api}/user/${username}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  }

  public subscribeToUser(producerUsername: string, token: string) {
    return this.client.head(`${environment.api}/user/${producerUsername}/subscribe`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  }

  public unsubscribeToUser(producerUsername: string, token: string) {
    return this.client.delete(`${environment.api}/user/${producerUsername}/subscribe`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  }

  public isSubscribed(producerUsername: string, token: string) {
    return this.client.get<[{exists: boolean}]>(`${environment.api}/user/${producerUsername}/subscribe`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  }

}
