import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { AuthResponse, LoginRequest, RegisterRequest, User } from '../models';
import { environment } from '../../env';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiBaseUrl;
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {
    // Restore session immediately and synchronously
    this.restoreSessionSync();
    console.log('AuthService initialized');
  }

  private restoreSessionSync(): void {
    try {
      // Check for stored token in localStorage
      const token = localStorage.getItem('auth_token');
      console.log('📌 RestoreSessionSync - Token in storage:', !!token);
      
      if (token) {
        // Token exists, try to restore user
        const userStorage = localStorage.getItem('user');
        console.log('📌 User in storage:', !!userStorage);
        
        if (userStorage) {
          try {
            const user = JSON.parse(userStorage);
            if (user && user.email) {
              console.log('✅ Session restored successfully for:', user.email);
              this.currentUserSubject.next(user);
              return;
            }
          } catch (e) {
            console.warn('❌ Failed to parse user from storage:', e);
            localStorage.removeItem('user');
            localStorage.removeItem('auth_token');
          }
        }
        
        // Token exists but user data is invalid
        console.warn('❌ Token exists but user data invalid, clearing all storage');
        this.logout();
      } else {
        console.log('ℹ️ No token in storage, user not authenticated');
      }
    } catch (error) {
      console.error('❌ Error during session restore:', error);
      localStorage.removeItem('user');
      localStorage.removeItem('auth_token');
    }
  }

  login(credentials: LoginRequest): Observable<AuthResponse> {
    console.log('Logging in with email:', credentials.email);
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/login`, credentials)
      .pipe(
        tap(response => {
          console.log('✅ Login successful, response:', response);
          // Extract user data from flat response structure
          const user: User = {
            id: response.id,
            email: response.email,
            role: response.role
          };
          console.log('💾 Storing token and user:', user);
          this.storeToken(response.token);
          this.storeUser(user);
          this.currentUserSubject.next(user);
        }),
        catchError(error => this.handleError(error))
      );
  }

  register(data: RegisterRequest): Observable<AuthResponse> {
    console.log('Registering with email:', data.email);
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/register`, data)
      .pipe(
        tap(response => {
          console.log('✅ Registration successful, response:', response);
          // Extract user data from flat response structure
          const user: User = {
            id: response.id,
            email: response.email,
            role: response.role
          };
          console.log('💾 Storing token and user:', user);
          this.storeToken(response.token);
          this.storeUser(user);
          this.currentUserSubject.next(user);
        }),
        catchError(error => this.handleError(error))
      );
  }

  logout(): void {
    console.log('Logging out, clearing token and user');
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    this.currentUserSubject.next(null);
    // Navigate to login page
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    try {
      const token = localStorage.getItem('auth_token');
      if (token) {
        console.log('🔑 Token found in localStorage (length:', token.length, ')');
        return token;
      } else {
        console.log('🔑 No token in localStorage');
        return null;
      }
    } catch (error) {
      console.error('🔑 Error accessing localStorage:', error);
      return null;
    }
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    const authenticated = !!token;
    console.log('🔐 isAuthenticated() =', authenticated);
    return authenticated;
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  private storeToken(token: string): void {
    try {
      console.log('💾 Storing token in localStorage (length:', token.length, ')');
      localStorage.setItem('auth_token', token);
      const verify = localStorage.getItem('auth_token');
      if (verify) {
        console.log('✅ Token stored successfully and verified');
      } else {
        console.error('❌ Token storage failed - could not verify');
      }
    } catch (error) {
      console.error('❌ Error storing token:', error);
    }
  }

  private storeUser(user: User): void {
    try {
      const userData = JSON.stringify(user);
      console.log('💾 Storing user in localStorage:', user.email);
      localStorage.setItem('user', userData);
      const verify = localStorage.getItem('user');
      if (verify) {
        console.log('✅ User stored successfully and verified');
      } else {
        console.error('❌ User storage failed - could not verify');
      }
    } catch (error) {
      console.error('❌ Error storing user:', error);
    }
  }

  private getUserFromStorage(): User | null {
    try {
      const user = localStorage.getItem('user');
      
      // Handle null, undefined, or empty string
      if (!user) {
        console.log('No user found in localStorage');
        return null;
      }
      
      // Try to parse the JSON
      const parsedUser = JSON.parse(user);
      
      // Validate it's a proper User object
      if (parsedUser && typeof parsedUser === 'object' && parsedUser.email) {
        return parsedUser as User;
      }
      
      // Invalid user object, clear it
      console.warn('Invalid user object in localStorage, clearing...');
      localStorage.removeItem('user');
      return null;
    } catch (error) {
      console.error('Error parsing user from localStorage:', error);
      // Clear corrupted data
      localStorage.removeItem('user');
      localStorage.removeItem('auth_token');
      return null;
    }
  }

  private handleError(error: any) {
    console.error('Auth error:', error);
    return throwError(() => error.error?.message || 'An error occurred');
  }
}

