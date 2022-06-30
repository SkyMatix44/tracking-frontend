import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Chart, ChartItem, registerables } from 'chart.js';
import { User } from './user';

interface CustomColumn {
  possition: number;
  name: string;
  isActive: boolean;
}
@Component({
  selector: 'app-project-analytics',
  templateUrl: './project-analytics.component.html',
  styleUrls: ['./project-analytics.component.scss'],
})
export class ProjectAnalyticsComponent implements OnInit, AfterViewInit {
  userList!: User[];
  selectedRow!: number;
  public columnList = [
    'ID',
    'Location',
    'Activity',
    'Calories',
    'Distance',
    'BPM' /*'Achievment','lenght of time', 'Date'*/,
  ];
  public columnShowHideList: CustomColumn[] = [];

  userListMatTabDataSource = new MatTableDataSource<User>(this.userList);
  constructor() {}
  @ViewChild(MatSort, { static: true })
  sort = new MatSort();

  ngOnInit(): void {
    this.setDiagramData();
    this.initializeColumnProperties();
    this.getAlldata();
  }
  ngAfterViewInit() {
    this.userListMatTabDataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event?.target as HTMLInputElement).value;
    this.userListMatTabDataSource.filter = filterValue.trim().toLowerCase();
  }

  toggleColumn(column: { isActive: boolean; possition: number; name: string }) {
    if (column.isActive) {
      if (column.possition > this.columnList.length - 1) {
        this.columnList.push(column.name);
      } else {
        this.columnList.splice(column.possition, 0, column.name);
      }
    } else {
      let i = this.columnList.indexOf(column.name);
      let opr = i > -1 ? this.columnList.splice(i, 1) : undefined;
    }
  }
  initializeColumnProperties() {
    this.columnList.forEach((element, index) => {
      this.columnShowHideList.push({
        possition: index,
        name: element,
        isActive: true,
      });
    });
  }
  getAlldata() {
    this.userList = [
      {
        id: 1,
        location: 'Siegen',
        activity: 'walking',
        steps: 5466,
        calories: 123,
        distance: 2000,
        bpm: 90,
        achievement: '',
        time: 10,
        date: '',
      },
      {
        id: 2,
        location: 'Berlin',
        activity: 'running',
        steps: 23546,
        calories: 500,
        distance: 10000,
        bpm: 160,
        achievement: '',
        time: 10,
        date: '',
      },
      {
        id: 3,
        location: 'Siegen',
        activity: 'swimming',
        steps: 0,
        calories: 234,
        distance: 200,
        bpm: 148,
        achievement: '',
        time: 10,
        date: '',
      },
      {
        id: 4,
        location: 'Hamburg',
        activity: 'walking',
        steps: 3509,
        calories: 48,
        distance: 1000,
        bpm: 100,
        achievement: '',
        time: 10,
        date: '',
      },
      {
        id: 5,
        location: 'Dortmund',
        activity: 'swimming',
        steps: 0,
        calories: 298,
        distance: 250,
        bpm: 136,
        achievement: '',
        time: 10,
        date: '',
      },
      {
        id: 6,
        location: 'Siegen',
        activity: 'walking',
        steps: 9786,
        calories: 398,
        distance: 5000,
        bpm: 97,
        achievement: '',
        time: 10,
        date: '',
      },
      {
        id: 7,
        location: 'Berlin',
        activity: 'running',
        steps: 9766,
        calories: 947,
        distance: 6000,
        bpm: 157,
        achievement: '',
        time: 10,
        date: '',
      },
    ];
    this.userListMatTabDataSource.data = this.userList;
  }

  rowClick(rowId: number) {
    this.selectedRow = rowId;
  }
  setDiagramData() {
    var labels = ['January', 'February', 'March', 'April', 'May', 'June'];

    var dataValues = [4, 13, 6, 5, 8, 3];

    this.showDiagram('first-chart', labels, dataValues);
    //this.setDiagramme('second-chart-donut');
    //this.setDiagramme('second-chart-donut');
  }

  showDiagram(diagramName: string, dataLabels: string[], dataValues: number[]) {
    Chart.register(...registerables);

    const ctx = document.getElementById(diagramName) as ChartItem;

    const myChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: dataLabels,
        datasets: [
          {
            label: ' active',
            data: dataValues,
            backgroundColor: ['rgba(54, 162, 235, 0.2)'],
            borderColor: ['rgba(54, 162, 235, 1)'],
            borderWidth: 1,
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
  }
}
