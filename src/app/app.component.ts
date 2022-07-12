import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './common/auth.service';
import { ProjectService } from './common/project.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'tracking-frontend';

  login = false;
  constructor(
    private router: Router,
    private auth: AuthService,
    private prjService: ProjectService
  ) {
    var key = sessionStorage.getItem('auth');
    if (key != null) {
      this.auth.setAuthentication(JSON.parse(key));
    }
  }
}
