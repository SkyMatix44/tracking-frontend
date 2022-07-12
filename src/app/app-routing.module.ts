import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminSectionComponent } from './admin-section/admin-section.component';
import { AuthGuard } from './auth.guard';
import { Role } from './common/user.service';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';
import { ProjectAnalyticsComponent } from './project-analytics/project-analytics.component';
import { ProjectConfigurationComponent } from './project-configuration/project-configuration.component';
import { ProjectListreportComponent } from './project-listreport/project-listreport.component';
import { TestingTokensComponent } from './testing-tokens/testing-tokens.component';
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
    canActivate: [AuthGuard],
    data: { roles: [Role.ADMIN, Role.SCIENTIST] },
  },
  {
    path: 'configuration',
    component: ProjectConfigurationComponent,
    canActivate: [AuthGuard],
    data: { roles: [Role.ADMIN, Role.SCIENTIST] },
  },
  {
    path: 'analytics',
    component: ProjectAnalyticsComponent,
    canActivate: [AuthGuard],
    data: { roles: [Role.ADMIN, Role.SCIENTIST] },
  },
  {
    path: 'listreport',
    component: ProjectListreportComponent,
    canActivate: [AuthGuard],
    data: { roles: [Role.ADMIN, Role.SCIENTIST] },
  },
  {
    path: 'userprofile',
    component: UserProfileComponent,
    canActivate: [AuthGuard],
    data: { roles: [Role.ADMIN, Role.SCIENTIST] },
  },
  {
    path: 'admin',
    component: AdminSectionComponent,
    canActivate: [AuthGuard],
    data: { roles: [Role.ADMIN] },
  },
  {
    path: 'tokens',
    component: TestingTokensComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
