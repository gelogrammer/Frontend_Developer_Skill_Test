import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { TaskListComponent } from './task-list/task-list.component';
import { TaskDetailComponent } from './task-detail/task-detail.component';
import { TaskFormComponent } from './task-form/task-form.component';

const routes: Routes = [
  { path: '', component: TaskListComponent },
  { path: 'new', component: TaskFormComponent },
  { path: ':id', component: TaskDetailComponent },
  { path: ':id/edit', component: TaskFormComponent }
];

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    TaskListComponent,
    TaskDetailComponent,
    TaskFormComponent
  ]
})
export class TasksModule { } 