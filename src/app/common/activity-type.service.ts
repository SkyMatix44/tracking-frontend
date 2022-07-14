import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root',
})
export class ActivityTypeService {
  constructor(private httpService: HttpService) {}

  /**
   * Create an ActivityType
   */
  create(data: CreateActivityTypeDto): Observable<ActivityType> {
    return this.httpService.post(`activity-type`, data);
  }

  /**
   * Update an ActivityType
   */
  update(id: number, data: CreateActivityTypeDto): Observable<ActivityType> {
    return this.httpService.patch(`activity-type/${id}`, data);
  }

  /**
   * Delete an ActivityType
   */
  delete(id: number): Observable<void> {
    return this.httpService.delete(`activity-type/${id}`);
  }

  /**
   * Returns an ActivityType by ID
   */
  get(id: number): Observable<ActivityType> {
    return this.httpService.get(`activity-type/${id}`);
  }

  /**
   * Returns all ActivityTypes
   */
  getAll(): Observable<ActivityType[]> {
    return this.httpService.get(`activity-type`);
  }
}

export interface ActivityType {
  id: number;
  name: string;
  calories_consumption: number;
}

export interface CreateActivityTypeDto {
  name: string;
  calories_consumption: number;
}
