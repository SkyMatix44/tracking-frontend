import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root',
})
export class UniversityService {
  constructor(private httpService: HttpService) {}

  /**
   * Create a university
   */
  create(data: CreateUniversityDto): Observable<University> {
    return this.httpService.post('university', data);
  }

  /**
   * Update a university
   */
  update(id: number, data: CreateUniversityDto): Observable<University> {
    return this.httpService.patch(`university/${id}`, data);
  }

  /**
   * Delete a university
   */
  delete(id: number): Observable<void> {
    return this.httpService.delete('university');
  }

  /**
   * Returns a university
   */
  get(id: number): Observable<University> {
    return this.httpService.get(`university/${id}`);
  }

  /**
   * Returns all universities
   */
  getAll(): Observable<University[]> {
    return this.httpService.getWithoutAuth(`auth/universities`);
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
