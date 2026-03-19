import { Component } from '@angular/core';

@Component({
  selector: 'app-training',
  template: `
    <div class="training-container">
      <h1>Training</h1>
      <p>View and manage your training here.</p>
    </div>
  `,
  styles: [`
    .training-container {
      padding: 20px;
    }
  `]
})
export class TrainingComponent {}
