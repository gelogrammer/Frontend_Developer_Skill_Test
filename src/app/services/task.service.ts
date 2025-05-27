import { Injectable, inject } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay, tap } from 'rxjs/operators';
import { Task } from '../models/task.model';
import { v4 as uuidv4 } from 'uuid';
import { PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

/**
 * Task Service - handles all task-related operations
 * Uses localStorage for data persistence (simulates backend API)
 * Includes methods for CRUD operations on tasks
 */
@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private localStorageKey = 'tasks';  // Key for storing tasks in localStorage
  private platformId = inject(PLATFORM_ID);  // For platform detection (browser vs server)
  
  constructor() {
    // Only initialize tasks in browser environment
    if (isPlatformBrowser(this.platformId)) {
      // Initialize with some sample tasks if none exist
      if (!localStorage.getItem(this.localStorageKey)) {
        this.initializeSampleTasks();
      }
    }
  }

  /**
   * Creates sample tasks for initial app state
   * Only called when no tasks exist in localStorage
   */
  private initializeSampleTasks(): void {
    const sampleTasks: Task[] = [
      {
        id: uuidv4(),
        title: 'Complete Frontend Challenge',
        description: 'Finish the task management app with all required functionality.',
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        title: 'Learn NgRx',
        description: 'Study state management in Angular with NgRx.',
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        title: 'Review Angular Documentation',
        description: 'Go through Angular documentation to refresh knowledge.',
        status: 'completed',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
    
    localStorage.setItem(this.localStorageKey, JSON.stringify(sampleTasks));
  }

  /**
   * Retrieves all tasks from storage
   * @returns Observable of Task array with simulated API delay
   */
  getTasks(): Observable<Task[]> {
    try {
      // Return empty array if not in browser
      if (!isPlatformBrowser(this.platformId)) {
        return of([]);
      }
      
      const tasks = JSON.parse(localStorage.getItem(this.localStorageKey) || '[]');
      // Simulate API delay
      return of(tasks).pipe(
        delay(500)
      );
    } catch (error) {
      return throwError(() => new Error('Failed to fetch tasks'));
    }
  }

  /**
   * Retrieves only pending tasks
   * @returns Observable of pending Task array
   */
  getPendingTasks(): Observable<Task[]> {
    return this.getTasks().pipe(
      tap(tasks => tasks.filter(task => task.status === 'pending'))
    );
  }

  /**
   * Retrieves only completed tasks
   * @returns Observable of completed Task array
   */
  getCompletedTasks(): Observable<Task[]> {
    return this.getTasks().pipe(
      tap(tasks => tasks.filter(task => task.status === 'completed'))
    );
  }

  /**
   * Retrieves a specific task by ID
   * @param id Task ID to retrieve
   * @returns Observable of Task if found, error otherwise
   */
  getTask(id: string): Observable<Task> {
    try {
      // Return null if not in browser
      if (!isPlatformBrowser(this.platformId)) {
        return throwError(() => new Error('Task not found'));
      }
      
      const tasks: Task[] = JSON.parse(localStorage.getItem(this.localStorageKey) || '[]');
      const task = tasks.find(t => t.id === id);
      
      if (!task) {
        return throwError(() => new Error('Task not found'));
      }
      
      return of(task).pipe(delay(300));
    } catch (error) {
      return throwError(() => new Error('Failed to fetch task'));
    }
  }

  /**
   * Creates a new task
   * @param task Task data without id, dates, and status
   * @returns Observable of the created Task with generated ID and timestamps
   */
  addTask(task: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'status'>): Observable<Task> {
    try {
      // Don't perform operation if not in browser
      if (!isPlatformBrowser(this.platformId)) {
        const mockTask: Task = {
          ...task,
          id: uuidv4(),
          status: 'pending',
          createdAt: new Date(),
          updatedAt: new Date()
        };
        return of(mockTask).pipe(delay(300));
      }
      
      const tasks: Task[] = JSON.parse(localStorage.getItem(this.localStorageKey) || '[]');
      
      const newTask: Task = {
        ...task,
        id: uuidv4(),
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      tasks.push(newTask);
      localStorage.setItem(this.localStorageKey, JSON.stringify(tasks));
      
      return of(newTask).pipe(delay(300));
    } catch (error) {
      return throwError(() => new Error('Failed to add task'));
    }
  }

  /**
   * Updates an existing task
   * @param id Task ID to update
   * @param updates Partial Task data to apply
   * @returns Observable of the updated Task
   */
  updateTask(id: string, updates: Partial<Omit<Task, 'id' | 'createdAt'>>): Observable<Task> {
    try {
      // Don't perform operation if not in browser
      if (!isPlatformBrowser(this.platformId)) {
        return throwError(() => new Error('Task not found'));
      }
      
      const tasks: Task[] = JSON.parse(localStorage.getItem(this.localStorageKey) || '[]');
      const index = tasks.findIndex(t => t.id === id);
      
      if (index === -1) {
        return throwError(() => new Error('Task not found'));
      }
      
      const updatedTask: Task = {
        ...tasks[index],
        ...updates,
        updatedAt: new Date()
      };
      
      tasks[index] = updatedTask;
      localStorage.setItem(this.localStorageKey, JSON.stringify(tasks));
      
      return of(updatedTask).pipe(delay(300));
    } catch (error) {
      return throwError(() => new Error('Failed to update task'));
    }
  }

  /**
   * Marks a task as completed
   * @param id Task ID to mark as completed
   * @returns Observable of the updated Task
   */
  markTaskAsCompleted(id: string): Observable<Task> {
    return this.updateTask(id, { status: 'completed' });
  }

  /**
   * Deletes a task by ID
   * @param id Task ID to delete
   * @returns Observable of boolean indicating success
   */
  deleteTask(id: string): Observable<boolean> {
    try {
      // Don't perform operation if not in browser
      if (!isPlatformBrowser(this.platformId)) {
        return of(true).pipe(delay(300));
      }
      
      const tasks: Task[] = JSON.parse(localStorage.getItem(this.localStorageKey) || '[]');
      const filteredTasks = tasks.filter(t => t.id !== id);
      
      localStorage.setItem(this.localStorageKey, JSON.stringify(filteredTasks));
      
      return of(true).pipe(delay(300));
    } catch (error) {
      return throwError(() => new Error('Failed to delete task'));
    }
  }
} 