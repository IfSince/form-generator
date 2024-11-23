import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadView } from './upload.view';

describe('UploadView', () => {
  let component: UploadView;
  let fixture: ComponentFixture<UploadView>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UploadView]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UploadView);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
