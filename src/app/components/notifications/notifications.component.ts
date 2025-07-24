import { Component, Input } from '@angular/core';
import { NotificationModel } from '../../models/notification.model';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { NotificationComponent } from '../notification/notification.component';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [
    MatListModule,
    MatCardModule,
    CommonModule,
    NotificationComponent,
  ],
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.css'
})
export class NotificationsComponent {

  @Input() notifications: NotificationModel[] = [];
  

}
