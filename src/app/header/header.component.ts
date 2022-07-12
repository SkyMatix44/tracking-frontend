import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../common/auth.service';
import { ProjectService } from '../common/project.service';
import { Role, UserService } from '../common/user.service';

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
    private cdref: ChangeDetectorRef,
    private userService: UserService
  ) {}

  currentProjectId: any;
  userRole: Role | undefined;
  ngOnInit(): void {
    this.userRole = this.userService.getCurrentUser()?.role;
    //console.log(this.userRole);
  }

  ngAfterViewInit() {
    this.getAllProjects();
    var a = this.prjService.getCurrentProjectId();
    //console.log(a);
    if (a == -1) {
      this.setInitialProject();
    }
    this.cdref.detectChanges();
  }

  getAllProjects() {
    this.studies.pop();
    this.studieIds.pop();
    this.prjService.getAllProjects().subscribe((results) => {
      //console.log(results);
      results.forEach((element) => {
        this.studies.push(element.name);
        this.studieIds.push(element.id);
      });
    });
  }

  setInitialProject() {
    this.currentProjectId = this.prjService.getCurrentProjectId();
    //console.log(this.currentProjectId);

    var DropdownList = document.getElementById(
      'inputStatus'
    ) as HTMLSelectElement;

    if (this.currentProjectId == -1) {
      this.currentProjectId = 0;
    }

    DropdownList.selectedIndex = 0;
    //this.prjService.setCurrentProjectId(20);
  }

  redirectTo(uri: string) {
    this.router
      .navigateByUrl('/', { skipLocationChange: true })
      .then(() => this.router.navigate([uri]));
  }

  logout(): void {
    this.authService.logout();
    this.userRole = undefined;
    this.router.navigate(['/login']);
  }

  studies = [''];
  studieIds = [-1];

  onChangePrj(event: any) {
    var id = this.studieIds[event.target['selectedIndex']];
    //console.log(id);
    this.prjService.setCurrentProjectId(id);
    //this.currentProjectId = id;
  }
}
