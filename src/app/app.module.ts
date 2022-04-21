import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HeaderComponent } from './header/header.component';
import { LoginComponent } from './login/login.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { ProjectOverviewComponent } from './project-overview/project-overview.component';
import { ProjectAnalyticsComponent } from './project-analytics/project-analytics.component';
import { ProjectListreportComponent } from './project-listreport/project-listreport.component';
import { NewsTileComponent } from './dashboard/news-tile/news-tile.component';
import { StudyTileComponent } from './dashboard/study-tile/study-tile.component';
import { NotesTileComponent } from './dashboard/notes-tile/notes-tile.component';
import { RegisterComponent } from './register/register.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HeaderComponent,
    DashboardComponent,
    UserProfileComponent,
    ProjectOverviewComponent,
    ProjectAnalyticsComponent,
    ProjectListreportComponent,
    NewsTileComponent,
    StudyTileComponent,
    NotesTileComponent,
    RegisterComponent,
  ],
  imports: [BrowserModule, AppRoutingModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
