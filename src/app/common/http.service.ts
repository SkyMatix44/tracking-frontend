import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Authentication } from './auth.service';
import { APP_URL } from './config';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  private auth: Authentication | null = null;

  constructor(private httpClient: HttpClient) {}

  /**
   * Send a Get-Request with authentication
   * @param url URL of the request
   * @param responseType Response type (default: `json`)
   */
  get<T>(url: string, responseType: any = 'json'): Observable<T> {
    return this.httpClient.get<T>(this.buildUrl(url), {
      headers: this.buildHeaders(),
      responseType,
    });
  }

  /**
   * Send a Post-Request with authentication
   * @param url URL of the request
   * @param responseType Response type (default: `json`)
   */
  post<T>(url: string, data: any): Observable<T> {
    return this.httpClient.post<T>(this.buildUrl(url), data, {
      headers: this.buildHeaders(),
    });
  }

  /**
   * Send a Put-Request with authentication
   * @param url URL of the request
   * @param responseType Response type (default: `json`)
   */
  put<T>(url: string, data: any): Observable<T> {
    return this.httpClient.put<T>(this.buildUrl(url), data, {
      headers: this.buildHeaders(),
    });
  }

  /**
   * Send a Delete-Request with authentication
   * @param url URL of the request
   * @param responseType Response type (default: `json`)
   */
  delete<T>(url: string): Observable<T> {
    return this.httpClient.delete<T>(this.buildUrl(url), {
      headers: this.buildHeaders(),
    });
  }

  /**
   * Send a Patch-Request with authentication
   * @param url URL of the request
   * @param responseType Response type (default: `json`)
   */
  patch<T>(url: string, data: any): Observable<T> {
    return this.httpClient.patch<T>(this.buildUrl(url), data, {
      headers: this.buildHeaders(),
    });
  }

  /**
   * Send a Post-Request without authentication
   * @param url URL of the request
   * @param responseType Response type (default: `json`)
   */
  postWithoutAuth<T>(url: string, data: any): Observable<T> {
    return this.httpClient.post<T>(this.buildUrl(url), data);
  }

  /**
   * Set User Authentication
   * @param auth
   */
  setAuthentication(auth: Authentication | null): void {
    this.auth = auth;
  }

  /**
   * Return the user authentication
   */
  getAuthentication(): Authentication | null {
    return this.auth;
  }

  /**
   * Return the complete url for the current system
   */
  private buildUrl(urlPath: string): string {
    let a = `${APP_URL}/${urlPath}`;
    console.log(a);
    return a;
  }

  /**
   * Build the header for a request
   */
  private buildHeaders(): HttpHeaders {
    const auth = this.getAuthentication();
    if (null != auth) {
      return new HttpHeaders({
        // 'Content-Type': 'application/json',
        Authorization: `Bearer ${auth.access_token}`,
      });
    }
    throw new Error('No Auth');
  }
}
