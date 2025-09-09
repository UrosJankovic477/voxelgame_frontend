import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";

import { catchError, exhaustMap, filter, iif, map, of, switchMap, tap, throwError, throwIfEmpty, withLatestFrom } from "rxjs";
import { loginFailure, loginRequest, loginSuccess, loggedInUserUpdateRequest, loggedInUserUpdateFailure, loggedInUserUpdateSucces } from "./auth.actions";
import { HttpErrorResponse, HttpResponse } from "@angular/common/http";
import { AuthService } from "../../services/auth.service";
import { UserService } from "../../services/user.service";
import { Store } from "@ngrx/store";
import { AppState } from "../app.state";
import { Router } from "@angular/router";

@Injectable()
export class AuthEffects {
    constructor(
        private actions$: Actions,
        private authService: AuthService,
        private userService: UserService,
        private store: Store<AppState>,
        private router: Router
    ) { 

    }

    public loginRequest$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(loginRequest),
            switchMap(action => this.authService.login(action.username, action.password).pipe(
                
                map(loginResult => {
                    this.router.navigate(['/']);
                    return loginSuccess(loginResult)
                }),
                catchError((error: HttpErrorResponse) => of(loginFailure(
                    { 
                        errorMessage: 'Wrong password or username'
                    })))
            )),
            
        );
    });

    public loggedInUserUpdate$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(loggedInUserUpdateRequest),
            withLatestFrom(this.store.select(state => state.authState.user)),
            switchMap(([action, userOrNull]) => iif(() => userOrNull == null, throwError(() => "Couldn't get user"), of(userOrNull))),
            exhaustMap(user => this.userService.getUser(user!.username!).pipe(
                map(updatedUser => loggedInUserUpdateSucces(updatedUser))
            )),
            catchError((error: Error) => of(loggedInUserUpdateFailure({
                errorMessage: error.message
            }))),
            
        )
    });
}