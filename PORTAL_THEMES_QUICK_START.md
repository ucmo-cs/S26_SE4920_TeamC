# 🚀 Quick Integration Guide - Portal Themes

## Step 1: Import Services and Components

In your `app.module.ts` or component:

```typescript
import { PortalThemeService } from './services/portal-theme.service';
import { PortalThemeDemoComponent } from './components/portal-theme-demo/portal-theme-demo.component';
import { ThemeSwitcherComponent } from './components/theme-switcher/theme-switcher.component';

@NgModule({
  imports: [
    PortalThemeDemoComponent,
    ThemeSwitcherComponent,
    // ... other imports
  ],
  providers: [PortalThemeService]
})
export class AppModule {}
```

## Step 2: Add Theme Switcher to Your Header

```html
<!-- app.component.html -->
<app-header>
  <app-theme-switcher></app-theme-switcher>
</app-header>
<router-outlet></router-outlet>
```

## Step 3: Use Portal with Themes

```typescript
import { Component } from '@angular/core';
import { PortalThemeDemoComponent } from './components/portal-theme-demo/portal-theme-demo.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [PortalThemeDemoComponent],
  template: `
    <div class="dashboard">
      <app-portal-theme-demo></app-portal-theme-demo>
    </div>
  `
})
export class DashboardComponent {}
```

## Step 4: Access Theme in Your Components

```typescript
import { Component, OnInit } from '@angular/core';
import { PortalThemeService } from './services/portal-theme.service';

@Component({
  selector: 'app-my-component',
  template: `
    <div [ngStyle]="getThemeStyle()">
      <h3>My Component with Theme</h3>
    </div>
  `
})
export class MyComponent implements OnInit {
  colors: any = {};

  constructor(private themeService: PortalThemeService) {}

  ngOnInit() {
    this.themeService.getColors().subscribe(colors => {
      this.colors = colors;
    });
  }

  getThemeStyle() {
    return {
      background: this.colors.background,
      color: this.colors.foreground,
      padding: '16px',
      borderRadius: '8px'
    };
  }
}
```

## Step 5: Use CSS Variables in Styles

```css
/* component.css */
.card {
  background: var(--theme-background);
  color: var(--theme-foreground);
  border: 2px solid var(--theme-primary);
  border-radius: 8px;
  padding: 16px;
}

.success-button {
  background: var(--theme-success);
  color: white;
}

.warning-box {
  background: var(--theme-warning);
  color: var(--theme-foreground);
}
```

## Available Themes

```
✨ light          - Clean, professional light theme (default)
🌙 dark           - Modern dark theme
🌊 ocean          - Calming ocean blues
🌲 forest         - Natural greens
🌅 sunset         - Warm sunset colors
🔮 cyberpunk      - Bold neon colors
⚪ minimal        - Simple black & white
```

## Programmatic Theme Switching

```typescript
// In any component
constructor(private themeService: PortalThemeService) {}

changeTheme(theme: string) {
  this.themeService.applyTheme(theme as ThemeName);
}

// In template
<button (click)="changeTheme('dark')">Switch to Dark</button>
<button (click)="changeTheme('ocean')">Switch to Ocean</button>
```

## Get Current Theme

```typescript
// Synchronous
const currentTheme = this.themeService.getCurrentTheme();
const currentColors = this.themeService.getCurrentColors();

// Asynchronous
this.themeService.getTheme().subscribe(theme => {
  console.log('Current theme:', theme);
});

this.themeService.getColors().subscribe(colors => {
  console.log('Current colors:', colors);
});
```

## Create Custom Theme

```typescript
// In your component or service
this.themeService.createCustomTheme('brandTheme', {
  primary: '#e91e63',
  secondary: '#00bcd4',
  accent: '#ffc107',
  background: '#fafafa',
  foreground: '#212121',
  border: '#e0e0e0',
  success: '#4caf50',
  warning: '#ff9800',
  danger: '#f44336',
  info: '#2196f3'
});

// Apply it
this.themeService.applyTheme('brandTheme' as ThemeName);
```

## Persist Theme Selection

```typescript
// In PortalThemeService or a separate service
export class ThemePersistenceService {
  private STORAGE_KEY = 'app-theme';

  saveTheme(theme: ThemeName): void {
    localStorage.setItem(this.STORAGE_KEY, theme);
  }

  loadTheme(): ThemeName {
    return (localStorage.getItem(this.STORAGE_KEY) as ThemeName) || 'light';
  }
}

// In your app initialization
ngOnInit() {
  const savedTheme = this.persistenceService.loadTheme();
  this.themeService.applyTheme(savedTheme);
}

// When theme changes
changeTheme(theme: ThemeName) {
  this.themeService.applyTheme(theme);
  this.persistenceService.saveTheme(theme);
}
```

## Common Use Cases

### 1. Conditional Styling Based on Theme

```typescript
getCardStyle() {
  const colors = this.themeService.getCurrentColors();
  return {
    background: colors.background,
    border: `2px solid ${colors.primary}`,
    borderRadius: '8px',
    padding: '16px'
  };
}
```

### 2. Dynamic Component Colors

```html
<div [style.background-color]="colors.primary">
  <p [style.color]="colors.background">Dynamic color!</p>
</div>
```

### 3. Theme-Aware Material Design

```html
<mat-card [ngStyle]="{ background: colors.background, color: colors.foreground }">
  <mat-card-header>
    <mat-card-title [style.color]="colors.primary">Title</mat-card-title>
  </mat-card-header>
</mat-card>
```

## Troubleshooting

**Q: CSS variables not updating?**
A: Make sure `:host` selector is set in component styles:
```css
:host {
  --theme-primary: inherit;
  --theme-background: inherit;
}
```

**Q: Portal not showing with theme?**
A: Ensure Portal components have proper ViewContainerRef:
```typescript
constructor(private vcr: ViewContainerRef) {}
```

**Q: Custom colors not applying?**
A: Verify all color properties are defined in custom theme

## Next Steps

1. Check `PORTAL_THEMES.md` for comprehensive documentation
2. Review `PortalThemeDemoComponent` for working examples
3. Customize themes in `PortalThemeService`
4. Create brand-specific themes for your app

---

**Happy Theming! 🎨**
