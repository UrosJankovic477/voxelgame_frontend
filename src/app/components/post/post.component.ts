import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { VoxelBuild } from '../../models/voxel-build.model';
import { VoxelBuildService } from '../../services/voxel-build.service';
import { UploadService } from '../../services/upload.service';

@Component({
  selector: 'app-post',
  standalone: true,
  imports: [],
  templateUrl: './post.component.html',
  styleUrl: './post.component.css'
})
export class PostComponent implements OnInit {

  voxelBuild: VoxelBuild | null = null; 

  constructor(
    private uploadService: UploadService, 
    private readonly route: ActivatedRoute, 
    private service: VoxelBuildService) {
    
  }

  ngOnInit(): void {
    const uuid = this.route.snapshot.paramMap.get('uuid');
    this.service.getVoxelBuild(uuid!).subscribe(voxelBuild => {
      this.voxelBuild = voxelBuild;
    });



  }

}
