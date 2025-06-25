import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UploadService {

  constructor(private client: HttpClient) { }

  public uploadImage(file: File, token: string) {
    const formData = new FormData();
    formData.append('file', file)
    return this.client.post(`${environment.api}upload/image`, formData, {
      headers: {
        'Authorization': `Bearer ${token}`
      },
      responseType: 'text',
    });
  }

  public uploadPost(file: File, token: string) {
    const formData = new FormData();
    formData.append('file', file)
    return this.client.post(`${environment.api}upload/post`, formData, {
      headers: {
        'Authorization': `Bearer ${token}`
      },
      responseType: 'text',
    });
  }

}
