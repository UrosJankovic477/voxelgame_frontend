import { Component, Input } from '@angular/core';
import { NotificationModel } from '../../models/notification.model';
import { environment } from '../../../../environment';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [MatDividerModule],
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.css'
})
export class NotificationComponent {
  @Input() notification!: NotificationModel;
  
  
  
  
  

}
