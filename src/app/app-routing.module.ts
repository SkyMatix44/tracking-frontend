import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminSectionComponent } from './admin-section/admin-section.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';
import { ProjectAnalyticsComponent } from './project-analytics/project-analytics.component';
import { ProjectConfigurationComponent } from './project-configuration/project-configuration.component';
import { ProjectListreportComponent } from './project-listreport/project-listreport.component';
import { UserProfileComponent } from './user-profile/user-profile.component';

const routes: Routes = [
  {
    path: '',
    component: LoginComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
  },
  {
    path: 'configuration',
    component: ProjectConfigurationComponent,
  },
  {
    path: 'analytics',
    component: ProjectAnalyticsComponent,
  },
  {
    path: 'listreport',
    component: ProjectListreportComponent,
  },
  {
    path: 'userprofile',
    component: UserProfileComponent,
  },
  {
    path: 'admin',
    component: AdminSectionComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
