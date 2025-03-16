import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environment';
import { Observable } from 'rxjs';
import { VoxelBuild } from '../models/voxel-build.model';

@Injectable({
  providedIn: 'root'
})
export class VoxelBuildService {
  
  constructor(private client: HttpClient) { }

  public getVoxelBuilds(): Observable<VoxelBuild[]> {
    return this.client.get<VoxelBuild[]>(`${environment.api}voxel-build`);
  }
}
