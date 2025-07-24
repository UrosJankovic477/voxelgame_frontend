import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Store, StoreModule } from '@ngrx/store';
import { UploadService } from '../../services/upload.service';
import { AppState } from '../../store/app.state';
import { VoxelBuildService } from '../../services/voxel-build.service';
import { selectLoginToken } from '../../store/auth/auth.selectors';
import { defaultIfEmpty, EMPTY, filter, first, iif, map, Observable, switchMap, throwIfEmpty, withLatestFrom } from 'rxjs';
import { selectPreview as selectScenePreview, selectSceneActive, selectPreviewLocal } from '../../store/scene/scene.selector';
import { ActivatedRoute } from '@angular/router';
import { VoxelBuildModel } from '../../models/voxel-build.model';


@Component({
  selector: 'app-post-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, StoreModule],
  templateUrl: './post-save-form.component.html',
  styleUrl: './post-save-form.component.css'
})
export class PostFormComponent implements OnInit {
  constructor(
    private formBuilder: FormBuilder,
    private voxelBuildService: VoxelBuildService,
    private uploadService: UploadService,
    private store: Store<AppState>,
    private route: ActivatedRoute,
  ) {
    
  }

  token$: Observable<string | null> = EMPTY;
  post$: Observable<VoxelBuildModel> = EMPTY;
  previewUrl$: Observable<string> = EMPTY; 

  postForm = this.formBuilder.group({
    title: new FormControl('New Build', [Validators.required]),
    description: new FormControl()
  });

  ngOnInit(): void {
    this.store.subscribe();
    this.token$ = this.store.select(selectLoginToken);
    this.previewUrl$ = this.store.select(selectPreviewLocal);
    const uuid = this.route.snapshot.paramMap.get('uuid');
    if (uuid != null) {
      this.post$ = this.voxelBuildService.getVoxelBuild(uuid).pipe(
        filter(voxelBuild => voxelBuild !== null),
        map(voxelBuild => voxelBuild as VoxelBuildModel)
      );
    }
  }

  onSubmit() {
    if (!this.postForm.valid) {
      throw new Error('Post form is invalid');
    }
    this.store.select(selectSceneActive).pipe(
      withLatestFrom(this.token$, this.store.select(selectScenePreview), this.post$.pipe(defaultIfEmpty({
        title: 'New Build',
        description: 'No description',
      } as VoxelBuildModel))),
      switchMap(([sceneJson, token, preview, post]) => this.voxelBuildService.postVoxelBuild({
        title: this.postForm.value.title ?? post.title,
        description: this.postForm.value.description ?? post.description,
      }, sceneJson!, new File([preview], 'preview'), token!))
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
