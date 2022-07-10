import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatTable } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { AddOrEditUserDialogComponent } from './addOrEditUser-dialog/addOrEditUser-dialog.component';

@Component({
  selector: 'app-admin-section',
  templateUrl: './admin-section.component.html',
  styleUrls: ['./admin-section.component.scss'],
})
export class AdminSectionComponent implements OnInit {
  @ViewChild('tableAllParticipants') tableStudyParticipants!: MatTable<any>;

  constructor(private toastr: ToastrService, public dialog: MatDialog) {}

  ngOnInit() {
    this.loadStudyParticipants();
  }

  loadStudyParticipants() {
    this.userDataSource.pop();
    this.userDataSource.push({
      Email: 'test@1.com',
      FirstName: 'Mark1',
      LastName: 'Becker1',
      University: 'Uni Siegen1',
      Address: 'Gartenstraße1',
      UserRole: 'Participant',
      Status: 'accepted',
    });
    this.userDataSource.push({
      Email: 'test@2.com',
      FirstName: 'Andre2',
      LastName: 'Muster2',
      University: 'Uni Siegen2',
      Address: 'Hauptstraße2',
      UserRole: 'Admin',
      Status: 'accepted',
    });
    this.userDataSource.push({
      Email: 'test@3.com',
      FirstName: 'Karl3',
      LastName: 'Müller3',
      University: 'Uni Siegen3',
      Address: 'Gartenstraße3',
      UserRole: 'Participant',
      Status: 'accepted',
    });
  }

  displayedUserDataColumns: string[] = [
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
    this.toastr.success('User successfully deleted!');
  }

  blockOrAcceptUserForStudy(rowNr: number, actStatus: string) {
    if (actStatus == 'accepted') {
      this.userDataSource[rowNr] = {
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
      this.userDataSource[rowNr] = {
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
    rowId: number,
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
      dialogTitle: 'Edit User',
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
          if (rowId != -1) {
            this.userDataSource = this.userDataSource.filter(
              (item, index) => index !== rowId
            );
          }
          this.userDataSource.push({
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

  createNewUser() {
    this.openAddEditUserDialog(-1, '', '', '', '', '', '', 'accepted');
  }
}
