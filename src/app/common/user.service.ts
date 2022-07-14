import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Authentication } from './auth.service';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private httpService: HttpService) {}

  /**
   * Returns the current user
   */
  getCurrentUser(): User | null {
    const auth = this.httpService.getAuthentication();
    if (auth != null) {
      return auth.user;
    }

    return null;
  }

  /**
   * Checks if the given user id is the current user
   */
  isCurrentUser(id: number): boolean {
    const auth = this.httpService.getAuthentication();
    if (null != auth) {
      return id === auth.user.id;
    }

    return false;
  }

  /**
   * Change the password of the current user
   */
  changePassword(data: ChangePasswordDto): Observable<void> {
    return this.httpService.post('user/update/password', data);
  }

  /**
   * Change the email of the current user
   */
  changeEmail(data: ChangeEmailDto): Observable<void> {
    return this.httpService.post('user/update/email', data);
  }

  /**
   * Block an user
   */
  blockUser(userId: number): Observable<void> {
    return this.httpService.post(`user/${userId}/block`, null);
  }

  /**
   * Unblock an user
   */
  unblockUser(userId: number): Observable<void> {
    return this.httpService.post(`user/${userId}/unblock`, null);
  }

  /**
   * Returns all users
   */
  getAll(): Observable<User[]> {
    return this.httpService.get('user/all');
  }

  /**
   * Update an user (only for admins)
   */
  updateUserAsAdmin(
    userId: number,
    data: UpdateUserAdminDto
  ): Observable<User> {
    return this.httpService.post(`user/${userId}/update`, data);
  }

  /**
   * Update the current user
   */
  update(data: UpdateUserDto): Observable<User> {
    return this.httpService.patch<User>(`user/update`, data).pipe(
      map((user: User): User => {
        this.updateAuthData(user);
        return user;
      })
    );
  }

  /**
   * Create a new user
   */
  create(data: CreateUserDto): Observable<User> {
    return this.httpService.post(`user/create`, data);
  }

  /**
   * Update auth data
   */
  private updateAuthData(newUserData: Partial<User>): void {
    const auth: Authentication | null = this.httpService.getAuthentication();
    if (null != auth) {
      const newAuth: Authentication = {
        accessToken: auth.accessToken,
        user: {
          ...auth.user,
          ...newUserData,
        },
      };

      this.httpService.setAuthentication(newAuth);
    }
  }
}

export interface User {
  id: number;
  email: string;
  role: Role;
  firstName: string;
  lastName: string;
  validated?: boolean;
  blocked?: boolean;
  gender?: Gender;
  address?: string;
  birthday?: string;
  height?: number; // im cm
  weight?: number; // in kg
  universityId?: number;
}

export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  DIVERSE = 'DIVERSE',
}

export enum Role {
  USER = 'USER',
  SCIENTIST = 'SCIENTIST',
  ADMIN = 'ADMIN',
  Role = 'Role',
}

export interface ChangePasswordDto {
  password: string;
  newPassword: string;
}

export interface ChangeEmailDto {
  newEmail: string;
}

export interface UpdateUserAdminDto {
  email?: string;
  firstName?: string;
  lastName?: string;
  gender?: Gender;
  address?: string;
  birthday?: number;
  height?: number; // in cm
  weight?: number; // in kg
  validated?: boolean;
  universityId?: number;
  role?: Role;
}

export interface UpdateUserDto {
  firstName?: string;
  lastName?: string;
  gender?: Gender;
  address?: string;
  birthday?: number;
  height?: number; // in cm
  weight?: number; // inm kg
  universityId?: number;
}

export interface CreateUserDto {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  gender?: Gender;
  address?: string;
  birthday?: number;
  height?: number; // in cm
  weight?: number; // in kg
  universityId?: number;
  role: Role;
}
