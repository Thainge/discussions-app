import { TestBed } from '@angular/core/testing';

import { DiscussionApiService } from './discussion-api.service';

describe('DiscussionApiService', () => {
  let service: DiscussionApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DiscussionApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
