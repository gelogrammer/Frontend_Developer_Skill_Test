import { Routes } from '@angular/router';
import { TaskListComponent } from './features/tasks/task-list/task-list.component';

export const routes: Routes = [
  { path: '', redirectTo: '/tasks', pathMatch: 'full' },
  { path: 'tasks', component: TaskListComponent },
  { 
    path: 'tasks/new', 
    loadComponent: () => import('./features/tasks/task-form/task-form.component').then(m => m.TaskFormComponent) 
  },
  { 
    path: 'tasks/:id', 
    loadComponent: () => import('./features/tasks/task-detail/task-detail.component').then(m => m.TaskDetailComponent) 
  },
  { 
    path: 'tasks/:id/edit', 
    loadComponent: () => import('./features/tasks/task-form/task-form.component').then(m => m.TaskFormComponent) 
  }
];
