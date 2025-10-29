import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LanguageSelectorModal } from './language-selector-modal';

describe('LanguageSelectorModal', () => {
  let component: LanguageSelectorModal;
  let fixture: ComponentFixture<LanguageSelectorModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LanguageSelectorModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LanguageSelectorModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
