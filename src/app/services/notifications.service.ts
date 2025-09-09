import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environment';
import { UserModel } from '../models/user.model';
import { NotificationModel } from '../models/notification.model';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {

  constructor(private client: HttpClient) { }

  getNotifications(token: string) {
    return this.client.get<[NotificationModel[], number]>(`${environment.api}/notification`, {
      headers:
      {
        'Authorization': `Bearer ${token}`,
        'Cache-Control': 'no-cache'
      }
    });
  }

  postNotifications(subscribersUsernames: string[], sourceUUID: string) {
    return this.client.post(`${environment.api}/notification`, {
      sourceUUID,
      subscribersUsernames,
    });
  }

  deleteNotification(id: number, token: string) {
    return this.client.delete(`${environment.api}/notification/${id}`, {
      headers:
      {
        'Authorization': `Bearer ${token}`
      }
    });
  }
}
