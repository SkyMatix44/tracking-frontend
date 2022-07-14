import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { AuthService } from '../common/auth.service';
import { UniversityService } from '../common/university.service';
import { Role, UserService } from '../common/user.service';
import { AddOrEditUserDialogComponent } from './addOrEditUser-dialog/addOrEditUser-dialog.component';

@Component({
  selector: 'app-admin-section',
  templateUrl: './admin-section.component.html',
  styleUrls: ['./admin-section.component.scss'],
})
export class AdminSectionComponent implements OnInit {
  @ViewChild('tableAllParticipants') tableStudyParticipants!: MatTable<any>;
  @ViewChild('tableAllUniversitys') tableAllUniversitys!: MatTable<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;

  constructor(
    private toastr: ToastrService,
    public dialog: MatDialog,
    private userService: UserService,
    private authService: AuthService,
    private uniService: UniversityService
  ) {}

  displayedUserDataColumns: string[] = [
    'Id',
    'Email',
    'First Name',
    'Last Name',
    'University',
    'Address',
    'User role',
    'Status',
    'Action',
  ];

  displayedUniColumns: string[] = ['Id', 'University', 'Address'];

  userDataSource: userDataSource[] = [];
  uniDataSource: uniDataSource[] = [];

  userDataSourcePagination = new MatTableDataSource<userDataSource>(
    this.userDataSource
  );

  subscr: Subscription | undefined;
  ngOnInit() {
    this.loadStudyParticipants();
    this.getAllUnis();
  }

  getAllUnis() {
    this.uniDataSource = [];
    //console.log('getAllUnis');
    this.uniService.getAll().subscribe((results) => {
      results.forEach((element) => {
        //console.log(element);
        this.uniDataSource.push({
          Id: element.id,
          University: element.name,
          Address: element.address,
        });
      });
      this.tableAllUniversitys?.renderRows();
    });
  }

  inputUniversity = '';
  inputUniversityAddress = '';
  createUniversity() {
    if (this.inputUniversity != '' && this.inputUniversityAddress != '') {
      this.uniService
        .create({
          name: this.inputUniversity,
          address: this.inputUniversityAddress,
        })
        .subscribe((results) => {
          this.toastr.success('University was created');
          this.uniDataSource.push({
            Id: results.id,
            University: results.name,
            Address: results.address,
          });
          this.tableAllUniversitys?.renderRows();
        });
      this.inputUniversity = '';
      this.inputUniversityAddress = '';
    } else {
      this.toastr.error('Fill in all fields!');
    }
  }

  ngAfterViewInit() {
    this.userDataSourcePagination.paginator = this.paginator!;
  }

  loadStudyParticipants() {
    this.userDataSource.pop();
    this.subscr = this.userService.getAll().subscribe((projects) => {
      projects.forEach((element) => {
        this.setUserUniIntoTable(element, element.universityId!);
      });
    });
  }

  setUserUniIntoTable(element: any, uniId: number) {
    var uniName = '';
    if (uniId != null) {
      this.uniService.get(uniId).subscribe((results) => {
        uniName = results.name;
        this.userDataSource.push({
          Id: element.id,
          Email: element.email,
          FirstName: element.firstName,
          LastName: element.lastName,
          University: uniName,
          Address: element.address || '',
          UserRole: this.getUserRole(element.role),
          Status: this.getBlocked(element.blocked),
        });
        this.tableStudyParticipants?.renderRows();
        this.userDataSourcePagination.data = this.userDataSource;
      });
    } else {
      this.userDataSource.push({
        Id: element.id,
        Email: element.email,
        FirstName: element.firstName,
        LastName: element.lastName,
        University: '/',
        Address: element.address || '/',
        UserRole: this.getUserRole(element.role),
        Status: this.getBlocked(element.blocked),
      });
      this.tableStudyParticipants?.renderRows();
      this.userDataSourcePagination.data = this.userDataSource;
    }
  }

  deleteUserFromStudy(rowNr: number) {
    this.userDataSource = this.userDataSource.filter(
      (item: any, index: number) => index !== rowNr
    );
    //this.userService.delete
    this.toastr.success('User successfully deleted!');
    this.userDataSourcePagination.data = this.userDataSource;
    this.tableStudyParticipants?.renderRows();
  }

  currentPageUsers = 0;
  pageSize = 0;
  pageUsersChanged(event: PageEvent) {
    //console.log({ event });
    this.pageSize = event.pageSize;
    this.currentPageUsers = event.pageIndex;
  }

  blockOrAcceptUserForStudy(rowNr: number, actStatus: string) {
    var add = this.currentPageUsers * this.pageSize;
    //console.log(add);
    var actSite = this.userDataSourcePagination._pageData(this.userDataSource);

    if (actStatus == 'accepted') {
      this.subscr = this.userService
        .blockUser(actSite[rowNr].Id)
        .subscribe((result) => {
          //console.log(result);
        });
      this.userDataSource[rowNr + add] = {
        Id: actSite[rowNr].Id,
        Email: actSite[rowNr].Email,
        FirstName: actSite[rowNr].FirstName,
        LastName: actSite[rowNr].LastName,
        University: actSite[rowNr].University,
        Address: actSite[rowNr].Address,
        UserRole: actSite[rowNr].UserRole,
        Status: 'blocked',
      };
      this.tableStudyParticipants?.renderRows();
      this.userDataSourcePagination.data = this.userDataSource;

      this.toastr.success('User successfully blocked!');
    } else if (actStatus == 'blocked' || actStatus == '') {
      this.subscr = this.userService
        .unblockUser(actSite[rowNr].Id)
        .subscribe((result) => {
          //console.log(result);
        });
      this.userDataSource[rowNr + add] = {
        Id: actSite[rowNr].Id,
        Email: actSite[rowNr].Email,
        FirstName: actSite[rowNr].FirstName,
        LastName: actSite[rowNr].LastName,
        University: actSite[rowNr].University,
        Address: actSite[rowNr].Address,
        UserRole: actSite[rowNr].UserRole,
        Status: 'accepted',
      };
      this.userDataSourcePagination.data = this.userDataSource;
      this.tableStudyParticipants?.renderRows();
      this.toastr.success('User successfully accepted!');
    }
  }

  openAddEditUserDialog(
    editOrAdd: string,
    rowId: number,
    userId: number,
    email: string,
    firstName: string,
    lastName: string,
    university: string,
    address: string,
    userRole: Role,
    status: string
  ) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '600px';
    dialogConfig.disableClose = true;
    dialogConfig.data = {
      dialogTitle: editOrAdd,
      email: email,
      firstName: firstName,
      lastName: lastName,
      university: university,
      address: address,
      userRole: userRole,
      status: status,
    };

    this.dialog
      .open(AddOrEditUserDialogComponent, dialogConfig)
      .afterClosed()
      .subscribe((results) => {
        if (results != '') {
          if (editOrAdd == 'Edit User') {
            if (rowId != -1) {
              this.userDataSource = this.userDataSource.filter(
                (item, index) => index !== rowId
              );
            }
            var updateData = {
              email: results.email,
              firstName: results.firstName,
              lastName: results.lastName,
              address: results.address,
              validated: results.validated,
              role: this.getUserRole(results.userRole),
            };
            //console.log('edit');
            //console.log(updateData);
            this.subscr = this.userService
              .updateUserAsAdmin(userId, updateData)
              .subscribe((result) => {
                //console.log(result);
              });
          } else if (editOrAdd == 'Add User') {
            var userData = {
              email: results.email,
              password: results.password,
              firstName: results.firstName,
              lastName: results.lastName,
              address: results.address,
              validated: true,
              role: this.getUserRole(results.userRole),
            };
            // console.log('add');
            // console.log(userData);
            this.subscr = this.userService
              .create(userData)
              .subscribe((result) => {
                //console.log(result);
              });
          }

          this.userDataSource.push({
            Id: results.userId,
            Email: results.email,
            FirstName: results.firstName,
            LastName: results.lastName,
            University: results.university,
            Address: results.address,
            UserRole: results.userRole,
            Status: results.status,
          });
          this.userDataSourcePagination.data = this.userDataSource;
          this.tableStudyParticipants?.renderRows();
        }
      });
  }

  getUserRole(userRole: any) {
    if (userRole == 'Participant') {
      userRole = Role.USER;
    } else if (userRole == 'Scientists') {
      userRole = Role.SCIENTIST;
    } else if (userRole == 'Admin') {
      userRole = Role.ADMIN;
    } else if (userRole == 'USER') {
      userRole = 'Participant';
    } else if (userRole == 'SCIENTIST') {
      userRole = 'Scientists';
    } else if (userRole == 'ADMIN') {
      userRole = 'Admin';
    }
    return userRole;
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

  createNewUser() {
    this.openAddEditUserDialog(
      'Add User',
      -1,
      -1,
      '',
      '',
      '',
      '',
      '',
      Role.Role,
      'accepted'
    );
  }

  ngOnDestroy() {
    this.subscr?.unsubscribe();
  }
}

export interface userDataSource {
  Id: number;
  Email: string;
  FirstName: string;
  LastName: string;
  University: string;
  Address: string;
  UserRole: Role;
  Status: string;
}

export interface uniDataSource {
  Id: number;
  University: string;
  Address: string;
}
