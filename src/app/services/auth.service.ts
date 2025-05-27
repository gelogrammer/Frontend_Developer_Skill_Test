import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay, tap } from 'rxjs/operators';
import { LoginAttempt, User } from '../models/user.model';
import { PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly CORRECT_PASSWORD = 'Testpassw0rd!';
  private readonly MAX_ATTEMPTS = 3;
  private readonly LOCK_DURATION = 60 * 1000; // 1 minute in milliseconds

  private loginAttemptsMap: Map<string, LoginAttempt> = new Map();
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  private platformId = inject(PLATFORM_ID);

  currentUser$: Observable<User | null> = this.currentUserSubject.asObservable();

  constructor() {
    // Check if user is already logged in (from localStorage)
    if (isPlatformBrowser(this.platformId)) {
      const savedUser = localStorage.getItem('currentUser');
      if (savedUser) {
        this.currentUserSubject.next(JSON.parse(savedUser));
      }
    }
  }

  login(email: string, password: string): Observable<{ success: boolean; message: string }> {
    // Check if account is locked
    const loginAttempt = this.getLoginAttempt(email);
    if (this.isAccountLocked(loginAttempt)) {
      const remainingTime = Math.ceil((loginAttempt.lockedUntil! - Date.now()) / 1000);
      return of({
        success: false,
        message: `Account is locked. Please try again in ${remainingTime} seconds.`
      });
    }

    // Simulate API call with a delay
    return of({ success: password === this.CORRECT_PASSWORD, message: '' }).pipe(
      delay(800),
      tap(result => {
        if (result.success) {
          // Reset login attempts on successful login
          this.resetLoginAttempts(email);
          
          // Set user as authenticated
          const user: User = {
            email,
            isAuthenticated: true
          };
          
          // Save to localStorage and update the subject
          if (isPlatformBrowser(this.platformId)) {
            localStorage.setItem('currentUser', JSON.stringify(user));
          }
          this.currentUserSubject.next(user);
          
          result.message = 'Login successful';
        } else {
          // Increment failed attempts
          this.incrementFailedAttempt(email);
          
          // Check if account should be locked
          const updatedAttempt = this.getLoginAttempt(email);
          if (updatedAttempt.incorrectAttempts >= this.MAX_ATTEMPTS) {
            updatedAttempt.lockedUntil = Date.now() + this.LOCK_DURATION;
            this.loginAttemptsMap.set(email, updatedAttempt);
            
            result.message = `Too many failed attempts. Account locked for ${this.LOCK_DURATION / 1000} seconds.`;
          } else {
            result.message = `Invalid credentials. ${this.MAX_ATTEMPTS - updatedAttempt.incorrectAttempts} attempts remaining.`;
          }
        }
      })
    );
  }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('currentUser');
    }
    this.currentUserSubject.next(null);
  }

  isLoggedIn(): boolean {
    return !!this.currentUserSubject.value;
  }

  private getLoginAttempt(email: string): LoginAttempt {
    if (!this.loginAttemptsMap.has(email)) {
      this.loginAttemptsMap.set(email, {
        email,
        incorrectAttempts: 0,
        lastAttemptTime: 0,
        lockedUntil: null
      });
    }
    return this.loginAttemptsMap.get(email)!;
  }

  private incrementFailedAttempt(email: string): void {
    const attempt = this.getLoginAttempt(email);
    attempt.incorrectAttempts += 1;
    attempt.lastAttemptTime = Date.now();
    this.loginAttemptsMap.set(email, attempt);
  }

  private resetLoginAttempts(email: string): void {
    this.loginAttemptsMap.set(email, {
      email,
      incorrectAttempts: 0,
      lastAttemptTime: Date.now(),
      lockedUntil: null
    });
  }

  private isAccountLocked(attempt: LoginAttempt): boolean {
    if (!attempt.lockedUntil) return false;
    return Date.now() < attempt.lockedUntil;
  }
} 