import { TestBed } from '@angular/core/testing';

import { CommunicationDirectionService } from './communication-direction.service';

describe('CommunicationDirectionService', () => {
  let service: CommunicationDirectionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CommunicationDirectionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
