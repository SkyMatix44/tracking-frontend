import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { HttpService } from './http.service';
import { Gender } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private httpService: HttpService) {}

  /**
   * Login
   */
  login(email: string, password: string): Observable<void> {
    return this.httpService
      .postWithoutAuth<Authentication>('auth/signin', { email, password })
      .pipe(
        map((result) => {
          this.setAuthentication(result);
        })
      );
  }

  /**
   * Register
   */
  register(data: SignUpDto): Observable<void> {
    return this.httpService
      .postWithoutAuth<Authentication>('auth/signup', data)
      .pipe(
        map((result) => {
          this.setAuthentication(result);
        })
      );
  }

  /**
   * TODO
   */
  logout(): void {
    this.setAuthentication(null);
  }

  /**
   * Set User Authentication
   * @param auth
   */
  setAuthentication(auth: Authentication | null): void {
    this.httpService.setAuthentication(auth);
  }

  /**
   * Return the user authentication
   */
  getAuthentication(): Authentication | null {
    return this.httpService.getAuthentication();
  }
}

export interface Authentication {
  access_token: string;
}

export interface SignUpDto {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  gender: Gender;
  address: string;
  birthday: number;
  height: number;
  weight: number;
}
