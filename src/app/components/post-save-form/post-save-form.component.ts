import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Store, StoreModule } from '@ngrx/store';
import { UploadService } from '../../services/upload.service';
import { AppState } from '../../store/app.state';
import { VoxelBuildService } from '../../services/voxel-build.service';
import { selectLoginToken } from '../../store/auth/auth.selectors';
import { combineLatest, defaultIfEmpty, EMPTY, filter, first, iif, map, Observable, switchMap, tap, throwIfEmpty, withLatestFrom } from 'rxjs';
import { selectPreview as selectScenePreview, selectSceneActive, selectPreviewLocal } from '../../store/scene/scene.selector';
import { ActivatedRoute, Router } from '@angular/router';
import { VoxelBuildModel } from '../../models/voxel-build.model';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';


@Component({
  selector: 'app-post-form',
  standalone: true,
  imports: [
    ReactiveFormsModule, 
    CommonModule, 
    StoreModule,
    MatButtonModule,
    MatInputModule,
  ],
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
    private router: Router,
  ) {
    
  }

  token$: Observable<string | null> = EMPTY;
  post$: Observable<VoxelBuildModel> = EMPTY;
  previewUrl$: Observable<string> = EMPTY; 
  uuid: string | null = null;

  postForm = this.formBuilder.group({
    title: new FormControl('New Build', [Validators.required]),
    description: new FormControl()
  });

  ngOnInit(): void {
    this.store.subscribe();
    this.token$ = this.store.select(selectLoginToken);
    this.previewUrl$ = this.store.select(selectPreviewLocal);
    this.uuid = this.route.snapshot.paramMap.get('uuid');
    if (this.uuid != null) {
      this.post$ = this.voxelBuildService.getVoxelBuild(this.uuid).pipe(
        filter(voxelBuild => !!voxelBuild),
        map(voxelBuild => voxelBuild as VoxelBuildModel)
      );
    }
  }

  onSubmit() {
    if (!this.postForm.valid) {
      throw new Error('Post form is invalid');
    }

    if (this.uuid != null) {
      combineLatest([this.store.select(selectSceneActive), this.token$, this.store.select(selectScenePreview), this.post$]).pipe(
        switchMap(([sceneJson, token, preview, post]) => this.voxelBuildService.putVoxelBuild({
          uuid: this.uuid as `${string}-${string}-${string}-${string}-${string}`,
          title: this.postForm.value.title ?? post.title,
          description: this.postForm.value.description ?? post.description,
        }, sceneJson!, new File([preview], 'preview'), token!))
      ).subscribe((uuid) => {
        this.router.navigate([`/posts/${uuid}`]);
      });
    } 
    
    else {
      this.store.select(selectSceneActive).pipe(
        withLatestFrom(this.token$, this.store.select(selectScenePreview), this.post$.pipe(defaultIfEmpty({
          title: 'New Build',
          description: 'No description',
        } as VoxelBuildModel))),
        switchMap(([sceneJson, token, preview, post]) => this.voxelBuildService.postVoxelBuild({
          title: this.postForm.value.title ?? post.title,
          description: this.postForm.value.description ?? post.description,
        }, sceneJson!, new File([preview], 'preview'), token!))
      ).subscribe(uuid => {
        this.router.navigate([`/posts/${uuid}`]);
      });
    }
    
    
    
  }
}
