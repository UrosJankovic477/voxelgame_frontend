import { Component, Input } from '@angular/core';
import { NotificationModel } from '../../models/notification.model';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [],
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.css'
})
export class NotificationComponent {
  @Input() notification!: NotificationModel;
  
  
  public get message() : string {
    let messageAction;
    if (this.notification.voxelBuildUuid != null) {
      messageAction = "posted";
    }
    else if (this.notification.commentParentUuid) {
      messageAction = "replied to your comment"
    }
    else {
      messageAction = "commented on your post"
    }
    return `${this.notification.posterDisplayname} ${messageAction}`;
  }
  

}
