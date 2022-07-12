import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTable } from '@angular/material/table';
import dateFormat from 'dateformat';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { AuthService } from '../common/auth.service';
import { ProjectService } from '../common/project.service';
import { UserService } from '../common/user.service';
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
    private toastr: ToastrService,
    private userService: UserService
  ) {}
  displayedStudyColumns: string[] = [
    'Name',
    'Beschreibung',
    'Startdatum',
    'Enddatum',
    'Wissenschaftler',
    'Action',
  ];
  studyDataSource: studyDataSource[] = [];

  displayedUserDataColumns: string[] = [
    'Email',
    'First Name',
    'Last Name',
    'Status',
    'Action',
  ];
  userDataSource = [
    {
      Id: -1,
      Email: '',
      FirstName: '',
      LastName: '',
      Status: '',
    },
  ];

  enrollmentKeyStudyname = '';
  enrollmentKey = '';
  projectSubscription: Subscription | undefined;

  ngOnInit() {
    this.prjService.setCurrentProjectId(20); //TODO Set initial Projekt
    this.actPrjNumber = 20;
    this.getActProject();
    this.loadProject();
    //this.loadStudyParticipants();
  }

  getActProject() {
    //this.prjService.setCurrentProjectId(20);
    this.projectSubscription = this.prjService
      .getCurrentProjectObs()
      .subscribe((observer) => {
        if (observer?.id != undefined) {
          console.log('load neue News');
          this.actPrjNumber = observer.id;
          console.log(this.actPrjNumber);
          this.loadStudyParticipants(observer.id);
          this.loadEnrollmentKey();
        } else {
          //console.log('fix initial undefined');
        }
      });
  }

  actPrjNumber = 2;
  loadProject() {
    this.studyDataSource = [];

    this.projectSubscription = this.prjService
      .getAllProjects()
      .subscribe((projects) => {
        projects.forEach((element) => {
          this.studyDataSource.push({
            Id: element.id,
            Name: element.name,
            Beschreibung: element.description,
            Startdatum: new Date(Number(element.start_date)),
            Enddatum: new Date(Number(element.end_date)),
            Wissenschaftler: 0,
          });
          this.getNrOfScientists(element.id);
        });
        this.table?.renderRows();
      });
  }

  getNrOfScientists(prjId: number): number {
    var nrOfScientists = 0;
    this.prjService
      .getProjectUsers(prjId, 'scientists')
      .subscribe((results) => {
        nrOfScientists = results.length;
        for (let project of this.studyDataSource) {
          if (project.Id === prjId) {
            project.Wissenschaftler = results.length;
            break;
          }
        }
      });
    return nrOfScientists;
  }

  loadStudyParticipants(actPrjNumber: number) {
    this.userDataSource = [];
    this.projectSubscription = this.prjService
      .getProjectUsers(actPrjNumber, 'participants')
      .subscribe((projects) => {
        projects.forEach((element) => {
          this.userDataSource.push({
            Id: element.id,
            Email: element.email,
            FirstName: element.firstName,
            LastName: element.lastName,
            Status: this.getBlocked(element.blocked),
          });
        });
        this.tableStudyParticipants?.renderRows();
      });
  }

  loadEnrollmentKey() {
    var prj = this.prjService.getCurrentProject();
    console.log('----------------');
    console.log(prj);
    this.showEnrollmentKey(prj?.name!, prj?.invite_token!);
  }

  showEnrollmentKey(studyname: string, key: string) {
    console.log(studyname + ' ' + key);
    this.enrollmentKey = key;
    this.enrollmentKeyStudyname = studyname;
  }

  editStudyDialog(rowNr: number, studyId: number) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.data = {
      dialogTitle: 'Edit study',
      studyName: this.studyDataSource[rowNr].Name,
      studyDescription: this.studyDataSource[rowNr].Beschreibung,
      studyStartdate: this.studyDataSource[rowNr].Startdatum,
      studyEnddate: this.studyDataSource[rowNr].Enddatum,
    };

    this.dialog
      .open(ProjectConfigDialogComponent, dialogConfig)
      .afterClosed()
      .subscribe((returnValue) => {
        if (
          returnValue.name != undefined &&
          returnValue.description != undefined
        ) {
          var data = {
            name: returnValue.name,
            description: returnValue.description,
            start_date: returnValue.startDate.getTime(),
            end_date: returnValue.endDate.getTime(),
          };

          this.projectSubscription = this.prjService
            .update(studyId, data)
            .subscribe((observer) => {
              console.log(observer);
            });

          this.studyDataSource = this.studyDataSource.filter(
            (item, index) => index !== rowNr
          );

          this.studyDataSource.push({
            Id: studyId,
            Name: returnValue.name,
            Beschreibung: returnValue.description,
            Startdatum: returnValue.startDate.getTime(),
            Enddatum: returnValue.endDate.getTime(),
            Wissenschaftler: returnValue.scientists,
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
          var startDate = new Date(
            dateFormat(returnValue.startDate, 'mm/d/yyyy')
          );
          var endDate = new Date(dateFormat(returnValue.endDate, 'mm/d/yyyy'));
          var startDateNr = new Date(returnValue.startDate);
          var endDateNr = new Date(returnValue.endDate);

          var data = {
            name: returnValue.name, //'StudieTypB'
            description: returnValue.description, //'Es wird auf Typ B getestet.'
            start_date: startDateNr.getTime(), //1614034800
            end_date: endDateNr.getTime(), //1614294000
          };

          console.log();
          this.projectSubscription = this.prjService
            .create(data)
            .subscribe((observer) => {
              console.log(observer.invite_token);
              this.loadProject();
              this.showEnrollmentKey(observer.name, observer.invite_token);
            });
        }
      });
  }

  removeUserFromStudy(rowNr: number) {
    this.userDataSource = this.userDataSource.filter(
      (item: any, index: number) => index !== rowNr
    );
    this.toastr.success('User successfully removed!');
  }

  blockOrAcceptUserForStudy(rowNr: number, userId: number, actStatus: string) {
    if (actStatus == 'accepted') {
      this.projectSubscription = this.userService
        .blockUser(this.userDataSource[rowNr].Id)
        .subscribe((result) => {
          console.log(result);
        });
      this.userDataSource[rowNr] = {
        Id: this.userDataSource[rowNr].Id,
        Email: this.userDataSource[rowNr].Email,
        FirstName: this.userDataSource[rowNr].FirstName,
        LastName: this.userDataSource[rowNr].LastName,
        Status: 'blocked',
      };
      this.tableStudyParticipants?.renderRows();

      this.toastr.success('User successfully blocked!');
    } else if (actStatus == 'blocked') {
      this.projectSubscription = this.userService
        .unblockUser(this.userDataSource[rowNr].Id)
        .subscribe((result) => {
          console.log(result);
        });
      this.userDataSource[rowNr] = {
        Id: this.userDataSource[rowNr].Id,
        Email: this.userDataSource[rowNr].Email,
        FirstName: this.userDataSource[rowNr].FirstName,
        LastName: this.userDataSource[rowNr].LastName,
        Status: 'accepted',
      };
      this.tableStudyParticipants?.renderRows();

      this.toastr.success('User successfully accepted!');
    }
  }

  getBlocked(userBlocked: any) {
    if (userBlocked == true) {
      userBlocked = 'blocked';
    } else if (userBlocked == false) {
      userBlocked = 'accepted';
    } else if (userBlocked == 'blocked') {
      userBlocked = true;
    } else if (userBlocked == 'accepted') {
      userBlocked = false;
    }
    return userBlocked;
  }

  ngOnDestroy() {
    this.studyDataSource = [];
    this.userDataSource = [];
    this.tableStudyParticipants.ngOnDestroy;
    this.projectSubscription?.unsubscribe();
  }
}

export interface studyDataSource {
  Id: number;
  Name: string;
  Beschreibung: string;
  Startdatum: Date;
  Enddatum: Date;
  Wissenschaftler: number;
}
