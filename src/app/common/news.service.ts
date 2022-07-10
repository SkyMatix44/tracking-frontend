import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root',
})
export class NewsService {
  constructor(private httpService: HttpService) {}

  create(data: CreateNewsDto): Observable<News> {
    return this.httpService.post('news', data);
  }

  update(newsId: number, data: UpdateNewsDto): Observable<News> {
    return this.httpService.patch(`news/${newsId}`, data);
  }

  delete(newsId: number): Observable<void> {
    return this.httpService.delete(`news/${newsId}`);
  }

  get(newsId: number): Observable<News> {
    return this.httpService.get(`news/${newsId}`);
  }

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
}

export interface CreateNewsDto {
  title: string;
  text: string;
  projectId: number;
}

export interface UpdateNewsDto {
  title: string;
  text: string;
}
