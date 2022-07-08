import { Component, OnInit } from '@angular/core';
import { ProjectService } from '../common/project.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  constructor(private prjService: ProjectService) {}

  projectSubscription: any;
  ngOnInit(): void {}
}
