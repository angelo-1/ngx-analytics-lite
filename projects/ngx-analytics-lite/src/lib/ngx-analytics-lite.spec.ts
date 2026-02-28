import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxAnalyticsLite } from './ngx-analytics-lite';

describe('NgxAnalyticsLite', () => {
  let component: NgxAnalyticsLite;
  let fixture: ComponentFixture<NgxAnalyticsLite>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgxAnalyticsLite],
    }).compileComponents();

    fixture = TestBed.createComponent(NgxAnalyticsLite);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
