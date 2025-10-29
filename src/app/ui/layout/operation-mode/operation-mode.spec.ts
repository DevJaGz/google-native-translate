import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OperationMode } from './operation-mode';

describe('OperationMode', () => {
  let component: OperationMode;
  let fixture: ComponentFixture<OperationMode>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OperationMode]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OperationMode);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
