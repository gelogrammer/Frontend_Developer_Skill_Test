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

// Define routes
const routes: Routes = [
  { path: '', redirectTo: '/tasks', pathMatch: 'full' },
  { 
    path: 'tasks', 
    loadChildren: () => import('./features/tasks/tasks.module').then(m => m.TasksModule),
    canActivate: [AuthGuard] 
  },
  { 
    path: 'login', 
    loadChildren: () => import('./features/auth/auth.module').then(m => m.AuthModule) 
  },
  { path: '**', redirectTo: '/tasks' }
];

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideStore({ tasks: taskReducer }),
    provideEffects([TaskEffects]),
    provideStoreDevtools({ maxAge: 25 }),
    provideHttpClient(),
    AuthService,
    TaskService,
    AuthGuard
  ]
};
