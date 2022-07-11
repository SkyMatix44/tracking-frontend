import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { AuthService } from './common/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'tracking-frontend';

  login = false;
  constructor(private router: Router, private auth: AuthService) {
    var key = sessionStorage.getItem('auth');
    if (key != null) {
      this.auth.setAuthentication(JSON.parse(key));
    }

    this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationEnd) {
        if (event.url == '/login' || event.url == '/') {
          this.login = true;
        } else {
          this.login = false;
        }
      }
    });
    /* evtl. Alternative
    this.auth = this.httpService.getAuthentication();
    */
  }
}
