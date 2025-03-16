import { TestBed } from '@angular/core/testing';

import { VoxelBuildService } from './voxel-build.service';

describe('VoxelBuildService', () => {
  let service: VoxelBuildService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VoxelBuildService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
