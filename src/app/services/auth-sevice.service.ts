import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthSeviceService {

  // 01234567890

  private authKey: string | null = null;

  setAuthKey(key: string) {
    this.authKey = key;
  }

  getAuthKey(): string | null {
    return this.authKey;
  }
}
