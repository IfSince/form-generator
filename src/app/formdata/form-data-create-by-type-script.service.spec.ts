import { TestBed } from '@angular/core/testing';

import { FormDataCreateByTypeScriptService } from './form-data-create-by-type-script.service';

describe('FormDataCreateByTypeScriptService', () => {
  let service: FormDataCreateByTypeScriptService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FormDataCreateByTypeScriptService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
