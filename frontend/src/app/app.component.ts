import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import {MatToolbarModule} from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';



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
