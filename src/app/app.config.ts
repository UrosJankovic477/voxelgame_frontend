import { ApplicationConfig, isDevMode } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideState, provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { loginRequest } from './store/auth/auth.actions';
import { authReducer } from './store/auth/auth.reducer';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { AuthEffects } from './store/auth/auth.effects';
import { metaReducers } from './store/app.meta-reducers';
import { initialState } from './store/app.state';
import { sceneReducer } from './store/scene/scene.reducer';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(withFetch(),),
    provideEffects([AuthEffects]),
    provideStore({
      authState: authReducer,
    }, {
      initialState,
      metaReducers,
    }),
    provideState({ name: 'authState', reducer: authReducer }),
    provideState({ name: 'sceneState', reducer: sceneReducer }),
    provideStoreDevtools({
      maxAge: 25, // Retains last 25 states
      logOnly: !isDevMode(), // Restrict extension to log-only mode
      autoPause: true, // Pauses recording actions and state changes when the extension window is not open
      trace: false, //  If set to true, will include stack trace for every dispatched action, so you can see it in trace tab jumping directly to that part of code
      traceLimit: 75, // maximum stack trace frames to be stored (in case trace option was provided as true)
      connectInZone: true // If set to true, the connection is established within the Angular zone
    }), provideAnimationsAsync()
  ]

};
