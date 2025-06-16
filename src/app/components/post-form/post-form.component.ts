import { Component, Input, OnInit } from '@angular/core';
import { Sculpture } from '../../models/webgl-models/sculpture.model';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Store, StoreModule } from '@ngrx/store';
import { UploadService } from '../../services/upload.service';
import { AppState } from '../../store/app.state';
import { VoxelBuildService } from '../../services/voxel-build.service';
import { selectLoginUser, selectLoginToken } from '../../store/auth/auth.selectors';
import { EMPTY, Observable } from 'rxjs';

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
    this.token$.subscribe((token) => {
      this.token = token;
    });
  }

  onSubmit() {
    if (!this.postForm.valid) {
      throw new Error('Post form is invalid');
    }
    const dataJson = sessionStorage.getItem('scene');
    if (dataJson == null) {
      throw new Error('No post to save');
    }
    this.voxelBuildService.postVoxelBuild({
      description: this.postForm.value.description,
      title: this.postForm.value.title!
    }, this.token!).subscribe(uuid => {
      const file = new File([dataJson], uuid);
      this.uploadService.upload(file).subscribe();
    });
  }
}
