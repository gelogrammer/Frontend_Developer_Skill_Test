import { createAction, props } from '@ngrx/store';
import { Task } from '../../models/task.model';

// Load tasks
export const loadTasks = createAction('[Task] Load Tasks');
export const loadTasksSuccess = createAction(
  '[Task] Load Tasks Success',
  props<{ tasks: Task[] }>()
);
export const loadTasksFailure = createAction(
  '[Task] Load Tasks Failure',
  props<{ error: any }>()
);

// Load single task
export const loadTask = createAction(
  '[Task] Load Task',
  props<{ id: string }>()
);
export const loadTaskSuccess = createAction(
  '[Task] Load Task Success',
  props<{ task: Task }>()
);
export const loadTaskFailure = createAction(
  '[Task] Load Task Failure',
  props<{ error: any }>()
);

// Add task
export const addTask = createAction(
  '[Task] Add Task',
  props<{ task: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'status'> }>()
);
export const addTaskSuccess = createAction(
  '[Task] Add Task Success',
  props<{ task: Task }>()
);
export const addTaskFailure = createAction(
  '[Task] Add Task Failure',
  props<{ error: any }>()
);

// Update task
export const updateTask = createAction(
  '[Task] Update Task',
  props<{ id: string, updates: Partial<Omit<Task, 'id' | 'createdAt'>> }>()
);
export const updateTaskSuccess = createAction(
  '[Task] Update Task Success',
  props<{ task: Task }>()
);
export const updateTaskFailure = createAction(
  '[Task] Update Task Failure',
  props<{ error: any }>()
);

// Mark task as completed
export const markTaskAsCompleted = createAction(
  '[Task] Mark Task As Completed',
  props<{ id: string }>()
);
export const markTaskAsCompletedSuccess = createAction(
  '[Task] Mark Task As Completed Success',
  props<{ task: Task }>()
);
export const markTaskAsCompletedFailure = createAction(
  '[Task] Mark Task As Completed Failure',
  props<{ error: any }>()
);

// Delete task
export const deleteTask = createAction(
  '[Task] Delete Task',
  props<{ id: string }>()
);
export const deleteTaskSuccess = createAction(
  '[Task] Delete Task Success',
  props<{ id: string }>()
);
export const deleteTaskFailure = createAction(
  '[Task] Delete Task Failure',
  props<{ error: any }>()
);

// Select Task
export const selectTask = createAction(
  '[Task] Select Task',
  props<{ task: Task | null }>()
); 