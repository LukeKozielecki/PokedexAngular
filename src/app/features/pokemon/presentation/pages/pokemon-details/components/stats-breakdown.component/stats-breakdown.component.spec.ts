import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatsBreakdownComponent } from './stats-breakdown.component';

describe('StatsBreakdownComponent', () => {
  let component: StatsBreakdownComponent;
  let fixture: ComponentFixture<StatsBreakdownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatsBreakdownComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StatsBreakdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
