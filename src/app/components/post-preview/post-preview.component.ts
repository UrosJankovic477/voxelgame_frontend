import { Component, Input } from '@angular/core';
import { VoxelBuildModel } from '../../models/voxel-build.model';
import { environment } from '../../../../environment';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-post-preview',
  standalone: true,
  imports: [
    RouterModule, 
    CommonModule,
    MatCardModule,
    MatButtonModule,
  ],
  templateUrl: './post-preview.component.html',
  styleUrl: './post-preview.component.css'
})
export class PostPreviewComponent {
  @Input() post: VoxelBuildModel = {};

  public get api() {
    return environment.api;
  }
}
