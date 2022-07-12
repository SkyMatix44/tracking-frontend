import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Chart, ChartItem, registerables } from 'chart.js';
import { ActivityTypeService } from '../common/activity-type.service';
import { ActivityService } from '../common/activity.service';
import { ProjectService } from '../common/project.service';

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
  userList = [
    {
      id: 0,
      userID: 0,
      activity: 0,
      steps: 0,
      distance: 0,
      heartrate: 0,
      bloodSugarOxygen: 0,
      start_date: '',
      end_date: '',
    },
  ];

  selectedRow!: number;
  selected!: String;
  uID!: number;
  type!: 'line';
  date!: Date ;
  chartname!: 'chart-bar';
  myChart!: any;
  projectid!: number;
  @ViewChild('TABLE', { static: true })
  table: ElementRef;
  public columnList = [
    'ID',
    'UserID',
    'Activity',
    'Steps',
    'Distance',
    'Heartrate',
    'BloodSugarOxygen',
    'StartDate',
    'EndDate',
  ];
  public activitylist=[
    0,
  ];
  public userIDlist=[
    0,
  ]
  uniqueuserIDlist=[]
  public columnShowHideList: CustomColumn[] = [];

  userListMatTabDataSource = new MatTableDataSource(this.userList);
  constructor(
    table: ElementRef,
    private actService: ActivityService,
    private prjService: ProjectService,
    private actype: ActivityTypeService
  ) {
    this.table = table;
  }

  ngOnInit(): void {
    this.getProjectId();
    this.initializeColumnProperties();
    this.getAlldata(this.projectid);
    
  }

  getProjectId() {
    this.projectid = this.prjService.getCurrentProjectId();
  }
  applyFilter() {
    //var arr= this.date.toString().split("-");
    //var datum=arr[2] + "." + arr[1] + "." + arr[0];
    const filterValue = this.selected || this.date || this.uID;
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
  getAlldata(projectid: number) {
    this.userList.pop();
    this.activitylist.pop();
    this.userIDlist.pop();
    this.actService.getProjectActivties(2).subscribe((activities) => {
      activities.forEach((element) => {
        this.userList.push({
          id: element.id,
          userID: element.userId,
          activity: element.activityTypeId,
          steps: element.steps,
          distance: element.distance,
          heartrate: element.hearthrate,
          bloodSugarOxygen: element.bloodSugarOxygen,
          start_date: element.start_date,
          end_date: element.end_date,
        });
      });
    });
    this.actService.getProjectActivties(2).subscribe((activities) => {
      activities.forEach((element) => {
        this.activitylist.push(
          element.activityTypeId,
        );
      });
    });
    this.actService.getProjectActivties(2).subscribe((activities) => {
      activities.forEach((element) => {
        this.userIDlist.push(
          element.userId,
        );
      });
    });
    this.userListMatTabDataSource.data = this.userList;
    console.log(this.activitylist);
    
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
          backgroundColor: [
            'rgb(207, 210, 245)',
            'rgb(187, 191, 238)',
            'rgb(165, 170, 227)',
            'rgb(157, 140, 215)',
            'rgb(178, 163, 228)',
            'rgb(198, 186, 238)',
          ],
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
