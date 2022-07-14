import {
  Component,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
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
    var pageSize = this.studyDataSourcePagination.paginator.pageSize; //<----
    //console.log(pageSize);
    var pageSizeUser = this.userDataSourcePagination.paginator.pageSize; //<----
    //console.log(pageSizeUser);
  }

  getActProject() {
    //aktuelles Projekt holen
    this.projectSubscription = this.prjService
      .getCurrentProjectObs()
      .subscribe((observer) => {
        if (observer?.id != undefined) {
          this.actPrjNumber = observer.id;
          ////console.log(this.actPrjNumber);
          this.actStudyName = 'of "' + observer.name + '"';
          this.loadStudyParticipants(observer.id);
          this.loadEnrollmentKey();
        }
      });
  }

  actPrjNumber = 2;
  loadProject() {
    //Projekt laden
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
    //Anzahl der Wissenschaftler
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
    //Studienteilnehmer holen
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
    //Einschreibeschlüssel
    var prj = this.prjService.getCurrentProject();
    this.showEnrollmentKey(prj?.name!, prj?.invite_token!);
  }

  showEnrollmentKey(studyname: string, key: string) {
    //Einschreibeschlüssel anzeigen
    this.enrollmentKey = key;
    this.enrollmentKeyStudyname = studyname;
  }

  currentPageParticipants = 0;
  pageSize = 0;
  pageParticipantsChanged(event: PageEvent) {
    //Tabelle Paginator Auswahl wird geändert
    //für Berechnung der ausgewählten id
    //console.log({ event });
    this.pageSize = event.pageSize;
    this.currentPageParticipants = event.pageIndex;
  }

  editStudyDialog(rowNr: number, studyId: number) {
    //Dialog edit Studie
    var actSite = this.studyDataSourcePagination._pageData(
      this.studyDataSource
    );

    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.data = {
      dialogTitle: 'Edit study',
      studyName: actSite[rowNr].Name,
      studyDescription: actSite[rowNr].Beschreibung,
      studyStartdate: actSite[rowNr].Startdatum,
      studyEnddate: actSite[rowNr].Enddatum,
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
              //console.log(observer);
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
    //Dialog Studie hinzufügen
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

          //console.log();
          this.projectSubscription = this.prjService
            .create(data)
            .subscribe((observer) => {
              //console.log(observer.invite_token);
              this.loadProject();
              this.showEnrollmentKey(observer.name, observer.invite_token);
            });
        }
      });
    this.studyDataSourcePagination.data = this.studyDataSource;
  }

  removeUserFromStudy(rowNr: number, userId: number) {
    //Nutzer von Studie entfernen
    var prj = this.prjService.getCurrentProject();
    this.userDataSource = this.userDataSource.filter(
      (item: any, index: number) => index !== rowNr
    );
    var nr: number[] = [userId];
    //console.log(prj?.id! + ' ' + nr);
    this.prjService
      .removeUsersFromProject(prj?.id!, nr)
      .subscribe((results) => {
        this.toastr.success('User successfully removed!');
      });
    this.userDataSourcePagination.data = this.userDataSource;
  }

  blockOrAcceptUserForStudy(rowNr: number, userId: number, actStatus: string) {
    //Nutzer von Studie blockieren
    var add = this.currentPageParticipants * this.pageSize;

    ////console.log(this.userDataSource[rowNr + add]);
    var actSite = this.userDataSourcePagination._pageData(this.userDataSource);
    if (actStatus == 'accepted') {
      //console.log('User ' + actSite[rowNr].Id + ' blockieren');
      this.projectSubscription = this.userService
        .blockUser(actSite[rowNr].Id)
        .subscribe((result) => {
          //console.log(result);
        });
      this.userDataSource[rowNr + add] = {
        Id: actSite[rowNr].Id,
        Email: actSite[rowNr].Email,
        FirstName: actSite[rowNr].FirstName,
        LastName: actSite[rowNr].LastName,
        Status: 'blocked',
      };
      this.tableStudyParticipants?.renderRows();

      this.toastr.success('User successfully blocked!');
    } else if (actStatus == 'blocked') {
      this.projectSubscription = this.userService
        .unblockUser(actSite[rowNr].Id)
        .subscribe((result) => {
          //console.log(result);
        });
      this.userDataSource[rowNr + add] = {
        Id: actSite[rowNr].Id,
        Email: actSite[rowNr].Email,
        FirstName: actSite[rowNr].FirstName,
        LastName: actSite[rowNr].LastName,
        Status: 'accepted',
      };

      this.toastr.success('User successfully accepted!');
    }
    this.userDataSourcePagination.data = this.userDataSource;
    this.tableStudyParticipants?.renderRows();
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
