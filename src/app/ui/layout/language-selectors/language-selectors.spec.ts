import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LanguageSelectors } from './language-selectors';

describe('LanguageSelectors', () => {
  let component: LanguageSelectors;
  let fixture: ComponentFixture<LanguageSelectors>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LanguageSelectors]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LanguageSelectors);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
