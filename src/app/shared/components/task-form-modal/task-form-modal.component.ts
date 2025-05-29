import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Task } from '../../../models/task.model';

@Component({
  selector: 'app-task-form-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div *ngIf="isOpen" class="fixed inset-0 z-50 flex items-center justify-center">
      <!-- Backdrop -->
      <div class="fixed inset-0 bg-black bg-opacity-30" (click)="onCancel()"></div>
      
      <!-- Modal -->
      <div class="relative bg-white rounded-lg shadow-lg w-full max-w-md mx-4 z-10 animate-fade-in-up">
        <!-- Header -->
        <div class="p-4 flex justify-between items-center">
          <h3 class="text-lg font-semibold bg-gradient-to-r from-[#DA68A8] to-[#5556FF] text-transparent bg-clip-text">
            {{ isEditMode ? 'Edit Task' : 'Add New Task' }}
          </h3>
          <button (click)="onCancel()" class="text-gray-400 hover:text-gray-600">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </button>
        </div>
        
        <!-- Body -->
        <div class="px-6 pb-2">
          <form [formGroup]="taskForm" (ngSubmit)="onSubmit()">
            <div class="mb-4">
              <label for="title" class="block text-sm font-medium text-gray-700 mb-1">Task Title</label>
              <input 
                type="text" 
                id="title" 
                formControlName="title" 
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Enter task title"
              >
              <div *ngIf="title?.invalid && (title?.dirty || title?.touched)" class="text-red-500 text-sm mt-1">
                <div *ngIf="title?.errors?.['required']">Title is required</div>
                <div *ngIf="title?.errors?.['maxlength']">Title cannot exceed 100 characters</div>
              </div>
            </div>

            <div class="mb-6">
              <label for="description" class="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea 
                id="description" 
                formControlName="description" 
                rows="4" 
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Enter task description"
              ></textarea>
              <div *ngIf="description?.invalid && (description?.dirty || description?.touched)" class="text-red-500 text-sm mt-1">
                <div *ngIf="description?.errors?.['maxlength']">Description cannot exceed 250 characters</div>
              </div>
              <div class="text-xs text-gray-500 mt-1">
                {{ description?.value?.length || 0 }}/250 characters
              </div>
            </div>

            <div class="p-4 flex justify-center">
              <button 
                type="submit" 
                [disabled]="taskForm.invalid || submitting"
                class="w-full py-3 bg-gradient-to-r from-[#DA68A8] to-[#5556FF] text-white rounded-md font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {{ isEditMode ? 'Save' : 'Add' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .animate-fade-in-up {
      animation: fadeInUp 0.3s ease-out;
    }
    
    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `]
})
export class TaskFormModalComponent implements OnInit, OnChanges {
  @Input() isOpen = false;
  @Input() isEditMode = false;
  @Input() taskToEdit: Task | null = null;
  
  @Output() save = new EventEmitter<{title: string, description: string}>();
  @Output() cancel = new EventEmitter<void>();
  
  taskForm: FormGroup;
  submitting = false;
  
  constructor(private fb: FormBuilder) {
    this.taskForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', [Validators.maxLength(250)]]
    });
  }
  
  ngOnInit(): void {
    this.resetForm();
  }
  
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['taskToEdit'] && this.taskToEdit) {
      this.taskForm.patchValue({
        title: this.taskToEdit.title,
        description: this.taskToEdit.description
      });
    }
    
    if (changes['isOpen'] && this.isOpen === true) {
      this.resetForm();
      if (this.taskToEdit && this.isEditMode) {
        this.taskForm.patchValue({
          title: this.taskToEdit.title,
          description: this.taskToEdit.description
        });
      }
    }
  }
  
  resetForm(): void {
    if (!this.isEditMode) {
      this.taskForm.reset({
        title: '',
        description: ''
      });
    }
  }
  
  onSubmit(): void {
    if (this.taskForm.invalid || this.submitting) {
      return;
    }
    
    this.submitting = true;
    const formValues = this.taskForm.value;
    this.save.emit(formValues);
    
    setTimeout(() => {
      this.submitting = false;
      this.isOpen = false;
    }, 300);
  }
  
  onCancel(): void {
    this.cancel.emit();
    this.isOpen = false;
  }
  
  get title() {
    return this.taskForm.get('title');
  }
  
  get description() {
    return this.taskForm.get('description');
  }
} 