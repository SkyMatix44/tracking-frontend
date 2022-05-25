import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../common/auth.service';
import { ProjectService } from '../common/project.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  constructor(
    private router: Router,
    private authService: AuthService,
    private prjService: ProjectService
  ) {}

  currentProjectId: any;
  ngOnInit(): void {
    this.setInitialProject();
  }

  setInitialProject() {
    this.currentProjectId = this.prjService.getCurrentProjectId();
    console.log(this.currentProjectId);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  studies = ['Studie1', 'Studie2', 'Studie3'];

  onChangePrj(event: any) {
    this.prjService.setCurrentProjectId(event.target['selectedIndex']);
  }
}
