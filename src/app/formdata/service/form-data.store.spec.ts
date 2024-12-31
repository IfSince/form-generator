import { TestBed } from '@angular/core/testing';

import { FormDataStore } from './form-data.store';

describe('FormDataStore', () => {
  let service: FormDataStore;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FormDataStore);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
