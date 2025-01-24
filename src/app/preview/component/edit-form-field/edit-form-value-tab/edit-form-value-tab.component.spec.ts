import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditFormValueTabComponent } from './edit-form-value-tab.component';

describe('EditFormValueTabComponent', () => {
  let component: EditFormValueTabComponent;
  let fixture: ComponentFixture<EditFormValueTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditFormValueTabComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditFormValueTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
