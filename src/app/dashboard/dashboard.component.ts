import { Component, OnInit } from '@angular/core';
import { AuthService } from '../common/auth.service';
import { ProjectService } from '../common/project.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  constructor(
    private prjService: ProjectService,
    private authService: AuthService
  ) {}

  projectSubscription: any;
  ngOnInit(): void {
    this.projectSubscription = this.prjService
      .getCurrentProjectObs()
      .subscribe((observer) => {
        console.log(observer);
      });
  }

  ngOnDestroy() {
    this.projectSubscription?.unsubscribe();
  }
}
