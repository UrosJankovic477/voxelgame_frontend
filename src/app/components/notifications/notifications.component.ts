import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { NotificationModel } from '../../models/notification.model';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { NotificationComponent } from '../notification/notification.component';
import { MatDividerModule } from '@angular/material/divider';
import { environment } from '../../../../environment';
import { NotificationsService } from '../../services/notifications.service';
import { EnvironmentService } from '../../services/environment.service';
import { RouterModule } from '@angular/router';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { MatIconModule } from "@angular/material/icon";

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [
    MatListModule,
    MatCardModule,
    MatDividerModule,
    MatButtonModule,
    CommonModule,
    RouterModule,
    MatIconModule
],
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.css'
})
export class NotificationsComponent implements OnChanges {

  constructor(
    public environmentService: EnvironmentService,
    private notificationService: NotificationsService
  ) {

  }
  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);
    
    this.notifications = changes['notifications'].currentValue;
  }

  @Input() notifications: NotificationModel[] = [];
  @Output() onDeleteNotification = new EventEmitter<number>();

  message(notification: NotificationModel) : string {
    let messageAction;
    let messageContent;
    if (notification.voxelBuildUuid != null) {
      messageAction = "posted";
      messageContent = notification.voxelBuildTitle
    }
    else {
      messageContent = notification.commentContent;
      if (notification.commentParentUuid) {
        messageAction = "replied to your comment"
      }
      else {
        messageAction = "commented on your post"
      }
    }
    return `${notification.posterDisplayname} ${messageAction}: ${messageContent}`;
  }

  notificationLink(notification: NotificationModel) {
    if (notification.voxelBuildUuid != null) {
      return `posts/${notification.voxelBuildUuid}`;
    }
    else {
      return `posts/${notification.commentPostUuid}`;
    }
  }

  notificationDelete(id: number) {
    this.onDeleteNotification.emit(id);
  }
  
}
