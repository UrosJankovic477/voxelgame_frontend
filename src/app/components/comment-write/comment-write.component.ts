import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/app.state';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { EMPTY, fromEvent, map, Observable } from 'rxjs';
import { UserModel } from '../../models/user.model';
import { selectLoginUser } from '../../store/auth/auth.selectors';
import { CommentService } from '../../services/comment.service';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-comment-write',
  standalone: true,
  imports: [
    RouterModule, 
    CommonModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
  ],
  templateUrl: './comment-write.component.html',
  styleUrl: './comment-write.component.css'
})
export class CommentWriteComponent implements OnInit {

  constructor(private formBuilder: FormBuilder) {

  }
  ngOnInit(): void {
    this.commentForm = this.formBuilder.group(
      {
        content: new FormControl(this.content, Validators.minLength(1))
      }
    );
    this.commentForm.value.content = this.content;
  }

  @Input() content = '';
  @Output() saveComment = new EventEmitter<string>();
  @Output() cancel = new EventEmitter();

  commentForm!: FormGroup;

  onSubmit() {
    if (this.commentForm.valid) {
      this.saveComment.emit(this.commentForm.value.content!);
    }
  }


  onReset() {
    this.commentForm.reset();
    this.cancel.emit();
  }
}
