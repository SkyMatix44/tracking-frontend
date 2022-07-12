import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestingTokensComponent } from './testing-tokens.component';

describe('TestingTokensComponent', () => {
  let component: TestingTokensComponent;
  let fixture: ComponentFixture<TestingTokensComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TestingTokensComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestingTokensComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
