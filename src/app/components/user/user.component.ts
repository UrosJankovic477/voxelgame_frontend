import { Component, Input, OnInit, Output } from '@angular/core';
import { EMPTY, filter, map, Observable, switchMap, withLatestFrom } from 'rxjs';
import { UserService } from '../../services/user.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserModel } from '../../models/user.model';
import { NavigationComponent } from "../navigation/navigation.component";
import { environment } from '../../../../environment';
import { EnvironmentService } from '../../services/environment.service';
import { MatCardModule } from '@angular/material/card';
import { SubscribeButtonComponent } from "../subscribe-button/subscribe-button.component";
import { AppState } from '../../store/app.state';
import { Store } from '@ngrx/store';
import { selectLoginToken, selectLoginUser } from '../../store/auth/auth.selectors';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatList, MatListItem, MatActionList } from "@angular/material/list";
import { MatButtonModule } from '@angular/material/button';
import { PostPreviewComponent } from "../post-preview/post-preview.component";
import { VoxelBuildModel } from '../../models/voxel-build.model';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatExpansionModule,
    SubscribeButtonComponent,
    MatList,
    MatButtonModule,
    RouterModule,
    PostPreviewComponent
],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent implements OnInit {

  constructor(
    private userService: UserService, 
    private readonly route: ActivatedRoute,
    private store: Store<AppState>,
    public environmentService: EnvironmentService
  ) {

  }

  user$?: Observable<UserModel>;

  user?: UserModel;

  ownsAcount: boolean = false;

  subscriptions$: Observable<UserModel[]> = EMPTY;

  builds$: Observable<VoxelBuildModel[]> = EMPTY;

  
  public get userAboutClassList() : Array<string> {
    return (this.user && this.user.about) ? ['container', 'text'] : ['container', 'default-text'];
  }


  public get userDisplayname() {
    return (this.user && this.user.displayname) ? this.user.displayname : '';
  }

  public get userPictureLocation() {

    return this.user$!.pipe(
      map(user => {
        if (!user || !user.profilePictureLocation) {
          return environment.defaultProfilePicture;
        }
        else return `${environment.api}/${user.profilePictureLocation}`;
      })
    );
  }
  
  public get userAbout() : string {
    return (this.user && this.user.about) ? this.user.about : "No Description";
  }

  ngOnInit(): void {

    const username = this.route.snapshot.paramMap.get('username');
    if (username === null) {
      throw new Error('No username given');
    }

    this.user$ = this.userService.getUser(username);

    this.user$.pipe(
      filter(loggedInUser => !!loggedInUser),
      withLatestFrom(this.store.select(selectLoginUser)),
      map(([user, loggedInUser]) => user.username == loggedInUser!.username)
    ).subscribe(value => {
      this.ownsAcount = value;
    });
    
    this.subscriptions$ = this.store.select(selectLoginToken).pipe(
      filter(token => !!token),
      switchMap(token => this.userService.getUserSubscriptions(token!))
    );
    
    this.builds$ = this.userService.getUserBuilds(username, 10, 1);
  }

}
