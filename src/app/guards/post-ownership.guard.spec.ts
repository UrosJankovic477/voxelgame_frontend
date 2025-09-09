import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { postOwnershipGuard } from './post-ownership.guard';

describe('postOwnershipGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => postOwnershipGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
