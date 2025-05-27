import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { filter, take } from 'rxjs/operators';
import { CommonModule } from '@angular/common';

import { Task } from '../../../models/task.model';
import * as TaskActions from '../../../store/task/task.actions';
import * as TaskSelectors from '../../../store/task/task.selectors';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.component.html',
  styles: [],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule]
})
export class TaskFormComponent implements OnInit {
  taskForm: FormGroup;
  isEditMode = false;
  taskId: string | null = null;
  loading$: Observable<boolean>;
  submitting = false;

  constructor(
    private fb: FormBuilder,
    private store: Store,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {
    this.taskForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', [Validators.maxLength(250)]]
    });

    this.loading$ = this.store.select(TaskSelectors.selectTasksLoading);
  }

  ngOnInit(): void {
    this.taskId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.taskId;

    if (this.isEditMode && this.taskId) {
      this.store.dispatch(TaskActions.loadTask({ id: this.taskId }));
      this.store.select(TaskSelectors.selectSelectedTask)
        .pipe(
          filter(task => !!task),
          take(1)
        )
        .subscribe((task) => {
          if (task) {
            this.taskForm.patchValue({
              title: task.title,
              description: task.description
            });
          }
        });
    }
  }

  onSubmit(): void {
    if (this.taskForm.invalid || this.submitting) {
      return;
    }

    this.submitting = true;
    const formValues = this.taskForm.value;

    if (this.isEditMode && this.taskId) {
      this.store.dispatch(TaskActions.updateTask({
        id: this.taskId,
        updates: formValues
      }));
    } else {
      this.store.dispatch(TaskActions.addTask({
        task: formValues
      }));
    }

    // Navigate back after a delay
    setTimeout(() => {
      this.router.navigate(['/tasks']);
    }, 500);
  }

  get title() {
    return this.taskForm.get('title');
  }

  get description() {
    return this.taskForm.get('description');
  }

  navigateToList(): void {
    this.router.navigate(['/tasks']);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
} 