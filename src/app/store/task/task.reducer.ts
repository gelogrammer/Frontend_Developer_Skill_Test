import { createReducer, on } from '@ngrx/store';
import { Task } from '../../models/task.model';
import * as TaskActions from './task.actions';

export interface TaskState {
  tasks: Task[];
  selectedTask: Task | null;
  loading: boolean;
  error: any;
}

export const initialState: TaskState = {
  tasks: [],
  selectedTask: null,
  loading: false,
  error: null
};

export const taskReducer = createReducer(
  initialState,
  
  // Load tasks
  on(TaskActions.loadTasks, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(TaskActions.loadTasksSuccess, (state, { tasks }) => ({
    ...state,
    tasks,
    loading: false
  })),
  on(TaskActions.loadTasksFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false
  })),
  
  // Load single task
  on(TaskActions.loadTask, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(TaskActions.loadTaskSuccess, (state, { task }) => ({
    ...state,
    selectedTask: task,
    loading: false
  })),
  on(TaskActions.loadTaskFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false
  })),
  
  // Add task
  on(TaskActions.addTask, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(TaskActions.addTaskSuccess, (state, { task }) => ({
    ...state,
    tasks: [...state.tasks, task],
    loading: false
  })),
  on(TaskActions.addTaskFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false
  })),
  
  // Update task
  on(TaskActions.updateTask, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(TaskActions.updateTaskSuccess, (state, { task }) => ({
    ...state,
    tasks: state.tasks.map(t => t.id === task.id ? task : t),
    selectedTask: state.selectedTask?.id === task.id ? task : state.selectedTask,
    loading: false
  })),
  on(TaskActions.updateTaskFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false
  })),
  
  // Mark task as completed
  on(TaskActions.markTaskAsCompleted, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(TaskActions.markTaskAsCompletedSuccess, (state, { task }) => ({
    ...state,
    tasks: state.tasks.map(t => t.id === task.id ? task : t),
    selectedTask: state.selectedTask?.id === task.id ? task : state.selectedTask,
    loading: false
  })),
  on(TaskActions.markTaskAsCompletedFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false
  })),
  
  // Delete task
  on(TaskActions.deleteTask, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(TaskActions.deleteTaskSuccess, (state, { id }) => ({
    ...state,
    tasks: state.tasks.filter(task => task.id !== id),
    selectedTask: state.selectedTask?.id === id ? null : state.selectedTask,
    loading: false
  })),
  on(TaskActions.deleteTaskFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false
  })),
  
  // Select Task
  on(TaskActions.selectTask, (state, { task }) => ({
    ...state,
    selectedTask: task
  }))
); 