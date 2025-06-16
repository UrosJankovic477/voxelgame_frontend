import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UploadService {

  constructor(private client: HttpClient) { }

  public upload(file: File): Observable<string> {
    const formData = new FormData();
    formData.append('file', file)
    return this.client.post<string>(`${environment.api}upload`, formData);
  }

}
