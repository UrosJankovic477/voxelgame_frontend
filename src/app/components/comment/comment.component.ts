import { Component, ComponentRef, EventEmitter, Input, OnInit, Output, ViewChild, ViewContainerRef } from '@angular/core';
import { CommentModel } from '../../models/comment.model';
import { environment } from '../../../../environment';
import { CommonModule } from '@angular/common';
import { AppState } from '../../store/app.state';
import { Store } from '@ngrx/store';
import { BehaviorSubject, concat, EMPTY, filter, map, Observable, of, switchMap, withLatestFrom } from 'rxjs';
import { selectLoginToken, selectLoginUser } from '../../store/auth/auth.selectors';
import { MatExpansionModule } from "@angular/material/expansion";
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { CommentService } from '../../services/comment.service';
import { CommentWriteComponent } from "../comment-write/comment-write.component";
import { EnvironmentService } from '../../services/environment.service';

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

  constructor(
    private store: Store<AppState>,
    private commentService: CommentService,
    public environmentService: EnvironmentService
  ) {

  }

  @Input() comment!: CommentModel;
  @Output() updateComments = new EventEmitter<void>();
  isLoggedInUser$: Observable<boolean> = EMPTY;
  editMode = false;
  repliesPage = 1;
  repliesShown = false;
  repliesPageSubject = new BehaviorSubject<number>(1);
  replies: CommentModel[] = [];
  repliesCount: number = 0;
  repliesLoaded = false;


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
      switchMap(token => this.commentService.editComment(content, this.comment.uuid, token!))
    ).subscribe(() => {
      this.updateComments.emit();
    });
    this.editMode = false;
    
  }

  deleteComment() {
    this.token$.pipe(
      filter(token => !!token),
      switchMap(token => this.commentService.deleteComment(this.comment.uuid, token!))
    ).subscribe(() => {
      this.updateComments.emit();
    });
    
  }

  
  ngOnInit(): void {
    this.repliesCount = this.comment.count;
    this.isLoggedInUser$ = this.store.select(selectLoginUser).pipe(
      map(user => user?.username === this.comment.username)
    );

    
  }

  toggleReplies() {
    if (!this.repliesLoaded) {
      this.getReplies();
      this.repliesLoaded = true;
    }
    this.repliesShown = !this.repliesShown;
  }

  getNextRepliesPage() {
    this.repliesPageSubject.next(this.repliesPageSubject.value + 1);
  }

  getReplies() {
    this.repliesPageSubject.pipe(
      switchMap(repliesPage => this.commentService.getReplies(this.comment.uuid, 10, repliesPage))
    ).subscribe(replies => {
      this.replies.push(...replies);
    });
  }

  showWriteReplyForm() {
    this.replyForm = this.viewContainerRef.createComponent(CommentWriteComponent);
    this.replyForm?.instance.saveComment.pipe(
      withLatestFrom(this.token$),
      filter(token => !!token),
      switchMap(([content, token]) => this.commentService.reply(content, this.comment.uuid, token!))
    ).subscribe(() => this.removeWriteReplyForm());
    this.replyForm?.instance.cancel.subscribe(() => this.removeWriteReplyForm());
  }

  removeWriteReplyForm() {
    this.replyForm?.destroy();
  }
  
  
}
