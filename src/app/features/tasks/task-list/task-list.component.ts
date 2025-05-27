import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Task } from '../../../models/task.model';
import * as TaskActions from '../../../store/task/task.actions';
import * as TaskSelectors from '../../../store/task/task.selectors';
import { AuthService } from '../../../services/auth.service';
import { ConfirmationModalComponent } from '../../../shared/components/confirmation-modal/confirmation-modal.component';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styles: [],
  standalone: true,
  imports: [CommonModule, RouterModule, ConfirmationModalComponent]
})
export class TaskListComponent implements OnInit {
  pendingTasks$: Observable<Task[]>;
  completedTasks$: Observable<Task[]>;
  loading$: Observable<boolean>;
  
  // Modal properties
  isDeleteModalOpen = false;
  isCompleteModalOpen = false;
  taskToDelete: string | null = null;
  taskToComplete: string | null = null;
  currentTaskName = '';
  
  constructor(
    private store: Store,
    private router: Router,
    private authService: AuthService
  ) {
    this.pendingTasks$ = this.store.select(TaskSelectors.selectPendingTasks);
    this.completedTasks$ = this.store.select(TaskSelectors.selectCompletedTasks);
    this.loading$ = this.store.select(TaskSelectors.selectTasksLoading);
  }

  ngOnInit(): void {
    this.store.dispatch(TaskActions.loadTasks());
  }

  viewTaskDetails(taskId: string): void {
    this.router.navigate(['/tasks', taskId]);
  }

  markAsCompleted(taskId: string, event: Event, taskName: string): void {
    event.stopPropagation();
    this.taskToComplete = taskId;
    this.currentTaskName = taskName;
    this.isCompleteModalOpen = true;
  }
  
  confirmComplete(): void {
    if (this.taskToComplete) {
      this.store.dispatch(TaskActions.markTaskAsCompleted({ id: this.taskToComplete }));
      this.taskToComplete = null;
    }
  }
  
  cancelComplete(): void {
    this.taskToComplete = null;
  }

  // Open delete confirmation modal
  openDeleteModal(taskId: string, event: Event, taskName: string): void {
    event.stopPropagation();
    this.taskToDelete = taskId;
    this.currentTaskName = taskName;
    this.isDeleteModalOpen = true;
  }
  
  // Confirm task deletion
  confirmDelete(): void {
    if (this.taskToDelete) {
      this.store.dispatch(TaskActions.deleteTask({ id: this.taskToDelete }));
      this.taskToDelete = null;
    }
  }
  
  // Cancel task deletion
  cancelDelete(): void {
    this.taskToDelete = null;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
} 