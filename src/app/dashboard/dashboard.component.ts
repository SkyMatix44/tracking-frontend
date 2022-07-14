import { Component, OnInit } from '@angular/core';
import { AuthService } from '../common/auth.service';
import { ProjectService } from '../common/project.service';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  constructor(
    private prjService: ProjectService,
    private authService: AuthService
  ) {}

  projectSubscription: any;
  nrOfScientists = 0;
  nrOfParticipants = 0;
  nrOfDaysLeft = '0 from 0';
  ngOnInit(): void {
    this.getActProject();
  }

  getActProject() {
    //Aktuell ausgewähltes Projekt abrufen
    this.projectSubscription = this.prjService
      .getCurrentProjectObs()
      .subscribe((observer) => {
        if (observer?.id != undefined) {
          //console.log('initial ' + observer?.id);
          this.getNrOfScientists(observer?.id!);
          this.getNrOfParticipants(observer?.id!);
          this.getNrOfDaysLeft(observer.start_date, observer.end_date);
        }
      });
  }

  getNrOfScientists(prjId: number) {
    //Anzahl der Wissenschaftler einer Studie holen
    this.projectSubscription = this.prjService
      .getProjectUsers(prjId, 'scientists')
      .subscribe((results) => {
        this.nrOfScientists = results.length;
      });
  }

  getNrOfParticipants(prjId: number) {
    //Anzahl der Nutzers einer Studie
    this.projectSubscription = this.prjService
      .getProjectUsers(prjId, 'participants')
      .subscribe((results) => {
        this.nrOfParticipants = results.length;
      });
  }

  getNrOfDaysLeft(startDate: number, endDate: number) {
    //Anzahl der verbleibenden Tage der Studie
    //Differenz bzw. Dauer
    var diff = endDate.valueOf() - startDate.valueOf();
    var diffDays = Math.ceil(diff / (1000 * 3600 * 24));
    //console.log(diffDays);

    //Vergleich mit aktuellem Datum
    var actDate = Date.now();
    //console.log(actDate.valueOf());
    var diffToday = diff.valueOf() - (endDate.valueOf() - actDate.valueOf());
    var diffDaysToday = Math.ceil(diffToday / (1000 * 3600 * 24));

    if (actDate < endDate) {
      //Studie steht in Zukunft an
      if (diffDaysToday < 0) {
        this.nrOfDaysLeft = 0 + ' from ' + diffDays;
      } else {
        this.nrOfDaysLeft = diffDaysToday + ' from ' + diffDays;
      }
    } else if (actDate > endDate) {
      //Studie schon abgeschlossen
      this.nrOfDaysLeft = diffDays + ' from ' + diffDays;
    }
  }

  ngOnDestroy() {
    this.projectSubscription?.unsubscribe();
  }
}
