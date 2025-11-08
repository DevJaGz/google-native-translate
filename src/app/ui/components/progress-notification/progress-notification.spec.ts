import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgressNotification } from './progress-notification';

describe('ProgressNotification', () => {
  let component: ProgressNotification;
  let fixture: ComponentFixture<ProgressNotification>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProgressNotification]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProgressNotification);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
