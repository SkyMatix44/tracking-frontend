import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
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
export class ProjectAnalyticsComponent implements OnInit, AfterViewInit {
  userList: UserList[] = [];

  public columnList = [
    'ID',
    'UserID',
    'Activity',
    'Steps',
    'Distance',
    'Heartrate',
    'Calories',
    'BloodSugar',
    'Duration',
    'StartDate',
  ];
  @ViewChild('TABLE', { static: true })
  table: ElementRef;
  projectSubscription: any;
  selected!: String;
  selectedRow!: number;
  type!: String;
  date!: Date;
  myChart!: any;
  uID!: number;
  public userIDlist = [0];
  public activitylist = [0];
  public filteredArray: number[] = [];
  public filteredUser: number[] = [];
  public count = [0];
  public columnShowHideList: CustomColumn[] = [];
  public activity = [''];
  userListMatTabDataSource = new MatTableDataSource<UserList>(this.userList);
  filteredValues = {};

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    table: ElementRef,
    private actService: ActivityService,
    private prjService: ProjectService,
    private actype: ActivityTypeService
  ) {
    this.table = table;
  }
  ngOnInit(): void {
    this.getActProject();
    //formats the filtervalues and filters the data in the table
    this.userListMatTabDataSource.filterPredicate = function (
      data,
      filter: string
    ): boolean {
      var filterArray = filter.split(',');
      var filterId = filterArray[1];
      var filterActivity = filterArray[0];
      var filterDate = filterArray[2];

      var checkFilterId = filterId == '' ? false : true;
      var checkFilterActivity = filterActivity == '' ? false : true;
      var checkFilterDate = filterDate == 'invalid date' ? false : true;
      //checks wich filter input fields are set
      if (checkFilterId && checkFilterActivity && checkFilterDate) {
        return (
          data.userID.toString().includes(filterId) &&
          data.activity.toLowerCase().includes(filterActivity) &&
          data.start_date.toLowerCase().includes(filterDate)
        );
      }

      if (checkFilterId && checkFilterActivity) {
        return (
          data.userID.toString().includes(filterId) &&
          data.activity.toLowerCase().includes(filterActivity)
        );
      }

      if (checkFilterId && checkFilterDate) {
        return (
          data.userID.toString().includes(filterId) &&
          data.start_date.toLowerCase().includes(filterDate)
        );
      }

      if (checkFilterActivity && checkFilterDate) {
        return (
          data.activity.toLowerCase().includes(filterActivity) &&
          data.start_date.toLowerCase().includes(filterDate)
        );
      }

      if (checkFilterId) {
        return data.userID.toString().includes(filterId);
      }

      if (checkFilterActivity) {
        return data.activity.toLowerCase().includes(filterActivity);
      }

      if (checkFilterDate) {
        return data.start_date.toLowerCase().includes(filterDate);
      }

      return true;
    };
  }

  ngAfterViewInit(): void {
    this.initializeColumnProperties();
    this.userListMatTabDataSource.paginator = this.paginator;
  }
  //subsribes to the current Project ID
  getActProject() {
    this.projectSubscription = this.prjService
      .getCurrentProjectObs()
      .subscribe((observer) => {
        if (observer?.id != undefined) {
          this.getAlldata(observer?.id!);
        } else {
        }
      });
  }
  //gets the filtervalues of the input fields
  applyFilter() {
    var datum = new Date(this.date).toDateString();
    var filterValue = this.selected || this.uID || datum;
    if (filterValue == 'Invalid Date') {
      filterValue = '';
    }
    if (this.selected == undefined) {
      this.selected = '';
    }

    let stringID;
    if (this.uID == undefined) {
      stringID = '';
    } else {
      stringID = this.uID.toString();
    }

    var filterString = this.selected + ',' + stringID + ',' + datum;
    this.userListMatTabDataSource.filter = filterString.trim().toLowerCase();
  }
  //show and hide the columns in the table
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
  //sets the hide list for the columns
  initializeColumnProperties() {
    this.columnList.forEach((element, index) => {
      this.columnShowHideList.push({
        possition: index,
        name: element,
        isActive: true,
      });
    });
  }
  //formats the duration from ms to hours,minutes and seconds
  getFormattedDuration(start_date: string, end_date: string): string {
    const duration: number = Number(end_date) - Number(start_date); // in ms
    const hours = Math.floor(duration / (1000 * 60 * 60));
    const minutes = Math.floor(
      (duration - hours * 60 * 60 * 1000) / (1000 * 60)
    );
    const seconds = Math.floor(
      (duration - hours * 60 * 60 * 1000 - minutes * 60 * 1000) / 1000
    );

    let hoursString: string = hours <= 9 ? '0' + hours : hours + '';
    let minString: string = minutes <= 9 ? '0' + minutes : minutes + '';
    let secString: string = seconds <= 9 ? '0' + seconds : seconds + '';
    return hoursString + ':' + minString + ':' + secString + 'h';
  }
  //gets data from database
  getAlldata(projectid: number) {
    this.userList = [];
    this.activitylist = [];
    this.count = [];
    this.activity = [];
    this.userIDlist = [];
    //gets the data for the table
    this.actService.getProjectActivties(projectid).subscribe((activities) => {
      activities.forEach((element) => {
        this.userList.push({
          id: element.id,
          userID: element.userId,
          activity: element.activityType,
          steps: element.steps,
          distance: element.distance + 'km',
          heartrate: element.hearthrate + 'bpm',
          calories: Math.round(element.calories_consumption * 100) / 100,
          bloodSugarOxygen: element.bloodSugarOxygen,
          duration: this.getFormattedDuration(
            element.start_date,
            element.end_date
          ),
          start_date: new Date(Number(element.start_date)).toDateString(),
        });
      });
      //gets the data for the diagram
      activities.forEach((element) => {
        this.activitylist.push(element.activityTypeId);
        this.userIDlist.push(element.userId);
      });
      this.activitylist.forEach((element) => {
        this.count[element] = (this.count[element] || 0) + 1;
      });
      for (let i = 0; i < this.userIDlist.length; i++) {
        if (!this.filteredUser.includes(this.userIDlist[i])) {
          this.filteredUser.push(this.userIDlist[i]);
        }
      }
      this.filteredArray.sort(function (x, y) {
        return x - y;
      });
      for (let i = 0; i < this.userIDlist.length; i++) {
        if (!this.filteredArray.includes(this.activitylist[i])) {
          this.filteredArray.push(this.activitylist[i]);
        }
      }
      this.userListMatTabDataSource.data = this.userList;
      this.setDiagramData(projectid);
    });

    this.actype.getAll().subscribe((activities) => {
      activities.forEach((element) => {
        this.activity.push(element.name);
      });
    });
  }
  //sets the data from the current project to the diagram
  setDiagramData(projectid: number) {
    projectid = this.prjService.getCurrentProjectId();
    if (this.myChart !== undefined) {
      this.myChart.destroy();
    }

    var myData = {
      labels: this.activity,
      datasets: [
        {
          label: '',
          data: this.count,
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
    if (this.type == undefined) {
      this.type = 'bar';
    }
    var charttype = this.type;
    this.showDiagram('myChart', charttype, myData);
  }
  //displays the diagram
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
  //unsubscribe from the current project
  ngOnDestroy() {
    this.projectSubscription?.unsubscribe();
  }
}

export interface UserList {
  id: number;
  userID: number;
  activity: string;
  steps: number;
  distance: string;
  heartrate: string;
  calories: number;
  bloodSugarOxygen: number;
  duration: string;
  start_date: string;
}
