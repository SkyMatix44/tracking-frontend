import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../common/auth.service';
import { Role, UserService } from '../common/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  userInputEmail = '';
  userInputPassword = '';
  createUserFirstName = '';
  createUserLastName = '';
  createEmail = '';
  createPassword = '';
  university = '';
  validationCode = '';

  currentCard = 'login';

  constructor(
    private router: Router,
    private toastr: ToastrService,
    private authService: AuthService,
    private userService: UserService
  ) {}

  ngOnInit(): void {}

  login(): void {
    if (this.userInputEmail && this.userInputPassword != '') {
      this.authService
        .login(this.userInputEmail, this.userInputPassword)
        .subscribe({
          next: () => {
            var userRole = this.userService.getCurrentUser()?.role;
            sessionStorage.setItem('role', JSON.stringify(userRole));
            console.log(userRole);
            this.router.navigate(['/dashboard']);
            this.toastr.success('Successful!');
          },
          error: () => {
            // TODO auf verschiedene Fehler reagieren
            this.toastr.error('Please provide valid login data!');
          },
        });
    } else {
      this.toastr.error('Please fill in all fields!');
    }
  }

  register(): void {
    if (
      this.createUserFirstName &&
      this.createUserLastName &&
      this.createEmail &&
      this.createPassword
      // this.university != ''
    ) {
      // TODO nochmal absprechen welche Daten wirklich bei der registierung benötigt werden
      this.authService
        .register({
          email: this.createEmail,
          password: this.createPassword,
          firstName: this.createUserFirstName,
          lastName: this.createUserLastName,
          role: Role.SCIENTIST,
        })
        .subscribe({
          next: () => {
            this.goToCard('validation');
          },
          error: () => {
            this.toastr.error('Error during registration!');
          },
        });
    } else {
      this.toastr.error('Please fill in all fields!');
    }
  }

  validate(): void {
    this.authService
      .validate(this.createEmail, this.validationCode)
      .subscribe(() => {
        this.router.navigate(['/dashboard']);
      });
  }

  goToCard(card: string): void {
    this.currentCard = card;
  }
}
