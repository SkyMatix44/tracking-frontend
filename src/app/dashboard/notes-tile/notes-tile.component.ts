import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { NotesConfigDialogComponent } from './notes-config-dialog/notes-config-dialog.component';

@Component({
  selector: 'app-notes-tile',
  templateUrl: './notes-tile.component.html',
  styleUrls: ['./notes-tile.component.scss'],
})
export class NotesTileComponent implements OnInit {
  constructor(public dialog: MatDialog) {}

  ngOnInit(): void {
    this.startdate = '03 Juli 2022';
    this.enddate = '15 Aug. 2022';
    this.loadNotes();
    this.sortNotesDates();
  }

  startdate: string = '';
  enddate: string = '';
  notesData:
    | Array<{ icon: string; date: string; headline: string; text: string }>
    | undefined;
  loadNotes() {
    this.notesData = [
      {
        icon: 'fa-user bg-info',
        date: '07.25.2022',
        headline: 'Checking',
        text: 'Checking Beta Study',
      },
      {
        icon: 'fa-comments bg-warning',
        date: '08.15.2022',
        headline: 'Final event',
        text: 'Discussion between the scientists and the participants of the study.',
      },
      {
        icon: 'fa-envelope bg-primary',
        date: '07.11.2022',
        headline: 'Milestone',
        text: 'Health Check',
      },
      {
        icon: 'fa-clock bg-purple',
        date: '07.03.2022',
        headline: 'Kickoff event',
        text: 'The Kickoff event will take place at the university.',
      },
    ];
  }

  editNotesDialog() {
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
        console.log(returnValue.noteHeadline);
        if (returnValue.noteHeadline != undefined) {
          this.notesData?.push({
            icon: 'fa-envelope bg-primary',
            date: returnValue.noteDate,
            headline: returnValue.noteHeadline,
            text: returnValue.noteDescription,
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
