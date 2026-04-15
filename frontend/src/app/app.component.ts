import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  template: `<router-outlet></router-outlet>`,
  standalone: false,
  styleUrls: [],
})
export class AppComponent {
  title = 'S26 Senior Project';
}