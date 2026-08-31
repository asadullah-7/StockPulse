import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { environment } from '../../environments/environment';
import { Login } from '../models/login';
import { Register } from '../models/register';
import { LoginResponse } from '../models/login-response';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly apiUrl = environment.baseUrl || (environment as any).baseUrl;

  constructor(
    private http: HttpClient, 
    private router: Router
  ) { }

  register(model: Register): Observable<any> {
    return this.http.post(`${this.apiUrl}/Auth/register`, model);
  }

  login(model: Login): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/Auth/login`, model);
  }

  saveToken(token: string): void {
    localStorage.setItem('token', token);
  }

  getToken(): string | null {
    const token = localStorage.getItem('token');
    if (!token || token === 'undefined' || token === 'null' || token.trim() === '') {
      return null;
    }
    return token;
  }

  saveUser(user: any): void {
    localStorage.setItem('user', JSON.stringify(user));
  }

  getUser(): any {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  } 

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.clear();
    this.router.navigate(['/login']);
  }

  getDecodedToken(): any {
    const token = this.getToken();
    if (!token) return null;
    try {
      return jwtDecode(token);
    } catch (e) {
      this.logout();
      return null;
    }
  }

  isLoggedIn(): boolean {
    const decoded = this.getDecodedToken();
    if (!decoded || !decoded.exp) {
      return false;
    }
    return decoded.exp * 1000 > Date.now();
  }

  // 🎯 STRICT ASP.NET CORE ROLE EXTRACTOR
  getRoles(): string[] {
    const decoded = this.getDecodedToken();
    if (!decoded) return [];
    
    // ASP.NET Core standard claim type key
    const roleClaimKey = 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role';
    const roles = decoded[roleClaimKey] || decoded['role'] || decoded['Role'] || decoded['roles'];

    if (!roles) return [];
    return Array.isArray(roles) ? roles : [roles];
  }

  hasRole(requiredRole: string): boolean {
    const roles = this.getRoles();
    return roles.some(r => r.toString().toLowerCase() === requiredRole.toLowerCase());
  }
}