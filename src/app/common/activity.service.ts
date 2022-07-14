import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root',
})
export class ActivityService {
  constructor(private httpService: HttpService) {}

  /**
   * Update an Activity
   */
  update(activityId: number, data: UpdateActivityDto): Observable<Activity> {
    return this.httpService.patch(`activity/${activityId}`, data);
  }

  /**
   * Delete an Activity
   */
  delete(activityId: number): Observable<void> {
    return this.httpService.delete(`activity/${activityId}`);
  }

  /**
   * Returns an Activity by ID
   */
  get(activityId: number): Observable<Activity> {
    return this.httpService.get(`activity/${activityId}`);
  }

  /**
   * Returns all Activities from a project
   * @param projectId project id
   * @param from from date (-1: not set)
   * @param to to date (-1: not set)
   */
  getProjectActivties(projectId: number, from: number = -1, to: number = -1): Observable<Activity[]> {
    return this.httpService.get(`activity/project/${projectId}/from/${from}/to/${to}`);
  }

  /**
   * Returns all Activities from a project from a user
   */
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
  calories_consumption_per_unit: number; // per kg and min
}
