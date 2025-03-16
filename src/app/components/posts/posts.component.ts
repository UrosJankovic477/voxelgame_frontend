import { Component, OnInit } from '@angular/core';
import { VoxelBuildService } from '../../services/voxel-build.service';
import { Observable } from 'rxjs';
import { VoxelBuild } from '../../models/voxel-build.model';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { routes } from '../../app.routes';

@Component({
  selector: 'app-posts',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './posts.component.html',
  styleUrl: './posts.component.css',
})
export class PostsComponent implements OnInit {

  posts?: VoxelBuild[];

  constructor(private voxelBuildsService: VoxelBuildService) {
  }

  ngOnInit(): void {
    this.voxelBuildsService.getVoxelBuilds().subscribe((posts) => {
      this.posts = posts;
    });
  }

}
