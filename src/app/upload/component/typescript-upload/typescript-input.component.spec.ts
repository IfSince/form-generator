import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TypescriptInputComponent } from './typescript-input.component';

describe('TypescriptInputComponent', () => {
  let component: TypescriptInputComponent;
  let fixture: ComponentFixture<TypescriptInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TypescriptInputComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TypescriptInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
