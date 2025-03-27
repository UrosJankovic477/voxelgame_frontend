import { Routes } from '@angular/router';
import { UserComponent } from './components/user/user.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { LoginComponent } from './components/login/login.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { GameCanvasComponent } from './components/game-canvas/game-canvas.component';

export const routes: Routes = [
    {
        path: 'user',
        component: UserComponent,
    },
    {
        path: 'login',
        component: LoginComponent,
    },
    {
        path: 'sign-up',
        component: SignUpComponent,
    },
    {
        path: 'game-canvas',
        component: GameCanvasComponent,
    },
    {
        path: '**',
        component: PageNotFoundComponent,
    }
];
