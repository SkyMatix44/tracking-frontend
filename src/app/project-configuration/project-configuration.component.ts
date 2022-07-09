import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatTable } from '@angular/material/table';
import dateFormat from 'dateformat';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../common/auth.service';
import { ProjectService } from '../common/project.service';
import { ProjectConfigDialogComponent } from './project-config-dialog/project-config-dialog.component';

@Component({
  selector: 'app-project-configuration',
  templateUrl: './project-configuration.component.html',
  styleUrls: ['./project-configuration.component.scss'],
})
export class ProjectConfigurationComponent implements OnInit {
  @ViewChild('table') table!: MatTable<any>;
  @ViewChild('tableStudyParticipants') tableStudyParticipants!: MatTable<any>;
  constructor(
    private ProjectService: ProjectService,
    private authService: AuthService,
    public dialog: MatDialog,
    private toastr: ToastrService
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

  displayedUserDataColumns: string[] = [
    'Email',
    'First Name',
    'Last Name',
    'Status',
    'Action',
  ];
  userDataSource = [
    {
      Email: '',
      FirstName: '',
      LastName: '',
      Status: '',
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
    this.userDataSource.push({
      Email: 'test@1.com',
      FirstName: 'Mark',
      LastName: 'Becker',
      Status: 'accepted',
    });
    this.userDataSource.push({
      Email: 'test@2.com',
      FirstName: 'Mark',
      LastName: 'Becker',
      Status: 'accepted',
    });
    this.userDataSource.push({
      Email: 'test@3.com',
      FirstName: 'Mark',
      LastName: 'Becker',
      Status: 'accepted',
    });
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

    this.dialog
      .open(ProjectConfigDialogComponent, dialogConfig)
      .afterClosed()
      .subscribe((returnValue) => {
        if (
          returnValue.name != undefined &&
          returnValue.description != undefined
        ) {
          this.studyDataSource = this.studyDataSource.filter(
            (item: any, index: number) => index !== 0
          );
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

  removeUserFromStudy(rowNr: number) {
    this.userDataSource = this.userDataSource.filter(
      (item: any, index: number) => index !== rowNr
    );
    this.toastr.success('User successfully removed!');
  }

  blockOrAcceptUserForStudy(rowNr: number, actStatus: string) {
    console.log(rowNr);
    if (actStatus == 'accepted') {
      this.userDataSource[rowNr] = {
        Email: this.userDataSource[rowNr].Email,
        FirstName: this.userDataSource[rowNr].FirstName,
        LastName: this.userDataSource[rowNr].LastName,
        Status: 'blocked',
      };
      this.tableStudyParticipants?.renderRows();

      this.toastr.success('User successfully blocked!');
    } else if (actStatus == 'blocked') {
      this.userDataSource[rowNr] = {
        Email: this.userDataSource[rowNr].Email,
        FirstName: this.userDataSource[rowNr].FirstName,
        LastName: this.userDataSource[rowNr].LastName,
        Status: 'accepted',
      };
      this.tableStudyParticipants?.renderRows();

      this.toastr.success('User successfully accepted!');
    }
  }
}

function makeRandomKey(lengthOfCode: number, possible: string) {
  let text = '';
  for (let i = 0; i < lengthOfCode; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}
