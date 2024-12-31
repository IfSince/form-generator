import { TestBed } from '@angular/core/testing';

import { FormDataFormBuilderService } from './form-data-form-builder.service';

describe('FormDataFormBuilderService', () => {
  let service: FormDataFormBuilderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FormDataFormBuilderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
