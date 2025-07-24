import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { UserService } from '../../services/user.service';
import { AppState } from '../../store/app.state';
import { Store } from '@ngrx/store';
import { UserModel } from '../../models/user.model';
import { BehaviorSubject, EMPTY, filter, iif, lastValueFrom, map, Observable, of, switchMap, withLatestFrom } from 'rxjs';
import { selectLoginToken } from '../../store/auth/auth.selectors';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-subscribe-button',
  standalone: true,
  imports: [MatButtonModule, CommonModule],
  templateUrl: './subscribe-button.component.html',
  styleUrl: './subscribe-button.component.css'
})
export class SubscribeButtonComponent implements OnInit {
  constructor(
    private userService: UserService,
    private store: Store<AppState>
  ) {

  }


  async ngOnInit(): Promise<void> {
    this.token$ = this.store.select(selectLoginToken).pipe(
      filter(token => !!token)
    );
    this.isSubscribed$ = this.checkSubscriptionSubject.pipe(
      withLatestFrom(this.token$),
      switchMap(([_, token]) => this.userService.isSubscribed(this.producerUsername!, token!)),
      map(([value]) => value.exists)
    );

    this.isSubscribed$.subscribe(value => {
      this.message = value ? 'Unfollow' : 'Follow';
    });

    this.click = this.onClickSubject.pipe(
      withLatestFrom(this.token$),
      switchMap(([_, token]) => this.userService.isSubscribed(this.producerUsername!, token!)),
      withLatestFrom(this.token$),
      switchMap(([[value], token]) => iif(
        () => value.exists, 
        this.userService.unsubscribeToUser(this.producerUsername!, token!),
        this.userService.subscribeToUser(this.producerUsername!, token!)
        )
      )
    );
  }

  onClick() {
    
    if (this.firstClick) {
      this.firstClick = false;
      this.click.subscribe(() => this.checkSubscriptionSubject.next());
      this.onClickSubject.next();
    }
    else {
      this.onClickSubject.next();
      
    }
    
    
  }

  @Input()
  producerUsername: string | null = null;

  isSubscribed$: Observable<boolean> = EMPTY;

  token$: Observable<string | null> = EMPTY;

  message: 'Follow' | 'Unfollow' | 'N/A' = 'N/A';

  private checkSubscriptionSubject = new BehaviorSubject<void>(undefined);
  private onClickSubject = new BehaviorSubject<void>(undefined);
  private click: Observable<any> = EMPTY;
  private firstClick = true;


  

}
