import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay, tap } from 'rxjs/operators';
import { LoginAttempt, User } from '../models/user.model';
import { PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

/**
 * Authentication service - handles user login, logout and security
 * Implements account locking after multiple failed attempts
 */
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Configuration constants
  private readonly CORRECT_PASSWORD = 'Testpassw0rd!';  // Demo password for testing
  private readonly MAX_ATTEMPTS = 3;                    // Maximum allowed login attempts before locking
  private readonly LOCK_DURATION = 60 * 1000;           // Account lock duration (1 minute)

  // State management
  private loginAttemptsMap: Map<string, LoginAttempt> = new Map();  // Tracks login attempts by email
  private currentUserSubject = new BehaviorSubject<User | null>(null);  // Holds current user state
  private platformId = inject(PLATFORM_ID);  // For platform detection (browser vs server)

  // Observable for components to subscribe to user changes
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

  /**
   * Authenticates a user with email and password
   * Implements security features: account locking after failed attempts
   * @param email User's email
   * @param password User's password
   * @returns Observable with login result and message
   */
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

  /**
   * Logs out the current user
   * Removes user data from localStorage and updates currentUserSubject
   */
  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('currentUser');
    }
    this.currentUserSubject.next(null);
  }

  /**
   * Checks if a user is currently logged in
   * @returns boolean indicating login status
   */
  isLoggedIn(): boolean {
    return !!this.currentUserSubject.value;
  }

  /**
   * Gets or initializes a login attempt record for an email
   * @param email User's email
   * @returns LoginAttempt object
   */
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

  /**
   * Increments the failed attempt counter for an email
   * @param email User's email
   */
  private incrementFailedAttempt(email: string): void {
    const attempt = this.getLoginAttempt(email);
    attempt.incorrectAttempts += 1;
    attempt.lastAttemptTime = Date.now();
    this.loginAttemptsMap.set(email, attempt);
  }

  /**
   * Resets login attempts for an email after successful login
   * @param email User's email
   */
  private resetLoginAttempts(email: string): void {
    this.loginAttemptsMap.set(email, {
      email,
      incorrectAttempts: 0,
      lastAttemptTime: Date.now(),
      lockedUntil: null
    });
  }

  /**
   * Checks if an account is currently locked
   * @param attempt LoginAttempt object
   * @returns boolean indicating if account is locked
   */
  private isAccountLocked(attempt: LoginAttempt): boolean {
    if (!attempt.lockedUntil) return false;
    return Date.now() < attempt.lockedUntil;
  }
} 