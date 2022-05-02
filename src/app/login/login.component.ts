import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  constructor(private router: Router, private toastr: ToastrService) {}

  ngOnInit(): void {}

  userInputEmail = "";
  userInputPassword = "";
  createUserFirstName = "";
  createUserLastName = "";
  createEmail = "";
  createPassword = "";
  university = "";
  async login() {
    if (this.userInputEmail && this.userInputPassword != "") {
      this.toastr.success('Erfolgreich angemeldet');
      this.router.navigate(['/dashboard']);
    }
    else {
      this.toastr.error('Bitte alle Felder ausfüllen!');
    }
  }
  
  register()
  {
    if (this.createUserFirstName && this.createUserLastName && this.createEmail && this.createPassword && this.university != "") {
      this.toastr.success('Erfolgreich registriert');
    }
    else {
      this.toastr.error('Bitte alle Felder ausfüllen!');
    }
  }
  
  showLogin = true;
  showRegister = false;
  goToRegister()
  {
    this.showLogin = false;
    this.showRegister = true;
  }
  goToLogin()
  {
    this.showLogin = true;
    this.showRegister = false;
  }
}
