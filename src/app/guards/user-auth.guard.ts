import { inject } from '@angular/core';
import { CanActivateFn, Router} from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from '../store/app.state';
import { selectLoginToken, selectLoginUser } from '../store/auth/auth.selectors';

export const userAuthGuard: CanActivateFn = (route, state) => {
  const store = inject(Store<AppState>);
  const router = inject(Router);
  const token$ = store.select(selectLoginToken);
  let loggedIn = false;

  token$.subscribe(token => loggedIn = (token != null));

  if (!loggedIn) {
    router.navigate(['login']);
  }
  
  return loggedIn;
};