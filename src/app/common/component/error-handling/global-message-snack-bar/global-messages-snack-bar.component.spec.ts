import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GlobalMessagesSnackBarComponent } from './global-messages-snack-bar.component';

describe('GlobalMessagesSnackBarComponent', () => {
  let component: GlobalMessagesSnackBarComponent;
  let fixture: ComponentFixture<GlobalMessagesSnackBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GlobalMessagesSnackBarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GlobalMessagesSnackBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
