import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Task } from '../../../models/task.model';
import * as TaskActions from '../../../store/task/task.actions';
import * as TaskSelectors from '../../../store/task/task.selectors';
import { ConfirmationModalComponent } from '../../../shared/components/confirmation-modal/confirmation-modal.component';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-task-detail',
  template: `
    <div class="min-h-screen bg-purple-50">
      <!-- Header -->
      <header class="bg-white py-3 px-4 shadow-sm">
        <div class="flex justify-between items-center max-w-md mx-auto">
          <div class="flex items-center">
            <img src="assets/logo2.png" alt="Hexalog Logo" class="h-7">
          </div>
          <div class="flex items-center space-x-3">
            <button
              (click)="logout()"
              class="touch-manipulation"
            >
              <img src="assets/SignOut.png" alt="Sign Out" class="h-8">
            </button>
            <button 
              (click)="navigateToList()" 
              class="text-purple-600 border border-purple-200 px-4 py-1 rounded-full text-sm font-medium hover:bg-purple-100 active:bg-purple-200 touch-manipulation"
            >
              Back
            </button>
          </div>
        </div>
      </header>

      <!-- Main Content -->
      <main class="max-w-md mx-auto px-4 py-6 pb-20">
        <div class="mb-6">
          <h1 class="text-2xl font-bold bg-gradient-to-r from-[#DA68A8] to-[#5556FF] text-transparent bg-clip-text">
            Task Details
          </h1>
        </div>

        <div *ngIf="loading$ | async" class="flex justify-center my-6">
          <div class="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] text-purple-600 motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
        </div>

        <div *ngIf="task$ | async as task" class="bg-white rounded-lg shadow-sm p-6">
          <div class="mb-4">
            <h2 class="text-xl font-semibold text-gray-800">{{ task.title }}</h2>
            <div class="mt-1 text-sm text-gray-500">Status: 
              <span [ngClass]="task.status === 'completed' ? 'text-green-600' : 'text-orange-500'">
                {{ task.status | titlecase }}
              </span>
            </div>
          </div>

          <div class="mb-6">
            <h3 class="text-sm font-medium text-gray-700 mb-1">Description</h3>
            <p class="text-gray-600">{{ task.description }}</p>
          </div>

          <div class="flex gap-2">
            <a 
              [routerLink]="['/tasks', task.id, 'edit']" 
              class="flex-1 py-2 bg-purple-100 text-purple-600 rounded-md font-medium text-center"
            >
              Edit Task
            </a>
            <button 
              *ngIf="task.status !== 'completed'"
              (click)="openCompleteModal(task.id, task.title)"
              class="flex-1 py-2 bg-green-100 text-green-600 rounded-md font-medium"
            >
              Mark as Done
            </button>
            <button 
              (click)="openDeleteModal(task.id, task.title)"
              class="flex-1 py-2 bg-red-100 text-red-600 rounded-md font-medium"
            >
              Delete
            </button>
          </div>
        </div>
        
        <!-- Delete Confirmation Modal -->
        <app-confirmation-modal
          [isOpen]="isDeleteModalOpen"
          title="Delete"
          [taskName]="currentTaskName"
          modalType="delete"
          (confirm)="confirmDelete()"
          (cancel)="cancelDelete()"
        ></app-confirmation-modal>
        
        <!-- Complete Confirmation Modal -->
        <app-confirmation-modal
          [isOpen]="isCompleteModalOpen"
          title="Mark As Done"
          [taskName]="currentTaskName"
          modalType="complete"
          (confirm)="confirmComplete()"
          (cancel)="cancelComplete()"
        ></app-confirmation-modal>
      </main>
    </div>
  `,
  styles: [],
  standalone: true,
  imports: [CommonModule, RouterModule, ConfirmationModalComponent]
})
export class TaskDetailComponent implements OnInit {
  task$: Observable<Task | null>;
  loading$: Observable<boolean>;
  
  // Modal properties
  isDeleteModalOpen = false;
  isCompleteModalOpen = false;
  taskToDelete: string | null = null;
  taskToComplete: string | null = null;
  currentTaskName = '';
  
  constructor(
    private store: Store,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {
    this.task$ = this.store.select(TaskSelectors.selectSelectedTask);
    this.loading$ = this.store.select(TaskSelectors.selectTasksLoading);
  }

  ngOnInit(): void {
    const taskId = this.route.snapshot.paramMap.get('id');
    if (taskId) {
      this.store.dispatch(TaskActions.loadTask({ id: taskId }));
    }
  }

  openCompleteModal(taskId: string, taskName: string): void {
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
  openDeleteModal(taskId: string, taskName: string): void {
    this.taskToDelete = taskId;
    this.currentTaskName = taskName;
    this.isDeleteModalOpen = true;
  }
  
  // Confirm task deletion
  confirmDelete(): void {
    if (this.taskToDelete) {
      this.store.dispatch(TaskActions.deleteTask({ id: this.taskToDelete }));
      this.navigateToList();
    }
  }
  
  // Cancel task deletion
  cancelDelete(): void {
    this.taskToDelete = null;
  }

  navigateToList(): void {
    this.router.navigate(['/tasks']);
  }
  
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
} 