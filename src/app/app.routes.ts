import { Routes } from '@angular/router';
import { TaskListComponent } from './features/tasks/task-list/task-list.component';

/**
 * Application routes configuration
 * Implements lazy loading for most routes to improve initial load performance
 */
export const routes: Routes = [
  // Default route - redirects to tasks list
  { path: '', redirectTo: '/tasks', pathMatch: 'full' },
  
  // Main tasks list - eagerly loaded as it's the primary view
  { path: 'tasks', component: TaskListComponent },
  
  // Create new task form - lazy loaded
  { 
    path: 'tasks/new', 
    loadComponent: () => import('./features/tasks/task-form/task-form.component').then(m => m.TaskFormComponent) 
  },
  
  // Task detail view - lazy loaded
  { 
    path: 'tasks/:id', 
    loadComponent: () => import('./features/tasks/task-detail/task-detail.component').then(m => m.TaskDetailComponent) 
  },
  
  // Edit task form - lazy loaded, reuses the task form component
  { 
    path: 'tasks/:id/edit', 
    loadComponent: () => import('./features/tasks/task-form/task-form.component').then(m => m.TaskFormComponent) 
  }
];
