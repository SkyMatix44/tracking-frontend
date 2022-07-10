import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root',
})
export class UniversityService {
  constructor(private httpService: HttpService) {}

  create(data: CreateUniversityDto): Observable<University> {
    return this.httpService.post('university', data);
  }

  update(id: number, data: CreateUniversityDto): Observable<University> {
    return this.httpService.patch(`university/${id}`, data);
  }

  delete(id: number): Observable<void> {
    return this.httpService.delete('university');
  }

  get(id: number): Observable<University> {
    return this.httpService.get(`university/${id}`);
  }

  getAll(): Observable<University[]> {
    return this.httpService.get(`university`);
  }
}

export interface University {
  id: number;
  name: string;
  address: string;
}

export interface CreateUniversityDto {
  name: string;
  address: string;
}
