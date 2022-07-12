import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { NewsService } from '../../common/news.service';
import { ProjectService } from '../../common/project.service';
import { UserService } from '../../common/user.service';

@Component({
  selector: 'app-news-tile',
  templateUrl: './news-tile.component.html',
  styleUrls: ['./news-tile.component.scss'],
})
export class NewsTileComponent implements OnInit {
  constructor(
    private toastr: ToastrService,
    private prjService: ProjectService,
    private newsService: NewsService,
    private userService: UserService
  ) {}

  projectSubscription: Subscription | undefined;
  actPrjId: number = -1;
  ngOnInit(): void {
    this.getActProject();
    this.loadNewsData(this.actPrjId);
  }

  getActProject() {
    //this.prjService.setCurrentProjectId(20);
    this.projectSubscription = this.prjService
      .getCurrentProjectObs()
      .subscribe((observer) => {
        if (observer?.id != undefined) {
          //console.log('load neue News');
          this.actPrjId = observer.id;
          this.loadNewsData(observer.id);
        } else {
          //console.log('fix initial undefined');
        }
      });
  }

  newsData: newsMap[] | undefined;
  loadNewsData(prjId: number) {
    this.newsData = [
      {
        picture: '/assets/img/scientist-woman.png',
        name: 'Barbara Schmidt',
        createdAt: new Date(),
        type: 'Shared publicly',
        title: 'Note',
        text: 'Exercise not only help to prevent type Diabetes II, but also have a positive effect if you already ill.',
      },
    ];
    this.newsData.pop();

    this.projectSubscription = this.newsService
      .getProjectNews(prjId)
      .subscribe((results) => {
        // console.log(results);
        results.forEach((element) => {
          // console.log(element);
          this.newsData?.push({
            picture: '/assets/img/scientist-man.png',
            name: element.user_firstname + ' ' + element.user_lastname,
            createdAt: element.created_at,
            type: 'Shared publicly',
            title: element.title,
            text: element.text,
          });
        });
      });
  }

  publicMessage = '';
  sendMessage(publicMessage: any) {
    var userFirstName = this.userService.getCurrentUser()?.firstName!;
    var userLastName = this.userService.getCurrentUser()?.lastName!;

    if (isEmptyOrSpaces(publicMessage) == false) {
      var data = {
        title: 'Note',
        text: publicMessage,
        projectId: this.actPrjId,
        user_firstname: userFirstName,
        user_lastname: userLastName,
      };
      this.newsService.create(data).subscribe((results) => {
        // console.log(results);
        this.newsData?.push({
          picture: '/assets/img/scientist-man.png',
          name: userFirstName + ' ' + userLastName,
          createdAt: results.updated_at!,
          type: 'Shared publicly',
          title: 'Note',
          text: publicMessage,
        });
      });
      this.toastr.success('Successfully sent');
    } else {
      this.toastr.error('Your message is empty');
    }
    this.publicMessage = '';
  }
}

function isEmptyOrSpaces(str: any) {
  return str === null || str.match(/^ *$/) !== null;
}

export interface newsMap {
  picture: string;
  name: string;
  createdAt: Date;
  type: string;
  title: string;
  text: string;
}
