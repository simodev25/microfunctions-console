import { TestBed } from '@angular/core/testing';

import { AccressService } from './accress.service';

describe('AccressService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AccressService = TestBed.get(AccressService);
    expect(service).toBeTruthy();
  });
});
