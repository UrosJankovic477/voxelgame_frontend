import { Routes } from '@angular/router';
import { UserComponent } from './components/user/user.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { LoginComponent } from './components/login/login.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { GameCanvasComponent } from './components/game-canvas/game-canvas.component';
import { EditUserComponent } from './components/edit-user/edit-user.component';
import { userAuthGuard } from './guards/user-auth.guard';
import { PostFormComponent as PostSaveFormComponent } from './components/post-save-form/post-save-form.component';
import { PostComponent } from './components/post/post.component';
import { PostsComponent } from './components/posts/posts.component';

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
        path: 'posts/:uuid',
        component: PostComponent,
    },
    {
        path: 'posts',
        component: PostsComponent,
    },
    {
        path: 'post-save-form',
        canActivate: [userAuthGuard],
        component: PostSaveFormComponent,
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
