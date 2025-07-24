import { Component, ComponentRef, EventEmitter, Input, OnInit, Output, ViewChild, ViewContainerRef } from '@angular/core';
import { CommentModel } from '../../models/comment.model';
import { environment } from '../../../../environment';
import { CommonModule } from '@angular/common';
import { AppState } from '../../store/app.state';
import { Store } from '@ngrx/store';
import { concat, EMPTY, filter, map, Observable, switchMap, withLatestFrom } from 'rxjs';
import { selectLoginToken, selectLoginUser } from '../../store/auth/auth.selectors';
import { MatExpansionModule } from "@angular/material/expansion";
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { CommentService } from '../../services/comment.service';
import { CommentWriteComponent } from "../comment-write/comment-write.component";

@Component({
  selector: 'app-comment',
  standalone: true,
  imports: [
    CommonModule,
    MatExpansionModule,
    MatButtonModule,
    MatIconModule,
    CommentWriteComponent,
    MatListModule,
    MatCardModule,
],
  templateUrl: './comment.component.html',
  styleUrl: './comment.component.css'
})
export class CommentComponent implements OnInit {

  @Input() comment!: CommentModel;
  isLoggedInUser$: Observable<boolean> = EMPTY;
  editMode = false;
  repliesPage = 1;

  replies$: Observable<CommentModel[]> = EMPTY;


  @ViewChild("container", {
    read: ViewContainerRef
  }) viewContainerRef!: ViewContainerRef;

  replyForm?: ComponentRef<CommentWriteComponent>;

  token$ = this.store.select(selectLoginToken).pipe(
    filter(token => !!token)
  );

  editComment() {
    this.editMode = true;
  }

  cancelEdit() {
    this.editMode = false;
  }

  saveComment(content: string) {
    const token$ = this.store.select(selectLoginToken).pipe(
      filter(token => !!token)
    );
    token$.pipe(
      switchMap(token => this.commentService.editComment(content, this.comment.id, token!))
    ).subscribe();
    this.editMode = false;
  }

  deleteComment() {
    this.token$.pipe(
      filter(token => !!token),
      switchMap(token => this.commentService.deleteComment(this.comment.id, token!))
    ).subscribe();
    
  }

  constructor(
    private store: Store<AppState>,
    private commentService: CommentService,
  ) {

  }
  ngOnInit(): void {
    this.isLoggedInUser$ = this.store.select(selectLoginUser).pipe(
      map(user => user?.username === this.comment.username)
    );

    console.log(this.comment);
    
  }

  getReplies() {
    this.replies$ = concat(this.replies$, this.commentService.getReplies(this.comment.id, 10, this.repliesPage));
    this.repliesPage++;
  }

  showWriteReplyForm() {
    this.replyForm = this.viewContainerRef.createComponent(CommentWriteComponent);
    this.replyForm?.instance.saveComment.pipe(
      withLatestFrom(this.token$),
      filter(token => !!token),
      switchMap(([content, token]) => this.commentService.reply(content, this.comment.id, token!))
    ).subscribe();
    this.replyForm?.instance.cancel.subscribe(() => this.removeWriteReplyForm());
  }

  removeWriteReplyForm() {
    this.replyForm?.destroy();
  }
  
  public get api() : string {
    return environment.api;
  }
  
  
  public get defaultPictureLocation() : string {
    return environment.defaultProfilePicture;
  }
  
  
}
