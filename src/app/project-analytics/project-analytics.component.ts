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
  @ViewChild('TABLE', { static: true })
  table: ElementRef;
  public columnList = [
    'ID',
    'Location',
    'Activity',
    'Calories',
    'Distance',
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
    this.setDiagramData();
    this.initializeColumnProperties();
    this.getAlldata();
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
        achievement: 'yes',
        duration: 10,
        date: '01.01.1900',
      },
      {
        id: 2,
        location: 'Berlin',
        activity: 'running',
        steps: 23546,
        calories: 500,
        distance: 10000,
        bpm: 160,
        achievement: 'no',
        duration: 10,
        date: '01.01.1900',
      },
      {
        id: 3,
        location: 'Siegen',
        activity: 'swimming',
        steps: 0,
        calories: 234,
        distance: 200,
        bpm: 148,
        achievement: 'no',
        duration: 10,
        date: '01.01.1900',
      },
      {
        id: 4,
        location: 'Hamburg',
        activity: 'walking',
        steps: 3509,
        calories: 48,
        distance: 1000,
        bpm: 100,
        achievement: 'yes',
        duration: 10,
        date: '01.01.1900',
      },
      {
        id: 5,
        location: 'Dortmund',
        activity: 'swimming',
        steps: 0,
        calories: 298,
        distance: 250,
        bpm: 136,
        achievement: 'yes',
        duration: 10,
        date: '01.01.1900',
      },
      {
        id: 6,
        location: 'Siegen',
        activity: 'walking',
        steps: 9786,
        calories: 398,
        distance: 5000,
        bpm: 97,
        achievement: 'yes',
        duration: 10,
        date: '01.01.1900',
      },
      {
        id: 7,
        location: 'Berlin',
        activity: 'running',
        steps: 9766,
        calories: 947,
        distance: 6000,
        bpm: 157,
        achievement: 'no',
        duration: 10,
        date: '03.07.2022',
      },
    ];
    this.userListMatTabDataSource.data = this.userList;
  }

  setDiagramData() {
    var labels = ['January', 'February', 'March', 'April', 'May', 'June'];

    var dataValues = [4, 13, 6, 5, 8, 3];

    this.showDiagram('first-chart', labels, dataValues);
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
            backgroundColor: ['rgba(225, 232, 255, 1)'],
            borderColor: ['rgba(242, 243, 254, 1)'],
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
