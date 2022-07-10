import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { HttpService } from './http.service';
import { Gender, Role, User } from './user.service';

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
    return this.httpService.postWithoutAuth<void>('auth/signup', data);
  }

  /**
   * Logout
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

  /**
   * Return true if the user is logged in
   */
  isLoggedIn(): Observable<boolean> {
    return this.httpService.getAuthenticationObs().pipe(
      map((auth) => {
        return auth !== null;
      })
    );
  }

  /**
   * Validate a user
   */
  validate(email: string, token: string): Observable<void> {
    return this.httpService
      .postWithoutAuth<Authentication>(
        `auth/confirm/email/${email}/${token}`,
        {}
      )
      .pipe(
        map((result) => {
          this.setAuthentication(result);
        })
      );
  }

  /**
   * Reset the password
   */
  resetPassword(data: ResetPasswordDto): Observable<void> {
    return this.httpService.post('auth/password/reset', data);
  }

  /**
   * Reset the password
   */
  changePassword(data: ChangePasswordDto): Observable<void> {
    return this.httpService.post('auth/password/change', data);
  }

  /**
   * Confirm new email
   */
  confirmNewEmail(email: string, token: string): Observable<void> {
    return this.httpService.post(
      `auth/confirm/new-email/${email}/${token}`,
      null
    );
  }
}

export interface Authentication {
  accessToken: string;
  user: User;
}

export interface SignUpDto {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  gender?: Gender;
  address?: string;
  birthday?: number;
  height?: number;
  weight?: number;
  role: Role;
  universityId?: number;
}

export interface ResetPasswordDto {
  email: string;
}

export interface ChangePasswordDto {
  email: string;
  newPassword: string;
  token: string;
}
