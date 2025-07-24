import { Component, Input, OnInit, Output } from '@angular/core';
import { filter, map, Observable, switchMap } from 'rxjs';
import { UserService } from '../../services/user.service';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserModel } from '../../models/user.model';
import { NavigationComponent } from "../navigation/navigation.component";
import { environment } from '../../../../environment';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent implements OnInit {

  constructor(private service: UserService, private readonly route: ActivatedRoute) {

  }

  user$?: Observable<UserModel>;

  user?: UserModel;

  ownsAcount: boolean = false;

  
  public get userAboutClassList() : Array<string> {
    return (this.user && this.user.about) ? ['container', 'text'] : ['container', 'default-text'];
  }

  public get api() {
    return environment.api;
  }
  
  public get defaultPictureLocation() {
    return environment.defaultProfilePicture;
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
        else return `${environment.api}${user.profilePictureLocation}`;
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

    this.user$ = this.service.getUser(username);
    
  }

}
