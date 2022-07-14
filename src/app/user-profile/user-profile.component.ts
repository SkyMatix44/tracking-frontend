import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { UniversityService } from '../common/university.service';
import { User, UserService } from '../common/user.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
})
export class UserProfileComponent implements OnInit {
  constructor(
    private toastr: ToastrService,
    private userService: UserService,
    private uniService: UniversityService
  ) {}

  userFirstName = '';
  userLastName = '';
  userEmail = '';
  userPassword = '';
  userOldPassword = '';
  userUniversity = '';
  userAddress = '';
  ngOnInit(): void {
    this.getAllUnis();
    this.getUserAttributes();
  }

  user: User | undefined;
  getUserAttributes() {
    var user = this.userService.getCurrentUser()!;
    this.user = this.userService.getCurrentUser()!;
    ////console.log(this.user);
    this.userFirstName = user?.firstName || '';
    this.userLastName = user?.lastName || '';
    this.userEmail = user?.email || '';
    this.setUserUni(user?.universityId!);
    this.userAddress = user?.address || '';
  }

  setUserUni(uniId: number) {
    this.uniService.get(uniId).subscribe((results) => {
      this.selectedUniValue = results.id - 1;
    });
  }

  selectedUniValue = 0;
  unis = [''];
  uniIds = [0];
  getAllUnis() {
    this.unis = [];
    this.uniIds = [];
    this.uniService.getAll().subscribe((results) => {
      results.forEach((element) => {
        this.unis.push(element.name);
        this.uniIds.push(element.id);
      });
    });
  }

  onChangeUni(event: any) {
    //console.log(event.value);
    //console.log(this.uniIds);
    this.userService
      .update({ universityId: this.uniIds[event.value] })
      .subscribe((results) => {
        this.toastr.success('Your University is saved');
      });
  }

  saveChanges() {
    var university = '';
    this.uniService.get(this.user?.universityId!).subscribe((results) => {
      ////console.log(results.name);
      university = results.name;
    });

    if (
      this.userFirstName != this.user?.firstName ||
      this.userLastName != this.user.lastName ||
      this.userAddress != this.user.address
    ) {
      var data = {
        firstName: this.userFirstName,
        lastName: this.userLastName,
        address: this.userAddress,
      };
      this.userService.update(data).subscribe((results) => {
        this.toastr.success('Changes saved');
      });
    } else if (this.userEmail != this.user.email) {
      this.userService
        .changeEmail({ newEmail: this.userEmail })
        .subscribe((results) => {
          this.toastr.success('Email-Changes saved');
        });
    } else if (this.userPassword != '') {
      this.userService
        .changePassword({
          password: this.userOldPassword,
          newPassword: this.userPassword,
        })
        .subscribe(
          (results) => {
            this.toastr.success('Password-Changes saved');
          },
          (err) => {
            this.toastr.error('Error set new Password');
          }
        );
    } else if (this.userUniversity != university) {
      this.toastr.success('University-Changes saved');
    } else {
      this.toastr.error('No changes detected');
    }
  }

  ngOnDestroy() {
    //console.log('Destroy');
    this.user = undefined;
    this.userFirstName = '';
    this.userLastName = '';
    this.userEmail = '';
    this.userUniversity = '';
    this.userAddress = '';
  }
}
