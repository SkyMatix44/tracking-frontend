import { Component, OnInit } from '@angular/core';
import { Chart, ChartItem, registerables } from 'chart.js';

@Component({
  selector: 'app-study-tile',
  templateUrl: './study-tile.component.html',
  styleUrls: ['./study-tile.component.scss'],
})
export class StudyTileComponent implements OnInit {
  constructor() {}

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
  }

  currentlySelectedPeriod = '';
  selectTimeperiod(date: string) {
    this.chart.destroy();

    const monthLabels = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
    ];
    var monthData = [0, 59, 30, 81, 56, 40];

    const dayLabels = [
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
      'Sunday',
    ];
    var dayData = [10, 20, 37, 18, 56, 85, 40];

    const weekLabels = [
      'First Week',
      'Second Week',
      'Third Week',
      'Fourth Week',
    ];
    var weekData = [30, 20, 57, 78];

    switch (date) {
      case 'days':
        this.showDiagram('line-chart', dayLabels, dayData);
        this.currentlySelectedPeriod = 'Last 7 days';
        break;
      case 'week':
        this.showDiagram('line-chart', weekLabels, weekData);
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
