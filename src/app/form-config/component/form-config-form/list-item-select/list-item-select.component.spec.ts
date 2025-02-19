import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListItemSelectComponent } from './list-item-select.component';

describe('ListItemSelectComponent', () => {
  let component: ListItemSelectComponent;
  let fixture: ComponentFixture<ListItemSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListItemSelectComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListItemSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
