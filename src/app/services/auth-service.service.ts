// auth.service.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private tokenkey: string="";

  getToken(): string | null {
    return localStorage.getItem(this.tokenkey);
  }

  setToken(token: string): void {
    localStorage.setItem(this.tokenkey, token);
  }

  clearToken(): void {
    localStorage.removeItem(this.tokenkey);
  }

}
