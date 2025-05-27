/**
 * Task interface - defines the structure of a task in the application
 */
export interface Task {
  id: string;                              // Unique identifier for the task
  title: string;                           // Title/name of the task
  description: string;                     // Detailed description of the task
  status: 'pending' | 'completed';         // Current status of the task - either pending or completed
  createdAt: Date;                         // Date when the task was created
  updatedAt: Date;                         // Date when the task was last updated
} 