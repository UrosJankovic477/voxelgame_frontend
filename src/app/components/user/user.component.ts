import { Component, Input, OnInit, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { UserService } from '../../services/user.service';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { User } from '../../models/user.model';
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

  user$?: Observable<User>;

  user?: User;

  ownsAcount: boolean = false;

  
  public get userAboutClassList() : Array<string> {
    return (this.user && this.user.about) ? ['container', 'text'] : ['container', 'default-text'];
  }
  

  public get userDisplayname() {
    return (this.user && this.user.displayname) ? this.user.displayname : '';
  }

  public get userPictureLocation() : string {
    return (this.user && this.user.pictureLocation) ? this.user.pictureLocation : environment.defaultProfilePicture;
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
    this.user$.subscribe(user => this.user = user);
  }

}
