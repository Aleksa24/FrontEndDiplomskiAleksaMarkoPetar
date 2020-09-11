import { TestBed } from '@angular/core/testing';

import { SearchableService } from './searchable.service';

describe('SearchableService', () => {
  let service: SearchableService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SearchableService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
