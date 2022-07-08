import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
})
export class UserProfileComponent implements OnInit {
  constructor(private toastr: ToastrService) {}

  userFirstName = '';
  userLastName = '';
  userEmail = '';
  userPassword = '';
  userOldPassword = '';
  userUniversity = '';
  userAddress = '';
  ngOnInit(): void {
    this.getUserAttributes();
  }

  getUserAttributes() {
    // TODO Datenbank
    this.userFirstName = 'Manuel';
    this.userLastName = 'Neuer';
    this.userEmail = 'manuel@gmail.com';
    this.userUniversity = 'Siegen';
    this.userAddress = 'Gartenstraße 1, Siegen';
  }

  saveChanges() {
    this.toastr.success('TODO saved');
  }
}
