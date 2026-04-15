import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  standalone: false
})
export class AppComponent implements OnInit {
  title = 'S26 Senior Project';

  constructor(public router: Router) {}

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
