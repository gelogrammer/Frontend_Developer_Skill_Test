import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule]
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  errorMessage: string = '';
  isLoading: boolean = false;
  
  // Variables for tracking login attempts
  incorrectAttempts: Map<string, number> = new Map();
  isLoginDisabled: boolean = false;
  lockoutTimeRemaining: number = 0;
  lockoutTimerId: any;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    // Redirect if already logged in
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/tasks']);
      return;
    }

    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid || this.isLoginDisabled) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const { email, password } = this.loginForm.value;

    this.authService.login(email, password).subscribe({
      next: (result) => {
        this.isLoading = false;
        if (result.success) {
          this.incorrectAttempts.delete(email); // Reset attempts on successful login
          this.router.navigate(['/tasks']);
        } else {
          this.handleFailedLoginAttempt(email);
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.handleFailedLoginAttempt(email);
        console.error('Login error:', error);
      }
    });
  }

  private handleFailedLoginAttempt(email: string): void {
    const currentAttempts = (this.incorrectAttempts.get(email) || 0) + 1;
    this.incorrectAttempts.set(email, currentAttempts);
    
    if (currentAttempts >= 3) {
      this.errorMessage = 'Too many failed login attempts. Please try again in 1 minute.';
      this.isLoginDisabled = true;
      this.lockoutTimeRemaining = 60;
      
      // Start the countdown timer
      this.startLockoutTimer();
    } else {
      this.errorMessage = `Invalid username or password. ${3 - currentAttempts} attempts remaining before timeout.`;
    }
  }

  private startLockoutTimer(): void {
    // Clear any existing timer
    if (this.lockoutTimerId) {
      clearInterval(this.lockoutTimerId);
    }
    
    this.lockoutTimerId = setInterval(() => {
      this.lockoutTimeRemaining--;
      
      if (this.lockoutTimeRemaining <= 0) {
        // Unlock after timeout
        this.isLoginDisabled = false;
        this.errorMessage = '';
        clearInterval(this.lockoutTimerId);
        
        // Reset attempts for all users
        this.incorrectAttempts.clear();
      }
    }, 1000);
  }

  openForgotPasswordPopup(): void {
    const width = 600;
    const height = 400;
    const left = (window.innerWidth - width) / 2;
    const top = (window.innerHeight - height) / 2;
    
    window.open('https://www.google.com', 'forgotPassword', 
      `width=${width},height=${height},top=${top},left=${left}`);
  }
} 