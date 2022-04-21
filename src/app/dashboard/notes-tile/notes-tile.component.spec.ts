import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotesTileComponent } from './notes-tile.component';

describe('NotesTileComponent', () => {
  let component: NotesTileComponent;
  let fixture: ComponentFixture<NotesTileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NotesTileComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NotesTileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
