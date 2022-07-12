import { Injectable, OnDestroy } from '@angular/core';
import {
  BehaviorSubject,
  combineLatest,
  map,
  Observable,
  Subscription,
} from 'rxjs';
import { HttpService } from './http.service';
import { User } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class ProjectService implements OnDestroy {
  // current selected project id, -1 when no project selected
  public readonly currentProjectId$: BehaviorSubject<number> =
    new BehaviorSubject(-1);

  // projects of the current user
  public readonly projects$: BehaviorSubject<Project[]> = new BehaviorSubject(
    [] as Project[]
  );

  private authSub: Subscription | null = null;

  constructor(private httpService: HttpService) {
    this.init();
  }

  private init(): void {
    // Load projects after login
    this.authSub = this.httpService
      .getAuthenticationObs()
      .subscribe((value) => {
        if (null == value) {
          this.projects$.next([]);
        } else {
          this.getAllProjects().subscribe((projects) => {
            this.projects$.next(projects);
          });
        }
      });
  }

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
   * Returns all projects witch
   */
  getAllProjects(): Observable<Project[]> {
    return this.httpService.get<Project[]>('project/all');
  }

  /**
   * Returns all user of the projects
   */
  getProjectUsers(
    projectId: number,
    option: 'all' | 'participants' | 'scientists' = 'all'
  ): Observable<User[]> {
    return this.httpService.get<User[]>(`project/${projectId}/users/${option}`);
  }

  /**
   * Returns all user which are not in the project
   */
  getUsersNotInProject(projectId: number): Observable<User[]> {
    return this.httpService.get<User[]>(`project/${projectId}/other-users`);
  }

  /**
   * Add users to a project
   * @param projectId
   * @param userIds
   */
  addUsersToProject(projectId: number, userIds: number[]): Observable<void> {
    return this.httpService.post(`project/${projectId}/users/add`, { userIds });
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

  ngOnDestroy(): void {
    if (null != this.authSub) {
      this.authSub.unsubscribe();
    }
  }
}

export interface Project {
  id: number;
  start_date: number;
  end_date: number;
  invite_token: string;
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
