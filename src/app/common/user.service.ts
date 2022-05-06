import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor() {}

  // TODO
  getCurrentUser(): any {}

  /**
   * TODO
   */
  isCurrentUser(id: number): boolean {
    return false;
  }
}

// TODO wer kann was sehen?
export interface User {
  id: number;
  email?: string;
  validated?: boolean;
  blocked?: boolean;
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

export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  DIVERSE = 'DIVERSE',
}

export enum Role {
  USER = 'USER',
  SCIENTIST = 'SCIENTIST',
  ADMIN = 'ADMIN',
}
