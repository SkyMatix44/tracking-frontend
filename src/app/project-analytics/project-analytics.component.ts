import { Component, OnInit } from '@angular/core';
import { ProjectService } from '../common/project.service';

@Component({
  selector: 'app-project-analytics',
  templateUrl: './project-analytics.component.html',
  styleUrls: ['./project-analytics.component.scss'],
})
export class ProjectAnalyticsComponent implements OnInit {
  constructor(private prjService: ProjectService) {}

  projectSubscription: any;
  ngOnInit(): void {
    this.subscribeToActualProject();
  }

  subscribeToActualProject() {
    /*
    this.projectSubscription.subscribe((v: any) => {
      console.log('currentId: ' + v);
    });
    */
  }

  ngOnDestroy() {
    //this.projectSubscription.unsubscribe();
  }
}
