import { Component, OnInit } from '@angular/core';
import { VoxelBuildService } from '../../services/voxel-build.service';
import { map, Observable, switchMap } from 'rxjs';
import { VoxelBuildModel } from '../../models/voxel-build.model';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ActivatedRoute, provideRouter, Route, Router, withComponentInputBinding } from '@angular/router';
import { routes } from '../../app.routes';
import { PostPreviewComponent } from "../post-preview/post-preview.component";
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'app-posts',
  standalone: true,
  imports: [
    CommonModule, 
    HttpClientModule, 
    PostPreviewComponent,
    MatListModule,
  ],
  templateUrl: './posts.component.html',
  styleUrl: './posts.component.css',
})
export class PostsComponent implements OnInit {

  posts$?: Observable<VoxelBuildModel[]>;

  constructor(
    private voxelBuildsService: VoxelBuildService,
    private route: ActivatedRoute
  ) {
  }

  ngOnInit(): void {
    this.posts$ = this.route.queryParams.pipe(
      switchMap((params) => this
      .voxelBuildsService
      .getVoxelBuilds(params['searchString'], params['count'], params['page']))
    );
  }

}
