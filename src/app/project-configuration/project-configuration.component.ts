import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { AuthService } from '../common/auth.service';
import { ProjectService } from '../common/project.service';
import { ProjectConfigDialogComponent } from './project-config-dialog/project-config-dialog.component';

@Component({
  selector: 'app-project-configuration',
  templateUrl: './project-configuration.component.html',
  styleUrls: ['./project-configuration.component.scss'],
})
export class ProjectConfigurationComponent implements OnInit {
  constructor(
    private ProjectService: ProjectService,
    private authService: AuthService,
    public dialog: MatDialog
  ) {}
  displayedColumns: string[] = [
    'Name',
    'Beschreibung',
    'Startdatum',
    'Enddatum',
    'Wissenschaftler',
  ];
  dataSource = [
    {
      Name: '',
      Beschreibung: '',
      Startdatum: '',
      Enddatum: '',
      Wissenschaftler: '',
    },
  ];

  ngOnInit() {
    this.loadProject();
  }

  loadProject() {
    this.dataSource.pop();
    this.dataSource.push({
      Name: 'Studie-Typ-2',
      Beschreibung: 'Es wird auf Typ-2 getestet.',
      Startdatum: '08/15/2022',
      Enddatum: '08/20/2022',
      Wissenschaftler: '5',
    });
  }

  editStudyDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.data = {
      dialogTitle: 'Studie bearbeiten',
      studyName: this.dataSource[0].Name,
      studyDescription: this.dataSource[0].Beschreibung,
      studyStartdate: this.dataSource[0].Startdatum,
      studyEnddate: this.dataSource[0].Enddatum,
    };

    this.dialog.open(ProjectConfigDialogComponent, dialogConfig);
  }

  addStudy() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.data = {
      dialogTitle: 'Studie hinzufügen',
    };

    this.dialog.open(ProjectConfigDialogComponent, dialogConfig);

    /*
    var data = {
      name: 'StudieTypB',
      description: 'Es wird auf Typ B getestet.',
      start_date: 1614034800,
      end_date: 1614294000,
    };
    this.ProjectService.create(data);
    */
  }
}
