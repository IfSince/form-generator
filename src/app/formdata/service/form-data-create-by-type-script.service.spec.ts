import { TestBed } from '@angular/core/testing';

import { FormDataCreateService } from './form-data-create.service';

describe('FormDataCreateByTypeScriptService', () => {
  let service: FormDataCreateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FormDataCreateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
