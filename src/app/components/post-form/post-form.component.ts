import { Component, Input, OnInit } from '@angular/core';
import { Sculpture } from '../../models/webgl-models/sculpture.model';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Store, StoreModule } from '@ngrx/store';
import { UploadService } from '../../services/upload.service';
import { AppState } from '../../store/app.state';
import { VoxelBuildService } from '../../services/voxel-build.service';
import { selectLoginUser, selectLoginToken } from '../../store/auth/auth.selectors';
import { catchError, EMPTY, first, iif, map, Observable, of, switchMap, throwIfEmpty, withLatestFrom } from 'rxjs';
import { selectSceneActive } from '../../store/scene/scene.selector';
import { EMPTY_OBSERVER } from 'rxjs/internal/Subscriber';

@Component({
  selector: 'app-post-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, StoreModule],
  templateUrl: './post-form.component.html',
  styleUrl: './post-form.component.css'
})
export class PostFormComponent implements OnInit {
  constructor(
    private formBuilder: FormBuilder,
    private voxelBuildService: VoxelBuildService,
    private uploadService: UploadService,
    private store: Store<AppState>,
  ) {
    
  }

  token: string | null = null;
  token$: Observable<string | null> = EMPTY;

  postForm = this.formBuilder.group({
    title: new FormControl('New Build', [Validators.required]),
    description: new FormControl()
  });

  ngOnInit(): void {
    this.store.subscribe();
    this.token$ = this.store.select(selectLoginToken);
  }

  onSubmit() {
    if (!this.postForm.valid) {
      throw new Error('Post form is invalid');
    }
    this.store.select(selectSceneActive).pipe(
      withLatestFrom(this.token$),
      switchMap(([sceneJson, token]) => iif(() =>
        sceneJson === null,
        EMPTY,
        this.voxelBuildService.postVoxelBuild({
          title: this.postForm.value.title ?? 'New Build',
          description: this.postForm.value.description ?? 'No description',
        }, token!).pipe(
          first(),
          switchMap(postUuid => this.uploadService.uploadPost(new File([sceneJson!], postUuid), token!))
        )
      )),
      throwIfEmpty(() => 'No post to save'),
    ).subscribe({
      next() {
        console.log('Build was posted');
      },
      error(err: Error) {
        console.error(`Failed to post build. ${err.message}`);
      }
      
    })
  }
}
