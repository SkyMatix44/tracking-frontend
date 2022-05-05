import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from './http.service';
import { User } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  constructor(private httpService: HttpService) {}

  /**
   * Creates a project
   */
  create(data: CreateProjectDto): Observable<Project> {
    return this.httpService.post<Project>('project', data);
  }

  /**
   * Update a project
   */
  update(projectId: number, data: UpdateProjectDto): Observable<Project> {
    return this.httpService.put<Project>(`project/${projectId}`, data);
  }

  /**
   * Delete a project
   */
  delete(projectId: number): Observable<Project> {
    return this.httpService.delete<Project>(`project/${projectId}`);
  }

  /**
   * Returns all projects which the user is assigned
   */
  getProjects(): Observable<Project[]> {
    return this.httpService.get<Project[]>('project');
  }

  /**
   * Returns all projects
   */
  getAllProjects(): Observable<Project[]> {
    return this.httpService.get<Project[]>('project/all');
  }

  /**
   * Returns all user of the projects
   */
  getProjectUser(
    projectId: number,
    option: 'all' | 'participants' | 'scientists' = 'all'
  ): Observable<User[]> {
    return this.httpService.get<User[]>(`project/${projectId}/users/${option}`);
  }
}

export interface Project {
  id: number;
  start_date: number;
  end_date: number;
  name: string;
  description: string;
}

export interface CreateProjectDto {
  name: string;
  description: string;
  start_date: number;
  end_date: number;
}

export interface UpdateProjectDto {
  name?: string;
  description?: string;
  start_date?: number;
  end_date?: number;
}
