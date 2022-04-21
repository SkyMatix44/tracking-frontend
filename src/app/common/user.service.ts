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
