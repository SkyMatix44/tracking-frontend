import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Chart, ChartItem, registerables } from 'chart.js';
import * as XLSX from 'xlsx';
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
export class ProjectAnalyticsComponent implements OnInit {
  userList!: User[];

  selectedRow!: number;
  selected!: String;
  type!: 'line';
  date!: number;
  chartname!: 'chart-bar';
  myChart!: any;
  myDonut!: Chart;
  @ViewChild('TABLE', { static: true })
  table: ElementRef;
  public columnList = [
    'ID',
    'UserID',
    'Location',
    'Activity',
    'Calories',
    'BPM',
    'Achievement',
    'Duration',
    'Date',
  ];
  public columnShowHideList: CustomColumn[] = [];

  userListMatTabDataSource = new MatTableDataSource<User>(this.userList);
  constructor(table: ElementRef) {
    this.table = table;
  }

  ExportTOExcel() {
    console.log(this.table);
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(
      this.table.nativeElement
    );
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    XLSX.writeFile(wb, 'SheetJS.xlsx');
  }

  ngOnInit(): void {
    this.initializeColumnProperties();
    this.getAlldata();
  }

  applyFilter() {
    const filterValue = this.selected || this.date;
    console.log(filterValue);
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
        userID: 1,
        location: 'Siegen',
        activity: 'walking',
        steps: 5466,
        calories: 123,
        bpm: 90,
        achievement: 'yes',
        duration: 10,
        date: '2022-07-04',
      },
      {
        id: 2,
        userID: 3,
        location: 'Berlin',
        activity: 'running',
        steps: 23546,
        calories: 500,
        bpm: 160,
        achievement: 'no',
        duration: 10,
        date: '2022-07-03',
      },
      {
        id: 3,
        userID: 4,
        location: 'Siegen',
        activity: 'swimming',
        steps: 0,
        calories: 234,
        bpm: 148,
        achievement: 'no',
        duration: 10,
        date: '2022-07-01',
      },
      {
        id: 4,
        userID: 2,
        location: 'Hamburg',
        activity: 'walking',
        steps: 3509,
        calories: 48,
        bpm: 100,
        achievement: 'yes',
        duration: 10,
        date: '2022-07-07',
      },
      {
        id: 5,
        userID: 4,
        location: 'Dortmund',
        activity: 'swimming',
        steps: 0,
        calories: 298,
        bpm: 136,
        achievement: 'yes',
        duration: 10,
        date: '2021-12-17',
      },
      {
        id: 6,
        userID: 1,
        location: 'Siegen',
        activity: 'walking',
        steps: 9786,
        calories: 398,
        bpm: 97,
        achievement: 'yes',
        duration: 10,
        date: '2020-12-13',
      },
      {
        id: 7,
        userID: 1,
        location: 'Berlin',
        activity: 'running',
        steps: 9766,
        calories: 947,
        bpm: 157,
        achievement: 'no',
        duration: 10,
        date: '2022-07-03',
      },
    ];
    this.userListMatTabDataSource.data = this.userList;
  }

  setDiagramData() {
    if (this.myChart !== undefined) {
      this.myChart.destroy();
    }
    var dataValues = [4, 13, 6, 5, 8, 3];
    var myData = {
      labels: ['January', 'February', 'March', 'April', 'May', 'June'],
      datasets: [
        {
          label: ' active',
          data: dataValues,
          backgroundColor: ['rgba(242, 243, 254, 1)'],
          borderColor: ['rgba(225, 232, 255, 1)'],
          borderWidth: 1,
        },
      ],
    };
    var charttype = this.type;
    this.showDiagram('myChart', charttype, myData);
  }

  showDiagram(
    diagramName: string,
    charttype: any,
    myData: {
      labels: string[];
      datasets: {
        label: string;
        data: number[];
        backgroundColor: string[];
        borderColor: string[];
        borderWidth: number;
      }[];
    }
  ) {
    Chart.register(...registerables);
    const ctx = document.getElementById(diagramName) as ChartItem;
    this.myChart = new Chart(ctx, {
      type: charttype,
      data: myData,
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
