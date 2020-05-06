import { TestBed } from '@angular/core/testing';

import { MetingDataService } from './meting-data.service';

describe('MetingDataService', () => {
  let service: MetingDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MetingDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
