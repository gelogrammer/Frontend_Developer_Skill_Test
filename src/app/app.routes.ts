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
  
  // Task detail view - lazy loaded
  { 
    path: 'tasks/:id', 
    loadComponent: () => import('./features/tasks/task-detail/task-detail.component').then(m => m.TaskDetailComponent) 
  }
];
