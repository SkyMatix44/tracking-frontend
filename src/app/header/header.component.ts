import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../common/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit(): void {}

  navigateToSite(siteName: string) {
    this.router.navigate(['/' + siteName]);
  }

  logout(): void {
    this.authService.logout();
    this.navigateToSite('');
  }
}
