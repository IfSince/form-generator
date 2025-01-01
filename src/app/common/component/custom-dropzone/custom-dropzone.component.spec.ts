import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomDropzoneComponent } from './custom-dropzone.component';

describe('CustomDropzoneComponent', () => {
  let component: CustomDropzoneComponent;
  let fixture: ComponentFixture<CustomDropzoneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomDropzoneComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomDropzoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
