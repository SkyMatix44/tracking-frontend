import { invalid } from '@angular/compiler/src/render3/view/util';
import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
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
  projectSubscription: any;
  selectedRow!: number;
  selected!: String;
  type!: String;
  date!: Date;
  chartname!: 'chart-bar';
  myChart!: any;

  @ViewChild('TABLE', { static: true })
  table: ElementRef;
  dataValues = [0];
  tlabels = [''];

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
  public activitylist = [0];
  public userIDlist = [0];
  public filteredArray: number[] = [];
  public count=[0];
  public columnShowHideList: CustomColumn[] = [];
  public activity=['']
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
    this.getActProject();
  }

  ngAfterViewInit(): void {
    this.initializeColumnProperties();
  }
  getActProject() {
    //this.prjService.setCurrentProjectId(20);
    this.projectSubscription = this.prjService
      .getCurrentProjectObs()
      .subscribe((observer) => {
        if (observer?.id != undefined) {
          this.getAlldata(observer?.id!);
          
        } else {
          console.log('fix initial undefined');
        }
      });
  }

  applyFilter() {
    var datum = new Date(this.date).toDateString();
    
    var filterValue = this.selected || datum ;
    if(filterValue=="Invalid Date"){
      filterValue= ''
    }
    console.log(filterValue)
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
    this.userList = [];
    this.activitylist = [];
    this.userIDlist = [];
    this.count=[]
    this.activity=[]
    this.actService.getProjectActivties(projectid).subscribe((activities) => {
      activities.forEach((element) => {
        this.userList.push({
          id: element.id,
          userID: element.userId,
          activity: element.activityTypeId,
          steps: element.steps,
          distance: element.distance,
          heartrate: element.hearthrate,
          bloodSugarOxygen: element.bloodSugarOxygen,
          start_date: new Date(Number(element.start_date)).toDateString(),
          end_date: new Date(Number(element.end_date)).toDateString(),
        });
      });
    });

    this.actService.getProjectActivties(projectid).subscribe((activities) => {
      activities.forEach((element) => {
        this.activitylist.push(element.activityTypeId);
      });
      this.activitylist.forEach(element=>{
        this.count[element]=(this.count[element]||0)+1;
      })
      for (let i = 0; i < this.activitylist.length; i++) {
        if (!this.filteredArray.includes(this.activitylist[i])) {
          this.filteredArray.push(this.activitylist[i]);
        }
      }
      this.filteredArray.sort(function(x,y){
        return x-y
      })
      this.userListMatTabDataSource.data = this.userList;
      this.setDiagramData(projectid);
    });
    this.actype.getAll().subscribe((activities)=> {
      activities.forEach((element)=> {
        this.activity.push(element.name)
      })
      
    })
    
  }

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
      this.type = 'line';
    }
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
    this.dataValues = [];
    this.tlabels = [];
  }
  ngOnDestroy() {
    this.projectSubscription?.unsubscribe();
  }
}
