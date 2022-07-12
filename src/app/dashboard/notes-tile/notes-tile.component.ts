import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { NewsService } from '../../common/news.service';
import { ProjectService } from '../../common/project.service';
import { NotesConfigDialogComponent } from './notes-config-dialog/notes-config-dialog.component';

@Component({
  selector: 'app-notes-tile',
  templateUrl: './notes-tile.component.html',
  styleUrls: ['./notes-tile.component.scss'],
})
export class NotesTileComponent implements OnInit {
  constructor(
    public dialog: MatDialog,
    private newsService: NewsService,
    private prjService: ProjectService
  ) {}

  projectSubscription: Subscription | undefined;
  actProjectId: number = 0;
  ngOnInit(): void {
    this.startdate = '03 Juli 2022';
    this.enddate = '15 Aug. 2022';
    this.notesData = [];
    this.getActProject();
    //this.loadNotes(20);
    this.sortNotesDates();
  }

  getActProject() {
    //this.prjService.setCurrentProjectId(20);
    this.projectSubscription = this.prjService
      .getCurrentProjectObs()
      .subscribe((observer) => {
        if (observer?.id != undefined) {
          this.notesData = [];

          this.actProjectId = observer.id;
          this.loadNotes(observer.id);

          var startDateNormal = new Date(
            parseInt(observer.start_date.toString(), 10)
          ).toLocaleString('en-GB', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          });
          var endDateNormal = new Date(
            parseInt(observer.end_date.toString(), 10)
          ).toLocaleString('en-GB', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          });
          this.startdate = startDateNormal;
          this.enddate = endDateNormal;

          var enddate2 = formatDate(startDateNormal);
          var date2 = formatDate(endDateNormal);

          this.notesData?.push({
            icon: 'fa-clock bg-purple',
            date: enddate2,
            headline: 'Kickoff event',
            text:
              'The kickoff event will take place on ' + startDateNormal + '.',
          });

          this.notesData?.push({
            icon: 'fa-comments bg-warning',
            date: date2,
            headline: 'Final event',
            text: 'Final event between the scientists and the participants of the study.',
          });

          this.sortNotesDates();
        } else {
        }
      });
  }

  startdate: string = '';
  enddate: string = '';
  notesData:
    | Array<{ icon: string; date: string; headline: string; text: string }>
    | undefined;
  loadNotes(prjId: number) {
    this.prjService.getMilestonesOfProject(prjId).subscribe((results) => {
      //console.log(results);
      results.forEach((element) => {
        //console.log(element);

        var startDateNormal = new Date(
          parseInt(element.due_date.toString(), 10)
        ).toLocaleString('default', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        });
        //console.log(startDateNormal);
        var enddate2 = formatDate(startDateNormal);
        //console.log(enddate2);

        this.notesData?.push({
          icon: 'fa-envelope bg-primary',
          date: enddate2,
          headline: element.title,
          text: element.description,
        });
        this.sortNotesDates();
      });
    });
  }

  editOrAddNotesDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.data = {
      studyName: '',
      studyEnddate: '',
    };

    this.dialog
      .open(NotesConfigDialogComponent, dialogConfig)
      .afterClosed()
      .subscribe((returnValue) => {
        //console.log(returnValue.noteHeadline);
        if (returnValue.noteHeadline != undefined) {
          this.notesData?.push({
            icon: 'fa-envelope bg-primary',
            date: returnValue.noteDate,
            headline: returnValue.noteHeadline,
            text: returnValue.noteDescription,
          });

          var data = {
            title: returnValue.noteHeadline,
            description: returnValue.noteDescription,
            due_date: new Date(returnValue.noteDate).getTime(),
          };
          //console.log(data);
          this.projectSubscription = this.prjService
            .createMilestone(this.actProjectId, data)
            .subscribe((results) => {
              //console.log(results);
            });
          this.sortNotesDates();
        }
      });
  }

  sortNotesDates() {
    this.notesData!.sort((a, b) => Date.parse(b.date) - Date.parse(a.date));
  }
}

export interface notesMap {
  icon: string;
  date: string;
  headline: string;
  text: string;
}

function formatDate(date: any) {
  var d = new Date(date),
    month = '' + (d.getMonth() + 1),
    day = '' + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = '0' + month;
  if (day.length < 2) day = '0' + day;

  return month + '.' + day + '.' + year;
}
