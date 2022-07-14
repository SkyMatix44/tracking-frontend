import { Component, OnInit } from '@angular/core';
import { Chart, ChartItem, registerables } from 'chart.js';
import { ActivityService } from '../../common/activity.service';
import { ProjectService } from '../../common/project.service';

@Component({
  selector: 'app-study-tile',
  templateUrl: './study-tile.component.html',
  styleUrls: ['./study-tile.component.scss'],
})
export class StudyTileComponent implements OnInit {
  constructor(
    private activService: ActivityService,
    private prjService: ProjectService
  ) {}
  userActivity: UserActivity[] = [];

  ngOnInit(): void {
    const monthLabels = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
    ];
    var monthData = [0, 59, 30, 81, 56, 40];

    this.showDiagram('line-chart', monthLabels, monthData);
    this.currentlySelectedPeriod = 'Last 6 months';
    this.prjService.getCurrentProjectObs().subscribe((results) => {
      this.loadAcitivityDataFromDatabase(results?.id!);
    });
  }

  async loadAcitivityDataFromDatabase(prjId: number) {
    //Diagramm Daten über Aktivitäten der letzten Tage/Wochen/Monate
    var actDate = Date.now();

    //letzten 7 Tage
    var last7Dayss = new Date(actDate).setDate(new Date(actDate).getDate() - 7);

    //letzten 4 Wochen
    var last4Weeks = new Date(actDate).setDate(
      new Date(actDate).getDate() - 28
    );

    //letzten 6 Monate
    var last6Months = new Date(actDate).setDate(
      new Date(actDate).getDate() - 182
    );

    this.getAndSetData('day', prjId, last7Dayss, actDate);
    this.getAndSetData('week', prjId, last4Weeks, actDate);
  }

  nrPrj = 0; //Diagramm Daten setzen
  getAndSetData(
    displayData: string,
    prjId: number,
    fromDays: number,
    actDate: number
  ) {
    if (prjId != undefined) {
      var a = this.activService
        .getProjectActivties(prjId, fromDays, actDate)
        .subscribe((results) => {
          this.userActivity = [];
          results.forEach((element) => {
            var date = new Date(Number(element.start_date)).toDateString();
            this.userActivity.push({
              start_date: this.formatDate(date),
            });
          });

          this.nrPrj += 1;
          if (displayData == 'day') {
            this.dayData = [];
            this.dayLabels = [];

            let uniqueArray = this.userActivity
              .map(function (date) {
                return date.start_date;
              })
              .filter(function (date, i, array) {
                return array.indexOf(date) === i;
              })
              .map(function (time) {
                return new Date(time);
              });

            uniqueArray.forEach((element) => {
              this.dayLabels.push(this.formatDate(element));
              var nrActivOneDay = this.userActivity.filter(
                (i) => i.start_date === this.formatDate(element)
              ).length;
              this.dayData.push(nrActivOneDay);
            });
          } else if (displayData == 'week') {
            this.weekData = [];
            var last4Weeks = 0;
            var minusTage = 7;
            this.weekLabels = [];
            for (let index = 0; index < 4; index++) {
              //4 Wochen

              this.weekLabels.push(this.formatDate(last4Weeks));

              last4Weeks = new Date(actDate).setDate(
                new Date(actDate).getDate() - minusTage
              );

              var activitysOneWeek: string[] = [];
              this.userActivity?.forEach((element) => {
                var arrDate = new Date(element.start_date);
                if (
                  arrDate.getTime() < actDate &&
                  arrDate.getTime() > last4Weeks
                ) {
                  activitysOneWeek.push(this.formatDate(arrDate));
                }
              });
              actDate = last4Weeks;
              this.weekData.push(activitysOneWeek.length);
            }
          } else if (displayData == 'month') {
            this.monthData = [];

            //nach 4 Wochen
            let uniqueArray = this.userActivity
              .map(function (date) {
                return date.start_date;
              })
              .filter(function (date, i, array) {
                return array.indexOf(date) === i;
              })
              .map(function (time) {
                return new Date(time);
              });

            uniqueArray.forEach((element) => {
              var nrActivOneDay = this.userActivity.filter(
                (i) => i.start_date === this.formatDate(element)
              ).length;
              //console.log(this.formatDate(element));
              //console.log(nrActivOneDay);
              this.monthData.push(nrActivOneDay);
              //console.log(displayData);
            });
          }
          if (this.nrPrj % 2 == 0) {
            this.weekData.reverse();
            this.weekLabels.reverse();
          }
          this.weekLabels.pop();
          this.weekLabels.push(this.formatDate(actDate));
          this.selectTimeperiod('days');
        });
    }
  }

  formatDate(date: any) {
    //Datum number in [month, day, year] formatieren
    var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [month, day, year].join('.');
  }

  currentlySelectedPeriod = '';
  dayData = [0];
  monthData = [0];
  weekData = [0];
  weekLabels = ['First Week', 'Second Week', 'Third Week', 'Fourth Week'];
  dayLabels = [
    'Friday',
    'Saturday',
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
  ];
  selectTimeperiod(date: string) {
    //Auswahl des Nutzers über HTML Dropdown, welcher Zeitraum angzeigt werden soll
    this.chart.destroy();

    const monthLabels = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
    ];
    var monthData = [0, 0, 0, 0, 0, 0];

    //this.dayData = [10, 20, 37, 18, 56, 85, 40];

    //var weekData = [30, 20, 57, 78];

    switch (date) {
      case 'days':
        if (this.dayData.length < 7) {
          //this.dayData.pop();
        }
        this.showDiagram('line-chart', this.dayLabels, this.dayData);
        this.currentlySelectedPeriod = 'Last 7 days';
        break;
      case 'week':
        this.showDiagram('line-chart', this.weekLabels, this.weekData);
        this.currentlySelectedPeriod = 'Last 4 weeks';
        break;
      case 'month':
        this.showDiagram('line-chart', monthLabels, monthData);
        this.currentlySelectedPeriod = 'Last 6 months';
        break;
      default:
        break;
    }
  }

  chart: any;
  showDiagram(diagramName: string, dataLabels: string[], dataValues: number[]) {
    //Diagramm anzeigen
    Chart.register(...registerables);

    const ctx = document.getElementById(diagramName) as ChartItem;

    const myChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: dataLabels,
        datasets: [
          {
            label: 'Active Users',
            data: dataValues,
            borderColor: 'rgb(75, 19, 192)',
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });

    this.chart = myChart;
  }
}

export interface UserActivity {
  //id: number;
  //userID: number;
  //activity: string;
  start_date: string;
}
