import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';
import { ProjectAnalyticsComponent } from './project-analytics/project-analytics.component';
import { ProjectListreportComponent } from './project-listreport/project-listreport.component';
import { ProjectOverviewComponent } from './project-overview/project-overview.component';

const routes: Routes = [
  {
    path: '',
    component: LoginComponent,
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
  },
  {
    path: 'overview',
    component: ProjectOverviewComponent,
  },
  {
    path: 'analytics',
    component: ProjectAnalyticsComponent,
  },
  {
    path: 'listreport',
    component: ProjectListreportComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
