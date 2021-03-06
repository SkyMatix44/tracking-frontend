import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root',
})
export class NewsService {
  constructor(private httpService: HttpService) {}

  /**
   * Create a news
   */
  create(data: CreateNewsDto): Observable<News> {
    return this.httpService.post('news', data);
  }

  /**
   * Update a news
   */
  update(newsId: number, data: UpdateNewsDto): Observable<News> {
    return this.httpService.patch(`news/${newsId}`, data);
  }

  /**
   * Delete a news
   */
  delete(newsId: number): Observable<void> {
    return this.httpService.delete(`news/${newsId}`);
  }

  /**
   * Returns a news
   */
  get(newsId: number): Observable<News> {
    return this.httpService.get(`news/${newsId}`);
  }

  /**
   * Return all news from a project
   */
  getProjectNews(projectId: number): Observable<News[]> {
    return this.httpService.get(`news/project/${projectId}`);
  }
}

export interface News {
  id: number;
  created_at: Date;
  updated_at: Date | null;
  title: string;
  text: string;
  userId: number | null;
  user_firstname: string | null;
  user_lastname: string | null;
}

export interface CreateNewsDto {
  title: string;
  text: string;
  projectId: number;
  user_firstname: string | null;
  user_lastname: string | null;
}

export interface UpdateNewsDto {
  title: string;
  text: string;
}
