import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListItemButtonToggleComponent } from './list-item-button-toggle.component';

describe('ListItemButtonToggleComponent', () => {
  let component: ListItemButtonToggleComponent;
  let fixture: ComponentFixture<ListItemButtonToggleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListItemButtonToggleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListItemButtonToggleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
