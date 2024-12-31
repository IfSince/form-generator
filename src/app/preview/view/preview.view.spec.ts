import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewView } from './preview.view';

describe('PreviewView', () => {
  let component: PreviewView;
  let fixture: ComponentFixture<PreviewView>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PreviewView]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PreviewView);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
