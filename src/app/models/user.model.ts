export interface User {
  email: string;
  isAuthenticated: boolean;
}

export interface LoginAttempt {
  email: string;
  incorrectAttempts: number;
  lastAttemptTime: number;
  lockedUntil: number | null;
} 