import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter, Routes } from '@angular/router';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { provideHttpClient } from '@angular/common/http';
import { AuthGuard } from './guards/auth.guard';
import { AuthService } from './services/auth.service';
import { TaskService } from './services/task.service';
import { TaskEffects } from './store/task/task.effects';
import { taskReducer } from './store/task/task.reducer';

/**
 * Application configuration - contains routes and providers
 * Centralizes the application's dependency injection setup
 */

// Define routes for lazy-loaded modules
const routes: Routes = [
  // Default route - redirects to tasks list
  { path: '', redirectTo: '/tasks', pathMatch: 'full' },
  
  // Tasks module - protected by AuthGuard
  { 
    path: 'tasks', 
    loadChildren: () => import('./features/tasks/tasks.module').then(m => m.TasksModule),
    canActivate: [AuthGuard] 
  },
  
  // Authentication module - public access
  { 
    path: 'login', 
    loadChildren: () => import('./features/auth/auth.module').then(m => m.AuthModule) 
  },
  
  // Wildcard route - redirects unknown paths to tasks
  { path: '**', redirectTo: '/tasks' }
];

/**
 * Application configuration object
 * Sets up providers for Angular's dependency injection system
 */
export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),                      // Sets up Angular Router
    provideStore({ tasks: taskReducer }),       // Configures NgRx store with task reducer
    provideEffects([TaskEffects]),              // Registers NgRx effects for tasks
    provideStoreDevtools({ maxAge: 25 }),       // Enables Redux DevTools for NgRx debugging
    provideHttpClient(),                         // Sets up HttpClient for API calls
    AuthService,                                 // Provides authentication service
    TaskService,                                 // Provides task service
    AuthGuard                                    // Provides route guard for protected routes
  ]
};
