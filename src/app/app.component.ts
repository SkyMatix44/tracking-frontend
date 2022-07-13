import { Component } from '@angular/core';
import { AuthService } from './common/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'tracking-frontend';

  login = false;
  constructor(private auth: AuthService) {
    var key = sessionStorage.getItem('auth');
    if (key != null) {
      this.auth.setAuthentication(JSON.parse(key));
    }
  }
}
