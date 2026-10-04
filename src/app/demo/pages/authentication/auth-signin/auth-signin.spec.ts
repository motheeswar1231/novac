import { TestBed } from '@angular/core/testing';

import { AuthSignin } from './auth-signin';

describe('AuthSignin', () => {
  let service: AuthSignin;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthSignin);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

function expect(service: AuthSignin) {
  throw new Error('Function not implemented.');
}
