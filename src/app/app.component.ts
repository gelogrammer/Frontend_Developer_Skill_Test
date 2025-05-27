import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

/**
 * Root application component
 * Acts as the entry point for the application
 * Uses standalone component pattern with minimal template
 */
@Component({
  selector: 'app-root',              // The element selector for this component
  template: `<router-outlet></router-outlet>`, // Simple template that only contains the router outlet
  styles: [],                         // No styles at this level
  imports: [RouterModule],            // Imports RouterModule for router-outlet
  standalone: true                    // Uses Angular's standalone component pattern
})
export class AppComponent {
  title = 'Task Management App';      // Application title
}
