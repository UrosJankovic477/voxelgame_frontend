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
import { EnvironmentService } from '../../services/environment.service';
import { MatMenuModule } from '@angular/material/menu'

@Component({
  selector: 'app-user-menu',
  standalone: true,
  imports: [
    MatMenuModule,
    MatButtonModule,
    RouterModule
  ],
  templateUrl: './user-menu.component.html',
  styleUrl: './user-menu.component.css'
})
export class UserMenuComponent {

  constructor(
    private store: Store<AppState>,
    private service: UserService,
    public environmentService: EnvironmentService
  ) {
  }

  @Input() user!: UserModel;
  @Input() token!: string;


  signOutClick() {
    this.store.dispatch(logout());
  }

  deleteClick() {
    this.service.deleteUser(this.user.username!, this.token)
    this.store.dispatch(logout());
  }

}
