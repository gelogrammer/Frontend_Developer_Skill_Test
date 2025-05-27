import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { TaskService } from '../../services/task.service';
import * as TaskActions from './task.actions';

@Injectable()
export class TaskEffects {
  constructor(
    private actions$: Actions,
    private taskService: TaskService
  ) {}

  loadTasks$ = createEffect(() => this.actions$.pipe(
    ofType(TaskActions.loadTasks),
    switchMap(() => this.taskService.getTasks().pipe(
      map(tasks => TaskActions.loadTasksSuccess({ tasks })),
      catchError(error => of(TaskActions.loadTasksFailure({ error })))
    ))
  ));

  loadTask$ = createEffect(() => this.actions$.pipe(
    ofType(TaskActions.loadTask),
    switchMap(({ id }) => this.taskService.getTask(id).pipe(
      map(task => TaskActions.loadTaskSuccess({ task })),
      catchError(error => of(TaskActions.loadTaskFailure({ error })))
    ))
  ));

  addTask$ = createEffect(() => this.actions$.pipe(
    ofType(TaskActions.addTask),
    switchMap(({ task }) => this.taskService.addTask(task).pipe(
      map(newTask => TaskActions.addTaskSuccess({ task: newTask })),
      catchError(error => of(TaskActions.addTaskFailure({ error })))
    ))
  ));

  updateTask$ = createEffect(() => this.actions$.pipe(
    ofType(TaskActions.updateTask),
    switchMap(({ id, updates }) => this.taskService.updateTask(id, updates).pipe(
      map(updatedTask => TaskActions.updateTaskSuccess({ task: updatedTask })),
      catchError(error => of(TaskActions.updateTaskFailure({ error })))
    ))
  ));

  markTaskAsCompleted$ = createEffect(() => this.actions$.pipe(
    ofType(TaskActions.markTaskAsCompleted),
    switchMap(({ id }) => this.taskService.markTaskAsCompleted(id).pipe(
      map(completedTask => TaskActions.markTaskAsCompletedSuccess({ task: completedTask })),
      catchError(error => of(TaskActions.markTaskAsCompletedFailure({ error })))
    ))
  ));

  deleteTask$ = createEffect(() => this.actions$.pipe(
    ofType(TaskActions.deleteTask),
    switchMap(({ id }) => this.taskService.deleteTask(id).pipe(
      map(() => TaskActions.deleteTaskSuccess({ id })),
      catchError(error => of(TaskActions.deleteTaskFailure({ error })))
    ))
  ));
} 