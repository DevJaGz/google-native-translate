import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LanguageSelectorButton } from './language-selector-button';

describe('LanguageSelectorButton', () => {
  let component: LanguageSelectorButton;
  let fixture: ComponentFixture<LanguageSelectorButton>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LanguageSelectorButton]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LanguageSelectorButton);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
