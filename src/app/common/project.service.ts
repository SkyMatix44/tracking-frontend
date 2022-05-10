import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, map, Observable } from 'rxjs';
import { HttpService } from './http.service';
import { User } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  // current selected project id, -1 when no project selected
  public readonly currentProjectId$: BehaviorSubject<number> =
    new BehaviorSubject(-1);

  // TODO load and set projects after login
  // projects of the current user
  public readonly projects$: BehaviorSubject<Project[]> = new BehaviorSubject(
    [] as Project[]
  );

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

  /**
   * Set current project id
   */
  setCurrentProjectId(projectId: number): void {
    this.currentProjectId$.next(projectId);
  }

  /**
   * Returns the current project id, -1 when no project selected
   */
  getCurrentProjectId(): number {
    return this.currentProjectId$.getValue();
  }

  /**
   * Returns the current project
   */
  getCurrentProject(): Project | null {
    const projectId = this.getCurrentProjectId();
    if (projectId > -1) {
      const project = this.projects$.getValue().find((p) => p.id === projectId);
      if (project) {
        return project;
      }
    }

    return null;
  }

  /**
   * Set projects
   */
  setProjects(projects: Project[]): void {
    this.projects$.next(projects);
  }

  /**
   * Returns an observable with the current project
   */
  getCurrentProjectObs(): Observable<Project | null> {
    return combineLatest([this.currentProjectId$, this.projects$]).pipe(
      map(([projectId, projects]) => {
        if (projectId > -1 && projects.length > 0) {
          const curProject = this.projects$
            .getValue()
            .find((p) => p.id === projectId);

          if (curProject) {
            return curProject;
          }
        }

        return null;
      })
      // shareReplay()
    );
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
