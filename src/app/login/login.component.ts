import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../common/auth.service';
import { Gender } from '../common/user.service';

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

  showLogin = true;
  showRegister = false;

  constructor(
    private router: Router,
    private toastr: ToastrService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {}

  login(): void {
    if (this.userInputEmail && this.userInputPassword != '') {
      this.authService
        .login(this.userInputEmail, this.userInputPassword)
        .subscribe({
          next: () => {
            this.router.navigate(['/dashboard']);
          },
          error: () => {
            // TODO auf verschiedene Fehler reagieren
            this.toastr.error('Bitte geben Sie gültige Anmeldedaten an!');
          },
        });
    } else {
      this.toastr.error('Bitte alle Felder ausfüllen!'); // TODO besser Button sperren
    }
  }

  register(): void {
    if (
      this.createUserFirstName &&
      this.createUserLastName &&
      this.createEmail &&
      this.createPassword &&
      this.university != ''
    ) {
      // TODO nochmal absprechen welche Daten wirklich bei der registierung benötigt werden
      this.authService
        .register({
          email: this.createEmail,
          password: this.createPassword,
          firstName: this.createUserFirstName,
          lastName: this.createUserLastName,
          address: 'Teststraße',
          birthday: 0,
          gender: Gender.MALE,
          height: 0,
          weight: 0,
        })
        .subscribe({
          next: () => {
            this.router.navigate(['/dashboard']); // TODO zur validation navigieren
          },
          error: () => {
            this.toastr.error('Fehler bei der Registierung!');
          },
        });
    } else {
      this.toastr.error('Bitte alle Felder ausfüllen!'); // TODO besser Button sperren
    }
  }

  goToRegister() {
    this.showLogin = false;
    this.showRegister = true;
  }

  goToLogin() {
    this.showLogin = true;
    this.showRegister = false;
  }
}
