import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { VoxelBuildService } from '../services/voxel-build.service';
import { Store } from '@ngrx/store';
import { AppState } from '../store/app.state';
import { selectLoginUser } from '../store/auth/auth.selectors';
import { combineLatest, map, withLatestFrom } from 'rxjs';

export const postOwnershipGuard: CanActivateFn = (route, state) => {
  const uuid = route.paramMap.get('uuid');
  if (uuid == null) {
    return false;
  }
  const voxelBuildService = inject(VoxelBuildService);
  const store = inject(Store<AppState>);
  const user$ = store.select(selectLoginUser);
  const voxelBuild$ = voxelBuildService.getVoxelBuild(uuid);

  return combineLatest([user$, voxelBuild$]).pipe(
    map(([user, voxelBuild]) => (!!user && !!voxelBuild && (user.username == voxelBuild.user?.username)))
  );
};
