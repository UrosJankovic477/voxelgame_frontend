import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserModel } from '../models/user.model';
import { environment } from '../../../environment';
import { CommentModel } from '../models/comment.model';

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  constructor(
    private client: HttpClient
  ) { }

  postComment(content: string, uuid: string, token: string) {
    return this.client.post(`${environment.api}/voxel-build/${uuid}/comment`, {content: content}, {
      headers: {
        'Authorization': `Bearer ${token}`
      },
    })
  }

  editComment(content: string, uuid: string, token: string) {
    return this.client.put(`${environment.api}/comment/${uuid}`, {content: content}, {
      headers: {
        'Authorization': `Bearer ${token}`
      },
    })
  }

  deleteComment(uuid: string, token: string) {
    return this.client.delete(`${environment.api}/comment/${uuid}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      },
    })
  }

  getReplies(uuid: string, count: number, page: number) {
    let url = new URL(`/comment/${uuid}/replies`, environment.api);
    if (count) {
      url.searchParams.set('count', `${count}`);
    }
    if (page) {
      url.searchParams.set('page', `${page}`);
    }

    return this.client.get<CommentModel[]>(url.toString());
  }
  
  reply(content: string, uuid: string, token: string) {
    return this.client.post(`${environment.api}/comment/${uuid}`, { content: content }, {
      headers: {
        'Authorization': `Bearer ${token}`,
        
      },
      responseType: 'text'
    });
  }
}
