import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SunnyComponent } from './sunny.component';

describe('SunnyComponent', () => {
  let component: SunnyComponent;
  let fixture: ComponentFixture<SunnyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SunnyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SunnyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
