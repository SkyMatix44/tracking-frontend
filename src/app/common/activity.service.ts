import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root',
})
export class ActivityService {
  constructor(private httpService: HttpService) {}

  update(activityId: number, data: UpdateActivityDto): Observable<Activity> {
    return this.httpService.patch(`activity/${activityId}`, data);
  }

  delete(activityId: number): Observable<void> {
    return this.httpService.delete(`activity/${activityId}`);
  }

  get(activityId: number): Observable<Activity> {
    return this.httpService.get(`activity/${activityId}`);
  }

  getProjectActivties(projectId: number): Observable<Activity[]> {
    return this.httpService.get(`activity/project/${projectId}`);
  }

  getProjectUserActivties(
    projectId: number,
    userId: number
  ): Observable<Activity[]> {
    return this.httpService.get(`activity/project/${projectId}/user/${userId}`);
  }
}

export interface UpdateActivityDto {
  start_date?: number;
  end_date?: number;
  hearthrate?: number;
  steps?: number;
  distance?: number;
  bloodSugarOxygen?: number;
  activityTypeId?: number;
}

export interface Activity {
  id: number;
  start_date: string;
  end_date: string;
  hearthrate: number;
  steps: number;
  distance: number; // in km
  bloodSugarOxygen: number;
  userId: number;
  activityTypeId: number;
  projectId: number;
  activityType: string;
  calories_consumption: number;
}
