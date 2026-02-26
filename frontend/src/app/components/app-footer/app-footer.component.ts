import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <footer style="padding: 10px; text-align: center;">
      © 2026 Portal
    </footer>
  `
})
export class AppFooterComponent {}