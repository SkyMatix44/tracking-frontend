import { DatePipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSortModule } from '@angular/material/sort';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { AddOrEditUserDialogComponent } from './admin-section/addOrEditUser-dialog/addOrEditUser-dialog.component';
import { AdminSectionComponent } from './admin-section/admin-section.component';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NewsTileComponent } from './dashboard/news-tile/news-tile.component';
import { NotesConfigDialogComponent } from './dashboard/notes-tile/notes-config-dialog/notes-config-dialog.component';
import { NotesTileComponent } from './dashboard/notes-tile/notes-tile.component';
import { StudyTileComponent } from './dashboard/study-tile/study-tile.component';
import { HeaderComponent } from './header/header.component';
import { LoginComponent } from './login/login.component';
import { ProjectAnalyticsComponent } from './project-analytics/project-analytics.component';
import { ProjectConfigDialogComponent } from './project-configuration/project-config-dialog/project-config-dialog.component';
import { ProjectConfigurationComponent } from './project-configuration/project-configuration.component';
import { ProjectListreportComponent } from './project-listreport/project-listreport.component';
import { RegisterComponent } from './register/register.component';
import { UserProfileComponent } from './user-profile/user-profile.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HeaderComponent,
    DashboardComponent,
    UserProfileComponent,
    ProjectAnalyticsComponent,
    ProjectListreportComponent,
    NewsTileComponent,
    StudyTileComponent,
    NotesTileComponent,
    NotesConfigDialogComponent,
    RegisterComponent,
    ProjectConfigurationComponent,
    ProjectConfigDialogComponent,
    AdminSectionComponent,
    AddOrEditUserDialogComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatToolbarModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatSortModule,
    MatSlideToggleModule,
    MatTableModule,
    MatMenuModule,
    MatInputModule,
    FormsModule,
    HttpClientModule,
    ToastrModule.forRoot({
      timeOut: 5000,
      progressBar: true,
      progressAnimation: 'decreasing',
      preventDuplicates: true,
    }),
    MatTableModule,
    MatDialogModule,
    MatStepperModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
  ],
  providers: [DatePipe],
  bootstrap: [AppComponent],
})
export class AppModule {}
