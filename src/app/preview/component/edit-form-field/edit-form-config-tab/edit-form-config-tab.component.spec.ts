import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditFormConfigTabComponent } from './edit-form-config-tab.component';

describe('EditFormConfigTabComponent', () => {
  let component: EditFormConfigTabComponent;
  let fixture: ComponentFixture<EditFormConfigTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditFormConfigTabComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditFormConfigTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
