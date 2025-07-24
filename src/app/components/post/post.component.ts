import { AfterContentInit, Component, OnChanges, OnInit, SimpleChanges, ViewChild, ViewContainerRef } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { VoxelBuildModel } from '../../models/voxel-build.model';
import { VoxelBuildService } from '../../services/voxel-build.service';
import { UploadService } from '../../services/upload.service';
import { GameCanvasComponent } from "../game-canvas/game-canvas.component";
import { EMPTY, filter, map, Observable, switchMap, throwIfEmpty, withLatestFrom } from 'rxjs';
import { environment } from '../../../../environment';
import { CommentWriteComponent } from "../comment-write/comment-write.component";
import { CommonModule } from '@angular/common';
import { CommentsComponent } from "../comments/comments.component";
import { UserModel } from '../../models/user.model';
import { AppState } from '../../store/app.state';
import { Store } from '@ngrx/store';
import { selectLoginToken, selectLoginUser } from '../../store/auth/auth.selectors';
import { CommentComponent } from "../comment/comment.component";
import { CommentModel } from '../../models/comment.model';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommentService } from '../../services/comment.service';
import { SubscribeButtonComponent } from '../subscribe-button/subscribe-button.component';

@Component({
  selector: 'app-post',
  standalone: true,
  imports: [
    GameCanvasComponent, 
    CommentWriteComponent, 
    SubscribeButtonComponent,
    CommonModule, 
    RouterModule, 
    CommentComponent,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './post.component.html',
  styleUrl: './post.component.css'
})
export class PostComponent implements OnInit {

  constructor(
    private readonly route: ActivatedRoute,
    private store: Store<AppState>,
    private voxelBuildService: VoxelBuildService,
    private commentService: CommentService
  ) {
    
  }

  editPost() {
    this.gameCanvas.saveScene();
  }

  deletePost() {
    this.token$.pipe(
      filter(token => token != null),
      throwIfEmpty(() => new Error('no authentication token')),
      switchMap(token => this.voxelBuildService.deleteVoxelBuild(this.uuid!, token!))
    ).subscribe()
  }

  postComment(content: string) {
    this.token$.pipe(
      filter(token => !!token),
      switchMap(token => this.commentService.postComment(content, this.uuid!, token!))
    ).subscribe();
  }

  sceneJson?: string;
  voxelBuild$: Observable<VoxelBuildModel> = EMPTY;
  uuid: string | null = null;
  token$: Observable<string | null> = EMPTY;
  user$: Observable<UserModel | null> = EMPTY;
  owns$: Observable<boolean> = EMPTY;
  comments$: Observable<CommentModel[]> = EMPTY;
  authorUsername$: Observable<string | null> = EMPTY;
  @ViewChild(GameCanvasComponent) gameCanvas!: GameCanvasComponent; 
  @ViewChild(SubscribeButtonComponent, {
    read: ViewContainerRef
  }) viewContainerRef!: ViewContainerRef;

  async ngOnInit(): Promise<void> {
    this.token$ = this.store.select(selectLoginToken);
    this.user$ = this.store.select(selectLoginUser);
    this.uuid = this.route.snapshot.paramMap.get('uuid');
    if (this.uuid == null) {
      throw new Error("Missing UUID parameter in URL");
    }
    this.voxelBuild$ = this.voxelBuildService.getVoxelBuild(this.uuid).pipe(
      filter(voxelBuild => voxelBuild !== null),
      map(voxelBuild => voxelBuild as VoxelBuildModel)
    );
    this.comments$ = this.voxelBuildService.getVoxelBuildComments(this.uuid).pipe(
      filter(comments => comments.length > 0)
      
    );
    this.owns$ = this.user$.pipe(
      withLatestFrom(this.voxelBuild$),
      map(([user, voxelBuild]) => user != null && voxelBuild.user != null && voxelBuild.user.username == user.username)
    );
    this.authorUsername$ = this.voxelBuild$.pipe(
      map(voxelBuild => voxelBuild.user?.username ?? null)
    );
  }
  

}
