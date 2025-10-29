import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TextTranslation } from './text-translation';

describe('TextTranslation', () => {
  let component: TextTranslation;
  let fixture: ComponentFixture<TextTranslation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TextTranslation]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TextTranslation);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
