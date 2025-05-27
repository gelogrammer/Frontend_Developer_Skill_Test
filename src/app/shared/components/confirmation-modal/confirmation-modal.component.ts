import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-confirmation-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="isOpen" class="fixed inset-0 z-50 flex items-center justify-center">
      <!-- Backdrop -->
      <div class="fixed inset-0 bg-black bg-opacity-30" (click)="onCancel()"></div>
      
      <!-- Modal -->
      <div class="relative bg-white rounded-lg shadow-lg w-full max-w-sm mx-4 z-10 animate-fade-in-up">
        <!-- Header -->
        <div class="p-4 flex justify-between items-center">
          <h3 class="text-lg font-semibold text-indigo-900">{{ title }}</h3>
          <button (click)="onCancel()" class="text-gray-400 hover:text-gray-600">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </button>
        </div>
        
        <!-- Body -->
        <div class="px-4 pb-2 text-center">
          <p class="text-gray-600">
            <span [innerHTML]="formattedMessage"></span>
          </p>
        </div>
        
        <!-- Footer -->
        <div class="p-4 flex justify-center">
          <ng-container *ngIf="modalType === 'delete'">
            <button 
              (click)="onConfirm()" 
              class="w-full py-3 bg-red-50 text-red-500 rounded-md flex items-center justify-center space-x-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
              </svg>
              <span>Delete</span>
            </button>
          </ng-container>
          
          <ng-container *ngIf="modalType === 'complete'">
            <button 
              (click)="onConfirm()" 
              class="w-full py-3 bg-green-500 text-white rounded-md"
            >
              Yes
            </button>
          </ng-container>
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
export class ConfirmationModalComponent {
  @Input() isOpen = false;
  @Input() title = 'Confirm Action';
  @Input() message = 'Are you sure you want to proceed?';
  @Input() taskName = '';
  @Input() modalType: 'delete' | 'complete' = 'delete';
  @Input() confirmText = 'Confirm';
  @Input() cancelText = 'Cancel';
  
  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();
  
  get formattedMessage(): string {
    if (this.modalType === 'delete') {
      return `Are you sure you want to delete <strong>${this.taskName}</strong>?`;
    } else if (this.modalType === 'complete') {
      return `Are you want to complete <strong>${this.taskName}</strong>?`;
    }
    return this.message;
  }
  
  onConfirm(): void {
    this.confirm.emit();
    this.isOpen = false;
  }
  
  onCancel(): void {
    this.cancel.emit();
    this.isOpen = false;
  }
} 