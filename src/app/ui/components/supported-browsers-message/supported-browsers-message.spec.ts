import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupportedBrowsersMessage } from './supported-browsers-message';

describe('SupportedBrowsersMessage', () => {
  let component: SupportedBrowsersMessage;
  let fixture: ComponentFixture<SupportedBrowsersMessage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SupportedBrowsersMessage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SupportedBrowsersMessage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
