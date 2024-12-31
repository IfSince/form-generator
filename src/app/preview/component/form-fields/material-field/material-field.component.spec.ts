import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialFieldComponent } from './material-field.component';

describe('MaterialFieldComponent', () => {
  let component: MaterialFieldComponent;
  let fixture: ComponentFixture<MaterialFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MaterialFieldComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MaterialFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
