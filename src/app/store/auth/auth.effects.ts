import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";

import { catchError, exhaustMap, map, of, tap, throwError, throwIfEmpty } from "rxjs";
import { loginFailure, loginRequest, loginSuccess } from "./auth.actions";
import { HttpErrorResponse, HttpResponse } from "@angular/common/http";
import { AuthService } from "../../services/auth.service";

@Injectable()
export class AuthEffects {
    constructor(
        private actions$: Actions,
        private authService: AuthService
    ) { 

    }

    public loginRequest$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(loginRequest),
            exhaustMap((action) => this.authService.login(action.username, action.password).pipe(
                
                map((loginResult) => loginSuccess(loginResult)),
                catchError((error: HttpErrorResponse) => of(loginFailure(
                    { 
                        errorMessage: error.message
                    })))
            )),
            
        );
    });
}