import { Routes } from '@angular/router';
import { UserComponent } from './components/user/user.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { LoginComponent } from './components/login/login.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { GameCanvasComponent } from './components/game-canvas/game-canvas.component';
import { EditUserComponent } from './components/edit-user/edit-user.component';
import { userAuthGuard } from './guards/user-auth.guard';
import { PostFormComponent } from './components/post-form/post-form.component';
import { PostComponent } from './components/post/post.component';

export const routes: Routes = [
    {
        path: 'user/:username',
        component: UserComponent,
        
    },
    {
        path: 'edit-profile',
        canActivate: [userAuthGuard],
        component: EditUserComponent,
    },
    {
        path: 'post/:uuid',
        component: PostComponent,
    },
    {
        path: 'post-form',
        canActivate: [userAuthGuard],
        component: PostFormComponent,
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
