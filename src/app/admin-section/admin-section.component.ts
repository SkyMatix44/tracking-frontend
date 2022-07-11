import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatTable } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { AuthService } from '../common/auth.service';
import { Role, UserService } from '../common/user.service';
import { AddOrEditUserDialogComponent } from './addOrEditUser-dialog/addOrEditUser-dialog.component';

@Component({
  selector: 'app-admin-section',
  templateUrl: './admin-section.component.html',
  styleUrls: ['./admin-section.component.scss'],
})
export class AdminSectionComponent implements OnInit {
  @ViewChild('tableAllParticipants') tableStudyParticipants!: MatTable<any>;

  constructor(
    private toastr: ToastrService,
    public dialog: MatDialog,
    private userService: UserService,
    private authService: AuthService
  ) {}

  subscr: Subscription | undefined;
  ngOnInit() {
    this.loadStudyParticipants();
  }

  loadStudyParticipants() {
    this.userDataSource.pop();
    this.subscr = this.userService.getAll().subscribe((projects) => {
      projects.forEach((element) => {
        this.userDataSource.push({
          Id: element.id,
          Email: element.email,
          FirstName: element.firstName,
          LastName: element.lastName,
          University: 'element.universityId',
          Address: element.address || '',
          UserRole: this.getUserRole(element.role),
          Status: this.getBlocked(element.blocked),
        });
      });
      this.tableStudyParticipants?.renderRows();
    });
  }

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
  userDataSource = [
    {
      Id: -1,
      Email: '',
      FirstName: '',
      LastName: '',
      University: '',
      Address: '',
      UserRole: '',
      Status: '',
    },
  ];

  deleteUserFromStudy(rowNr: number) {
    this.userDataSource = this.userDataSource.filter(
      (item: any, index: number) => index !== rowNr
    );
    //this.userService.delete
    this.toastr.success('User successfully deleted!');
  }

  blockOrAcceptUserForStudy(rowNr: number, actStatus: string) {
    if (actStatus == 'accepted') {
      this.subscr = this.userService
        .blockUser(this.userDataSource[rowNr].Id)
        .subscribe((result) => {
          console.log(result);
        });
      this.userDataSource[rowNr] = {
        Id: this.userDataSource[rowNr].Id,
        Email: this.userDataSource[rowNr].Email,
        FirstName: this.userDataSource[rowNr].FirstName,
        LastName: this.userDataSource[rowNr].LastName,
        University: this.userDataSource[rowNr].University,
        Address: this.userDataSource[rowNr].Address,
        UserRole: this.userDataSource[rowNr].UserRole,
        Status: 'blocked',
      };
      this.tableStudyParticipants?.renderRows();

      this.toastr.success('User successfully blocked!');
    } else if (actStatus == 'blocked' || actStatus == '') {
      this.subscr = this.userService
        .unblockUser(this.userDataSource[rowNr].Id)
        .subscribe((result) => {
          console.log(result);
        });
      this.userDataSource[rowNr] = {
        Id: this.userDataSource[rowNr].Id,
        Email: this.userDataSource[rowNr].Email,
        FirstName: this.userDataSource[rowNr].FirstName,
        LastName: this.userDataSource[rowNr].LastName,
        University: this.userDataSource[rowNr].University,
        Address: this.userDataSource[rowNr].Address,
        UserRole: this.userDataSource[rowNr].UserRole,
        Status: 'accepted',
      };
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
    userRole: string,
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
            console.log('edit');
            console.log(updateData);
            this.subscr = this.userService
              .updateUserAsAdmin(userId, updateData)
              .subscribe((result) => {
                console.log(result);
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
                console.log(result);
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
      '',
      'accepted'
    );
  }

  ngOnDestroy() {
    this.subscr?.unsubscribe();
  }
}
