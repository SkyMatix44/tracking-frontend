import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../common/auth.service';
import { UniversityService } from '../common/university.service';
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
    private userService: UserService,
    private uniService: UniversityService
  ) {}

  ngOnInit(): void {}

  ngAfterViewInit() {
    this.getAllUnis();
  }

  login(): void {
    //Login eines Nutzers
    if (this.userInputEmail && this.userInputPassword != '') {
      this.authService
        .login(this.userInputEmail, this.userInputPassword)
        .subscribe({
          next: () => {
            var userRole = this.userService.getCurrentUser()?.role;
            sessionStorage.setItem('role', JSON.stringify(userRole));
            if (userRole == Role.ADMIN || userRole == Role.SCIENTIST) {
              this.router.navigate(['/dashboard']);
              this.toastr.success('Successful!');
            } else {
              this.toastr.error('You do not have access to this website!');
              this.authService.setAuthentication(null);
            }
          },
          error: () => {
            this.toastr.error('Please provide valid login data!');
          },
        });
    } else {
      this.toastr.error('Please fill in all fields!');
    }
  }

  register(): void {
    //Registrierung
    if (
      this.createUserFirstName &&
      this.createUserLastName &&
      this.createEmail &&
      this.createPassword &&
      this.selectedUniValue
    ) {
      this.authService
        .register({
          email: this.createEmail,
          password: this.createPassword,
          firstName: this.createUserFirstName,
          lastName: this.createUserLastName,
          role: Role.SCIENTIST,
          universityId: this.selectedUniValue,
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
    //Nutzer Validierung, Token eingeben
    this.authService
      .validate(this.createEmail, this.validationCode)
      .subscribe(() => {
        this.router.navigate(['/dashboard']);
      });
  }

  selectedUniValue = 0;
  unis = [''];
  uniIds = [0];
  getAllUnis() {
    //alle Universitäten für Dropdown holen
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
    //Dropdown für Uni-Auswahl
    this.selectedUniValue = this.uniIds[event.value];
  }

  goToCard(card: string): void {
    //zur Validierung gehen
    this.currentCard = card;
  }
}
