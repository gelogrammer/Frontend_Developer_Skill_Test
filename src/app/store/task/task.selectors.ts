import { createFeatureSelector, createSelector } from '@ngrx/store';
import { TaskState } from './task.reducer';

export const selectTaskState = createFeatureSelector<TaskState>('tasks');

export const selectAllTasks = createSelector(
  selectTaskState,
  (state: TaskState) => state.tasks
);

export const selectPendingTasks = createSelector(
  selectAllTasks,
  (tasks) => tasks.filter(task => task.status === 'pending')
);

export const selectCompletedTasks = createSelector(
  selectAllTasks,
  (tasks) => tasks.filter(task => task.status === 'completed')
);

export const selectSelectedTask = createSelector(
  selectTaskState,
  (state: TaskState) => state.selectedTask
);

export const selectTasksLoading = createSelector(
  selectTaskState,
  (state: TaskState) => state.loading
);

export const selectTasksError = createSelector(
  selectTaskState,
  (state: TaskState) => state.error
); 