import { Component, ComponentRef, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { Store, StoreModule } from '@ngrx/store';
import { AppState } from '../../store/app.state';
import { UserModel } from '../../models/user.model';
import { EMPTY, filter, Observable, switchMap, withLatestFrom } from 'rxjs';
import { selectLoginToken, selectLoginUser } from '../../store/auth/auth.selectors';
import { CommonModule } from '@angular/common';
import { environment } from '../../../../environment';
import { RouterModule } from '@angular/router';
import { SearchbarComponent } from "../searchbar/searchbar.component";
import { MatExpansionModule, MatExpansionPanel } from "@angular/material/expansion"
import { MatButtonModule } from "@angular/material/button"
import { MatBadgeModule } from "@angular/material/badge"
import { MatIconModule, MatIcon } from "@angular/material/icon"
import { logout } from '../../store/auth/auth.actions';
import { UserService } from '../../services/user.service';
import { UserMenuComponent } from "../user-menu/user-menu.component";
import { NotificationsComponent } from '../notifications/notifications.component';
import { NotificationsService } from '../../services/notifications.service';
import { NotificationModel } from '../../models/notification.model';
import { CommentWriteComponent } from '../comment-write/comment-write.component';

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    SearchbarComponent,
    MatExpansionModule,
    MatButtonModule,
    MatIconModule,
    UserMenuComponent,
    MatBadgeModule
],
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.css'
})
export class NavigationComponent implements OnInit {


  constructor(
    private store: Store<AppState>,
    private notificationService: NotificationsService
  ) {

  }

  @ViewChild('notifications', {
    read: ViewContainerRef
  }) viewContainerRef!: ViewContainerRef;
  @ViewChild('signInExpansion') signInExpansion!: MatExpansionPanel;
  
  user$: Observable<UserModel | null> = EMPTY;
  token$: Observable<string | null> = EMPTY;
  notifications$: Observable<[NotificationModel[], number]> = EMPTY;
  unreadNotificationCount = 0;
  notifications: NotificationModel[] = [];
  notificaionsShown: boolean = false;
  notificationsComponent?: ComponentRef<NotificationsComponent>;

  ngOnInit(): void {
    this.user$ = this.store.select(selectLoginUser);
    this.token$ = this.store.select(selectLoginToken);
    this.notifications$ = this.token$.pipe(
      filter(token => !!token),
      switchMap(token => this.notificationService.getNotifications(token!))
    );
    this.notifications$.subscribe(([notifications, count]) => {
      this.unreadNotificationCount = count;
      this.notifications = notifications;
    });
  }

  public get api() {
    return environment.api;
  }
  
  public get defaultPictureLocation() {
    return environment.defaultProfilePicture;
  }

  showNotifications() {
    this.notificationsComponent = this.viewContainerRef.createComponent(NotificationsComponent, {

    });
    this.notificationsComponent.setInput('notifications', this.notifications);
    
  }

  removeNotifications() {
    this.notificationsComponent?.destroy();
  }

  toggleNotificationsDisplay() {
    if (this.notificaionsShown) {
      this.removeNotifications();
      this.notificaionsShown = false;
    }
    else {
      this.showNotifications();
      this.notificaionsShown = true;
    }
  }
  
}
