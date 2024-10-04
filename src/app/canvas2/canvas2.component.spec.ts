import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Canvas2Component } from './canvas2.component';

describe('Canvas2Component', () => {
  let component: Canvas2Component;
  let fixture: ComponentFixture<Canvas2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Canvas2Component]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(Canvas2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
