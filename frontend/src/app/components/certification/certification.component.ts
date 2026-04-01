import { Component } from '@angular/core';

@Component({
  selector: 'app-certification',
  template: `
    <div class="certification-container">
      <h1>Certifications</h1>
      <p>View and manage your certifications here.</p>
    </div>
  `,
  styles: [`
    .certification-container {
      padding: 20px;
    }
  `]
})
export class CertificationComponent {}
