import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-notes-tile',
  templateUrl: './notes-tile.component.html',
  styleUrls: ['./notes-tile.component.scss'],
})
export class NotesTileComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {
    this.startdate = '03 Juli 2022';
    this.enddate = '15 Aug. 2022';
    this.loadNotes();
  }

  startdate: string = '';
  enddate: string = '';
  notesData: notesMap[] | undefined;
  loadNotes() {
    this.notesData = [
      {
        icon: 'fa-comments bg-warning',
        date: '15.08.2022 12:00',
        headline: 'Final event',
        text: 'Discussion between the scientists and the participants of the study.',
      },
      {
        icon: 'fa-user bg-info',
        date: '25.07.2022 10:00',
        headline: 'Checking',
        text: 'Checking Beta Study',
      },
      {
        icon: 'fa-envelope bg-primary',
        date: '11.07.2022 09:00',
        headline: 'Milestone',
        text: 'Health Check',
      },
      {
        icon: 'fa-clock bg-purple',
        date: '03.07.2022 09:00',
        headline: 'Kickoff event',
        text: 'The Kickoff event will take place at the university.',
      },
    ];
  }
}

export interface notesMap {
  icon: string;
  date: string;
  headline: string;
  text: string;
}
