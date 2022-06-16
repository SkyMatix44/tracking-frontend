import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-news-tile',
  templateUrl: './news-tile.component.html',
  styleUrls: ['./news-tile.component.scss'],
})
export class NewsTileComponent implements OnInit {
  constructor(private toastr: ToastrService) {}

  ngOnInit(): void {
    this.loadNewsData();
  }

  newsData: newsMap[] | undefined;
  loadNewsData() {
    this.newsData = [
      {
        picture: '/assets/img/scientist-woman.png',
        name: 'Barbara Schmidt',
        createdAt: '3 days ago',
        type: 'Shared publicly',
        title: 'Note',
        text: 'Exercise not only help to prevent type Diabetes II, but also have a positive effect if you already ill.',
      },
      {
        picture: '/assets/img/scientist-man.png',
        name: 'Andreas Schröder',
        createdAt: '7:30 PM today',
        type: 'Shared publicly',
        title: 'Note',
        text: 'We would like to remind you that the study has now started and you should track your daily activities.',
      },
    ];
  }

  publicMessage = '';
  sendMessage(publicMessage: any) {
    if (isEmptyOrSpaces(publicMessage) == false) {
      this.toastr.success('Successfully sent');
      this.newsData?.push({
        picture: '/assets/img/scientist-man.png', //Geschlecht des Wissenschaftlers
        name: 'Andreas Schröder', //Name des Wissenschaftlers
        createdAt: 'now',
        type: 'Shared publicly',
        title: 'Note',
        text: publicMessage,
      });
    } else {
      this.toastr.error('Your message is empty');
    }
  }
}

function isEmptyOrSpaces(str: any) {
  return str === null || str.match(/^ *$/) !== null;
}

export interface newsMap {
  picture: string;
  name: string;
  createdAt: string;
  type: string;
  title: string;
  text: string;
}
