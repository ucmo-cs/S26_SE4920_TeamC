import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PortalThemeService, ThemeName } from '../../services/portal-theme.service';

@Component({
  selector: 'app-theme-switcher',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="theme-switcher">
      <div class="switcher-header">
        <label for="theme-select">🎨 Theme:</label>
        <select 
          id="theme-select"
          [value]="currentTheme" 
          (change)="onThemeChange($event)"
          class="theme-select"
        >
          <option *ngFor="let theme of availableThemes" [value]="theme">
            {{ formatThemeName(theme) }}
          </option>
        </select>
      </div>

      <div class="theme-preview">
        <div class="preview-colors">
          <div 
            *ngFor="let color of getColorArray()"
            class="color-dot"
            [ngStyle]="{ backgroundColor: color.value }"
            [title]="color.name"
          ></div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .theme-switcher {
      padding: 12px 16px;
      background: var(--theme-background, white);
      border: 1px solid var(--theme-border, #e0e0e0);
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .switcher-header {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 8px;
    }

    label {
      font-weight: 600;
      color: var(--theme-foreground, #212121);
      font-size: 14px;
    }

    .theme-select {
      flex: 1;
      min-width: 150px;
      padding: 8px 12px;
      background: var(--theme-background, white);
      color: var(--theme-foreground, #212121);
      border: 2px solid var(--theme-border, #e0e0e0);
      border-radius: 4px;
      font-size: 14px;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .theme-select:hover {
      border-color: var(--theme-primary, #3f51b5);
    }

    .theme-select:focus {
      outline: none;
      border-color: var(--theme-primary, #3f51b5);
      box-shadow: 0 0 0 3px rgba(63, 81, 181, 0.1);
    }

    .theme-preview {
      display: flex;
      justify-content: center;
    }

    .preview-colors {
      display: flex;
      gap: 6px;
    }

    .color-dot {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
      transition: transform 0.2s ease;
      cursor: pointer;
    }

    .color-dot:hover {
      transform: scale(1.1);
    }
  `]
})
export class ThemeSwitcherComponent implements OnInit {
  availableThemes: ThemeName[] = [];
  currentTheme: ThemeName = 'light';
  colors: any = {};

  constructor(private themeService: PortalThemeService) {}

  ngOnInit(): void {
    this.availableThemes = this.themeService.getAvailableThemes();
    this.themeService.getTheme().subscribe(theme => {
      this.currentTheme = theme;
    });
    this.themeService.getColors().subscribe(colors => {
      this.colors = colors;
    });
  }

  onThemeChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    this.themeService.applyTheme(selectElement.value as ThemeName);
  }

  getColorArray(): any[] {
    return Object.entries(this.colors)
      .slice(0, 6)
      .map(([name, value]) => ({
        name: this.formatColorName(name),
        value,
      }));
  }

  formatThemeName(name: string): string {
    return name.charAt(0).toUpperCase() + name.slice(1);
  }

  formatColorName(name: string): string {
    return name
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .trim();
  }
}
