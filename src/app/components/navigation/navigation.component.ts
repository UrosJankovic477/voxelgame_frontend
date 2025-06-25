import { Component, OnInit } from '@angular/core';
import { Store, StoreModule } from '@ngrx/store';
import { AppState } from '../../store/app.state';
import { User } from '../../models/user.model';
import { EMPTY, Observable } from 'rxjs';
import { selectLoginUser } from '../../store/auth/auth.selectors';
import { CommonModule } from '@angular/common';
import { environment } from '../../../../environment';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.css'
})
export class NavigationComponent implements OnInit {

  constructor(private store: Store<AppState>) {

  }
  
  user$: Observable<User | null> = EMPTY;

  ngOnInit(): void {
    this.user$ = this.store.select(selectLoginUser);
  }

  public get api() {
    return environment.api;
  }
  
  public get defaultPictureLocation() {
    return environment.defaultProfilePicture;
  }
  
}
