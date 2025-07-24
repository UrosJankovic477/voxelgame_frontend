import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environment';
import { Observable } from 'rxjs';
import { VoxelBuildModel } from '../models/voxel-build.model';
import { CommentModel } from '../models/comment.model';

@Injectable({
  providedIn: 'root'
})
export class VoxelBuildService {
  
  constructor(private client: HttpClient) { }

  public getVoxelBuilds(searchString?: string, count?: number, page?: number): Observable<VoxelBuildModel[]> {
    let url = new URL('/voxel-build', environment.api);
    if (searchString) {
      url.searchParams.set('searchString', searchString);
    }
    if (count) {
      url.searchParams.set('count', `${count}`);
    }
    if (page) {
      url.searchParams.set('page', `${page}`);
    }
    
    return this.client.get<VoxelBuildModel[]>(url.toString());
  }

  public postVoxelBuild(voxelBuild: VoxelBuildModel, sceneJson: string, preview: File, token: string) {
    const formData = new FormData();
    const postFile = new File([sceneJson], 'post', {
      type: 'text/plain'
    });
    formData.append('voxelBuild', JSON.stringify(voxelBuild))
    formData.append('post', postFile);
    formData.append('preview', preview);
    return this.client.post(`${environment.api}/voxel-build`, formData, {
      headers:
      {
        'Authorization': `Bearer ${token}`
      },
      responseType: 'text'
    });
  }

  public getVoxelBuild(uuid: string) {
    return this.client.get<VoxelBuildModel | null>(`${environment.api}/voxel-build/${uuid}`);
  }

  public getVoxelBuildComments(uuid: string) {
    return this.client.get<CommentModel[]>(`${environment.api}/voxel-build/${uuid}/comments`);
  }

  public deleteVoxelBuild(uuid: string, token: string) {
    return this.client.delete(`${environment.api}/voxel-build/${uuid}`, {
      headers:
      {
        'Authorization': `Bearer ${token}`
      },
      responseType: 'text'
    })
  }
}
