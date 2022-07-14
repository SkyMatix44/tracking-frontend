import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-addOrEditUser-dialog',
  templateUrl: './addOrEditUser-dialog.component.html',
  styleUrls: ['./addOrEditUser-dialog.component.scss'],
})
export class AddOrEditUserDialogComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<AddOrEditUserDialogComponent>,
    private toastr: ToastrService
  ) {
    this.dialogTitle = data.dialogTitle;
    this.userEmail = data.email;
    this.userFirstName = data.firstName;
    this.userLastName = data.lastName;
    this.userUniversity = data.university;
    this.userAddress = data.address;
    this.userRole = data.userRole;
    this.selectedUserRole = this.userRole;
    this.status = data.status;
  }

  dialogTitle = '';
  userEmail = '';
  userFirstName = '';
  userLastName = '';
  userUniversity = '';
  userAddress = '';
  userPassword = '';
  userRole = '';
  status = '';
  selectedUserRole = 'Participant';
  allUserRoles = [''];
  ngOnInit() {
    this.getAndSetUserRole();
  }

  getAndSetUserRole() {
    this.allUserRoles = [];

    if (this.userRole == 'Participant') {
      //console.log('A Participant cannot be changed.');
    } else if (this.userRole == 'Scientists' || this.userRole == 'Admin') {
      this.allUserRoles.push('Scientists');
      this.allUserRoles.push('Admin');
    }
  }

  saveAndClose() {
    if (
      !this.isEmptyOrSpaces(this.userEmail) &&
      !this.isEmptyOrSpaces(this.userFirstName) &&
      !this.isEmptyOrSpaces(this.userLastName) &&
      !this.isEmptyOrSpaces(this.userUniversity) &&
      !this.isEmptyOrSpaces(this.userAddress) &&
      !this.isEmptyOrSpaces(this.selectedUserRole)
      //&& !this.isEmptyOrSpaces(this.userPassword)
    ) {
      this.dialogRef.close({
        email: this.userEmail,
        password: this.userPassword,
        firstName: this.userFirstName,
        lastName: this.userLastName,
        status: this.status,
        university: this.userUniversity,
        address: this.userAddress,
        userRole: this.selectedUserRole,
      });
      this.toastr.success('Changes successful!');
    } else {
      this.toastr.error('Not all data is filled in');
    }
  }

  isEmptyOrSpaces(str: any) {
    return str === null || str.match(/^ *$/) !== null;
  }
}
