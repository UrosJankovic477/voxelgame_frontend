import { TestBed } from '@angular/core/testing';
import { CanActivateChildFn } from '@angular/router';

import { userAuthGuard } from './user-auth.guard';

describe('userAuthGuard', () => {
  const executeGuard: CanActivateChildFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => userAuthGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
