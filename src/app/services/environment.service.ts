import { Injectable } from '@angular/core';
import { NotificationsComponent } from '../components/notifications/notifications.component';
import { environment } from '../../../environment';

@Injectable({
  providedIn: 'root'
})
export class EnvironmentService {

  
  constructor() { }
  
  public logo() {
    return environment.logo;
  }

  public get api() {
    return environment.api;
  }
  
  public get defaultPictureLocation() {
    return environment.defaultProfilePicture;
  }
}
