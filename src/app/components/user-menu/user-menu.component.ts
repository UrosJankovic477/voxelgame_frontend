import { Component, Input, ViewChild } from '@angular/core';
import { MatExpansionModule, MatExpansionPanel } from "@angular/material/expansion";
import { UserModel } from '../../models/user.model';
import { environment } from '../../../../environment';
import { RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/app.state';
import { logout } from '../../store/auth/auth.actions';
import { withLatestFrom } from 'rxjs';
import { UserService } from '../../services/user.service';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-user-menu',
  standalone: true,
  imports: [
    MatExpansionModule,
    MatButtonModule,
    RouterModule
  ],
  templateUrl: './user-menu.component.html',
  styleUrl: './user-menu.component.css'
})
export class UserMenuComponent {

  constructor(
    private store: Store<AppState>,
    private service: UserService
  ) {

  }

  @Input() user!: UserModel;
  @Input() token!: string;
  @ViewChild('userExpansion') userExpansion!: MatExpansionPanel;


  public get api() {
    return environment.api;
  }
  
  public get defaultPictureLocation() {
    return environment.defaultProfilePicture;
  }

  signOutClick() {
    this.userExpansion.close();
    this.store.dispatch(logout());
  }

  deleteClick() {
    this.userExpansion.close();
    this.service.deleteUser(this.user.username!, this.token)
    this.store.dispatch(logout());
  }

}
