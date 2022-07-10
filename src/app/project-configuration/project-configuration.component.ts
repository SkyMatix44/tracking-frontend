import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
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
  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;
  constructor(
    private prjService: ProjectService,
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

  enrollmentKey = 'XYZ';

  ngOnInit() {
    this.loadProject();
    this.loadStudyParticipants();
  }

  loadProject() {
    this.studyDataSource.pop();
    this.prjService.getAllProjects().subscribe((projects) => {
      projects.forEach((element) => {
        console.log(element);
        this.studyDataSource.push({
          Name: element.name,
          Beschreibung: element.description,
          Startdatum: new Date(element.start_date).toUTCString(),
          Enddatum: new Date(element.end_date).toUTCString(),
          Wissenschaftler: '5',
        });
      });
      this.table?.renderRows();
    });
  }

  loadStudyParticipants() {
    this.userDataSource.pop();
    this.prjService.getProjectUsers(2, 'participants').subscribe((projects) => {
      projects.forEach((element) => {
        console.log(element);
        this.userDataSource.push({
          Email: element.email,
          FirstName: element.firstName,
          LastName: element.lastName,
          Status: 'accepted',
        });
      });
      this.tableStudyParticipants?.renderRows();
    });

    /*
    this.userDataSource.push({
      Email: 'test@1.com',
      FirstName: 'Mark',
      LastName: 'Becker',
      Status: 'accepted',
    });
    */
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
          var startDate = dateFormat(returnValue.startDate, 'mm/d/yyyy');
          var endDate = dateFormat(returnValue.endDate, 'mm/d/yyyy');
          var startDateNr = new Date(returnValue.startDate);
          var endDateNr = new Date(returnValue.endDate);
          var scientists = returnValue.scientists;

          var data = {
            name: name, //'StudieTypB'
            description: description, //'Es wird auf Typ B getestet.'
            start_date: startDateNr.getTime(), //1614034800
            end_date: endDateNr.getTime(), //1614294000
          };
          this.prjService.create(data).subscribe((observer) => {
            console.log(observer);
          });

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

  removeUserFromStudy(rowNr: number) {
    this.userDataSource = this.userDataSource.filter(
      (item: any, index: number) => index !== rowNr
    );
    this.toastr.success('User successfully removed!');
  }

  blockOrAcceptUserForStudy(rowNr: number, actStatus: string) {
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
