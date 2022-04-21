import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectListreportComponent } from './project-listreport.component';

describe('ProjectListreportComponent', () => {
  let component: ProjectListreportComponent;
  let fixture: ComponentFixture<ProjectListreportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectListreportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectListreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
