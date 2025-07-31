import { Component, OnInit } from '@angular/core';
import { EMPTY, Observable } from 'rxjs';
import { VoxelBuildModel } from '../../models/voxel-build.model';
import { VoxelBuildService } from '../../services/voxel-build.service';
import { PostsComponent } from "../posts/posts.component";
import { EnvironmentService } from '../../services/environment.service';
import { MatButtonModule } from '@angular/material/button';
import { MatDivider } from '@angular/material/divider';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [
    PostsComponent,
    MatButtonModule,
    MatDivider,
    RouterModule
  ],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css'
})
export class HomePageComponent implements OnInit {

  constructor(
    private voxelBuildService: VoxelBuildService,
    public environmentService: EnvironmentService
  ) {

  }
  ngOnInit(): void {
  }



}
