import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../common/user.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
})
export class UserProfileComponent implements OnInit {
  constructor(
    private toastr: ToastrService,
    private userService: UserService
  ) {}

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
    var user = this.userService.getCurrentUser();
    console.log(user);
    // TODO Datenbank
    this.userFirstName = user?.firstName || '';
    this.userLastName = user?.lastName || '';
    this.userEmail = user?.email || '';
    this.userUniversity = user?.universityId?.toString() || '';
    this.userAddress = user?.address || '';
  }

  saveChanges() {
    console.log(
      this.userFirstName + ' ' + this.userLastName + ' ' + this.userAddress
    );
    var data = {
      firstName: this.userFirstName,
      lastName: this.userLastName,
      address: this.userAddress,
    };
    this.userService.update(data).subscribe((results) => {
      console.log(results);
    });
    this.toastr.success('Changes saved');
  }
}
