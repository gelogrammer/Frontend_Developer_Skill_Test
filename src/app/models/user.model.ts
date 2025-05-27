/**
 * User interface - defines the structure of a user in the application
 */
export interface User {
  email: string;               // User's email address, used as the identifier
  isAuthenticated: boolean;    // Flag indicating if the user is currently authenticated
}

/**
 * LoginAttempt interface - tracks login attempts for security purposes
 */
export interface LoginAttempt {
  email: string;                // User's email address
  incorrectAttempts: number;    // Count of incorrect login attempts
  lastAttemptTime: number;      // Timestamp of the last login attempt
  lockedUntil: number | null;   // Timestamp until which the account is locked, or null if not locked
} 