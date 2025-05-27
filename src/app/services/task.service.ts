import { Injectable, inject } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay, tap } from 'rxjs/operators';
import { Task } from '../models/task.model';
import { v4 as uuidv4 } from 'uuid';
import { PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private localStorageKey = 'tasks';
  private platformId = inject(PLATFORM_ID);
  
  constructor() {
    // Only initialize tasks in browser environment
    if (isPlatformBrowser(this.platformId)) {
      // Initialize with some sample tasks if none exist
      if (!localStorage.getItem(this.localStorageKey)) {
        this.initializeSampleTasks();
      }
    }
  }

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

  // Get all tasks
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

  // Get pending tasks
  getPendingTasks(): Observable<Task[]> {
    return this.getTasks().pipe(
      tap(tasks => tasks.filter(task => task.status === 'pending'))
    );
  }

  // Get completed tasks
  getCompletedTasks(): Observable<Task[]> {
    return this.getTasks().pipe(
      tap(tasks => tasks.filter(task => task.status === 'completed'))
    );
  }

  // Get a single task
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

  // Add a new task
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

  // Update a task
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

  // Mark task as completed
  markTaskAsCompleted(id: string): Observable<Task> {
    return this.updateTask(id, { status: 'completed' });
  }

  // Delete a task
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