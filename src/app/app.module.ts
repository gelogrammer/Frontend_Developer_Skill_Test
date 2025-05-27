import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import { AppComponent } from './app.component';
import { AuthGuard } from './guards/auth.guard';
import { AuthService } from './services/auth.service';
import { TaskService } from './services/task.service';
import { TaskEffects } from './store/task/task.effects';
import { taskReducer } from './store/task/task.reducer';

// Define your routes here
const routes: Routes = [
  { path: '', redirectTo: '/tasks', pathMatch: 'full' },
  { 
    path: 'tasks', 
    loadChildren: () => import('./features/tasks/tasks.module').then(m => m.TasksModule),
    canActivate: [AuthGuard] 
  },
  { 
    path: 'login', 
    loadChildren: () => import('./features/auth/auth.module').then(m => m.AuthModule) 
  },
  { path: '**', redirectTo: '/tasks' }
];

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule.forRoot(routes),
    StoreModule.forRoot({ tasks: taskReducer }),
    EffectsModule.forRoot([TaskEffects]),
    StoreDevtoolsModule.instrument({ maxAge: 25 }),
    AppComponent
  ],
  providers: [
    AuthService,
    TaskService,
    AuthGuard
  ]
})
export class AppModule { } 