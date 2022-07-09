import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatTable } from '@angular/material/table';
import dateFormat from 'dateformat';
import { AuthService } from '../common/auth.service';
import { ProjectService } from '../common/project.service';
import { ProjectConfigDialogComponent } from './project-config-dialog/project-config-dialog.component';

@Component({
  selector: 'app-project-configuration',
  templateUrl: './project-configuration.component.html',
  styleUrls: ['./project-configuration.component.scss'],
})
export class ProjectConfigurationComponent implements OnInit {
  @ViewChild(MatTable) table: MatTable<any> | undefined;
  constructor(
    private ProjectService: ProjectService,
    private authService: AuthService,
    public dialog: MatDialog
  ) {}
  displayedStudyColumns: string[] = [
    'Name',
    'Beschreibung',
    'Startdatum',
    'Enddatum',
    'Wissenschaftler',
  ];
  studyDataSource = [
    {
      Name: '',
      Beschreibung: '',
      Startdatum: '',
      Enddatum: '',
      Wissenschaftler: '',
    },
  ];

  displayedUserDataColumns: string[] = ['Email', 'First Name', 'Last Name'];
  userDataSource = [
    {
      Email: '',
      FirstName: '',
      LastName: '',
    },
  ];

  ngOnInit() {
    this.loadProject();
    this.loadStudyParticipants();
  }

  loadProject() {
    this.studyDataSource.pop();
    this.studyDataSource.push({
      Name: 'Studie-Typ-2',
      Beschreibung: 'Es wird auf Typ-2 getestet.',
      Startdatum: '08/15/2022',
      Enddatum: '08/20/2022',
      Wissenschaftler: '5',
    });
  }

  loadStudyParticipants() {
    this.userDataSource.pop();
    for (let i = 0; i < 4; i++) {
      this.userDataSource.push({
        Email: 'test@test.com',
        FirstName: 'Mark',
        LastName: 'Becker',
      });
    }
  }

  editStudyDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.data = {
      dialogTitle: 'Edit study',
      studyName: this.studyDataSource[0].Name,
      studyDescription: this.studyDataSource[0].Beschreibung,
      studyStartdate: this.studyDataSource[0].Startdatum,
      studyEnddate: this.studyDataSource[0].Enddatum,
    };
    var data = {
      Name: this.studyDataSource[0].Name,
      Beschreibung: this.studyDataSource[0].Beschreibung,
      Startdatum: this.studyDataSource[0].Startdatum,
      Enddatum: this.studyDataSource[0].Enddatum,
      Wissenschaftler: '5',
    };

    this.deleteRow(0);

    this.dialog
      .open(ProjectConfigDialogComponent, dialogConfig)
      .afterClosed()
      .subscribe((returnValue) => {
        if (
          returnValue.name != undefined &&
          returnValue.description != undefined
        ) {
          var name = returnValue.name;
          var description = returnValue.description;
          var startDate = dateFormat(returnValue.startDate, 'mm/d/yyyy');
          var endDate = dateFormat(returnValue.endDate, 'mm/d/yyyy');
          var scientists = returnValue.scientists;
          this.studyDataSource.push({
            Name: name,
            Beschreibung: description,
            Startdatum: startDate,
            Enddatum: endDate,
            Wissenschaftler: scientists,
          });
          this.table?.renderRows();
        }
      });
  }

  deleteRow(rowid: number) {
    this.studyDataSource = this.studyDataSource.filter(
      (item, index) => index !== rowid
    );
  }

  addStudy() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.data = {
      dialogTitle: 'Add study',
    };

    this.dialog
      .open(ProjectConfigDialogComponent, dialogConfig)
      .afterClosed()
      .subscribe((returnValue) => {
        if (
          returnValue.name != undefined &&
          returnValue.description != undefined
        ) {
          var name = returnValue.name;
          var description = returnValue.description;
          var startDate = dateFormat(returnValue.startDate, 'm/d/yyyy');
          var endDate = dateFormat(returnValue.endDate, 'm/d/yyyy');
          var scientists = returnValue.scientists;

          this.studyDataSource.push({
            Name: name,
            Beschreibung: description,
            Startdatum: startDate,
            Enddatum: endDate,
            Wissenschaftler: scientists,
          });
          this.table?.renderRows();
        }
      });

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

  enrollmentKey = '';
  generateEnrollmentKey() {
    let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789';
    const lengthOfCode = 6;
    this.enrollmentKey = makeRandomKey(lengthOfCode, possible);
  }
}

function makeRandomKey(lengthOfCode: number, possible: string) {
  let text = '';
  for (let i = 0; i < lengthOfCode; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}
