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

  userRole: Role | undefined;
  selectedValue: string | undefined;
  ngOnInit(): void {
    this.userRole = this.userService.getCurrentUser()?.role; //hide the admin link
    this.getAllPrjAndSetInitial();
  }

  ngAfterViewInit() {
    this.cdref.detectChanges();
  }

  getAllPrjAndSetInitial() {
    this.studieIds = [];
    this.prjService.getAllProjects().subscribe((results) => {
      //console.log(results);
      results.forEach((element) => {
        this.studieIds.push({ id: element.id, name: element.name });
      });
      var currId = this.prjService.getCurrentProjectId();
      if (currId == -1) {
        this.setInitialProject();
        if (this.studieIds.length == 0) {
          this.selectedValue = 'Create study first!';
        }
      } else {
        this.studieIds.forEach((element) => {
          if (element.id == currId) {
            this.selectedValue = element.name;
          }
        });
      }
    });
  }

  setInitialProject() {
    if (this.studieIds[0] != undefined) {
      this.selectedValue = this.studieIds[0].name;
      this.prjService.setCurrentProjectId(this.studieIds[0].id);
    }
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

  studieIds = [{ id: 20, name: 'StudieSiegen' }];

  onChangePrj(event: any) {
    this.prjService.setCurrentProjectId(event.value);
  }
}
