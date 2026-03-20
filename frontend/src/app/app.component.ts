<<<<<<< HEAD
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
=======
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'frontend';

  constructor(
    public router: Router,
  ) {}

  ngOnInit(): void {
    this.applyStoredTheme();
  }

  private applyStoredTheme(): void {
    const theme = localStorage.getItem('app-theme') || 'default';
    const root = document.documentElement;
    root.classList.remove('theme-default', 'theme-forest', 'theme-fema');
    root.classList.add(`theme-${theme}`);
  }
}
>>>>>>> origin/develop
