import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudyTileComponent } from './study-tile.component';

describe('StudyTileComponent', () => {
  let component: StudyTileComponent;
  let fixture: ComponentFixture<StudyTileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StudyTileComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StudyTileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
