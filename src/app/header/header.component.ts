import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
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
    private prjService: ProjectService,
    private cdref: ChangeDetectorRef
  ) {}

  currentProjectId: any;
  ngOnInit(): void {}

  ngAfterViewInit() {
    this.setInitialProject();
    this.cdref.detectChanges();
  }

  setInitialProject() {
    this.currentProjectId = this.prjService.getCurrentProjectId();

    var DropdownList = document.getElementById(
      'inputStatus'
    ) as HTMLSelectElement;

    if (this.currentProjectId == -1) {
      this.currentProjectId = 0;
    }

    DropdownList.selectedIndex = this.currentProjectId;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  studies = ['Studie1', 'Studie2', 'Studie3'];

  onChangePrj(event: any) {
    this.prjService.setCurrentProjectId(event.target['selectedIndex']);
    this.currentProjectId = event.target['selectedIndex'];
  }
}
