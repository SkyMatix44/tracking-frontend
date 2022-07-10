import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root',
})
export class ActivityTypeService {
  constructor(private httpService: HttpService) {}

  create(data: CreateActivityTypeDto): Observable<ActivityType> {
    return this.httpService.post(`activity-type`, data);
  }

  update(id: number, data: CreateActivityTypeDto): Observable<ActivityType> {
    return this.httpService.patch(`activity-type/${id}`, data);
  }

  delete(id: number): Observable<void> {
    return this.httpService.delete(`activity-type/${id}`);
  }

  get(id: number): Observable<ActivityType> {
    return this.httpService.get(`activity-type/${id}`);
  }

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
