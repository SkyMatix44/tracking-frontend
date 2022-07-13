import {
  Component,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTable, MatTableDataSource } from '@angular/material/table';
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
  @ViewChildren(MatPaginator) paginator = new QueryList<MatPaginator>();
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

  displayedUserDataColumns: string[] = [
    'Email',
    'First Name',
    'Last Name',
    'Status',
    'Action',
  ];

  studyDataSource: studyDataSource[] = [];
  userDataSource: userDataSource[] = [];

  studyDataSourcePagination = new MatTableDataSource<studyDataSource>(
    this.studyDataSource
  );
  userDataSourcePagination = new MatTableDataSource<userDataSource>(
    this.userDataSource
  );
  enrollmentKeyStudyname = '';
  enrollmentKey = '';
  projectSubscription: Subscription | undefined;
  actStudyName = '';

  ngOnInit() {
    this.userDataSource = [];
    this.getActProject();
    this.loadProject();
    //this.loadStudyParticipants();
  }

  ngAfterViewInit() {
    this.studyDataSourcePagination.paginator = this.paginator.toArray()[0];
    this.userDataSourcePagination.paginator = this.paginator.toArray()[1];
    var pageIndex = this.studyDataSourcePagination.paginator.pageIndex;
    var pageSize = this.studyDataSourcePagination.paginator.pageSize;
    console.log(pageIndex + pageSize);
    var pageIndexUser = this.userDataSourcePagination.paginator.pageIndex;
    var pageSizeUser = this.userDataSourcePagination.paginator.pageSize;
    console.log(pageIndexUser + pageSizeUser);
  }

  getActProject() {
    this.projectSubscription = this.prjService
      .getCurrentProjectObs()
      .subscribe((observer) => {
        if (observer?.id != undefined) {
          this.actPrjNumber = observer.id;
          //console.log(this.actPrjNumber);
          this.actStudyName = 'of "' + observer.name + '"';
          this.loadStudyParticipants(observer.id);
          this.loadEnrollmentKey();
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
        this.studyDataSourcePagination.data = this.studyDataSource;
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
        this.userDataSourcePagination.data = this.userDataSource;
      });
  }

  loadEnrollmentKey() {
    var prj = this.prjService.getCurrentProject();
    this.showEnrollmentKey(prj?.name!, prj?.invite_token!);
  }

  showEnrollmentKey(studyname: string, key: string) {
    this.enrollmentKey = key;
    this.enrollmentKeyStudyname = studyname;
  }

  /*
  onContentChange(event: any) {
    this.getCurrentIndex()
  }

  startingIndexOfPage: number | undefined;
  endingIndexOfPage: number | undefined;
  getCurrentIndex() {
    this.startingIndexOfPage = this.paginator.[0]pageIndex * this.paginator.pageSize;
    this.endingIndexOfPage = (this.paginator.pageIndex * this.paginator.pageSize) + this.paginator.pageSize;
  }
  */

  editStudyDialog(rowNr: number, studyId: number) {
    //const realIndex = index + this.currentPage * this.itemsPerPage;
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.data = {
      dialogTitle: 'Edit study',
      studyName: this.studyDataSourcePagination.data[rowNr].Name,
      studyDescription: this.studyDataSourcePagination.data[rowNr].Beschreibung,
      studyStartdate: this.studyDataSourcePagination.data[rowNr].Startdatum,
      studyEnddate: this.studyDataSourcePagination.data[rowNr].Enddatum,
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
    this.studyDataSourcePagination.data = this.studyDataSource;
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
    this.studyDataSourcePagination.data = this.studyDataSource;
  }

  removeUserFromStudy(rowNr: number, userId: number) {
    var prj = this.prjService.getCurrentProject();
    this.userDataSource = this.userDataSource.filter(
      (item: any, index: number) => index !== rowNr
    );
    var nr: number[] = [userId];
    console.log(prj?.id! + ' ' + nr);
    this.prjService
      .removeUsersFromProject(prj?.id!, nr)
      .subscribe((results) => {
        this.toastr.success('User successfully removed!');
      });
    this.userDataSourcePagination.data = this.userDataSource;
  }

  blockOrAcceptUserForStudy(rowNr: number, userId: number, actStatus: string) {
    if (actStatus == 'accepted') {
      console.log('User ' + this.userDataSource[rowNr].Id + ' blockieren');
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
    this.userDataSourcePagination.data = this.userDataSource;
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

export interface userDataSource {
  Id: number;
  Email: string;
  FirstName: string;
  LastName: string;
  Status: string;
}
