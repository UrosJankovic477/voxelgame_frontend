import { Component, Input } from '@angular/core';
import { User } from '../../models/user.model';
import { Observable } from 'rxjs';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent {

  constructor(private service: UserService) {

  }

  @Input()
  user$?: Observable<User>;
  set username(username: string) {
    this.user$ = this.service.getUser(username);
  }

}
