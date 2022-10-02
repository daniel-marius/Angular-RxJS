import { TestBed } from '@angular/core/testing';

import { DataAccessService } from './data-access.service';

describe('DataAccessService', (): void => {
  let service: DataAccessService;

  beforeEach((): void => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DataAccessService);
  });

  it('should be created', (): void => {
    expect(service).toBeTruthy();
  });
});
