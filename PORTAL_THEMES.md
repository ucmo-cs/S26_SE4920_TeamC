# 🎨 Portal Theme System Documentation

## Overview

The Portal Theme System provides a robust, extensible theming solution for Angular applications using CDK Portals. It includes 7 pre-built color schemes and support for custom themes.

## Features

✨ **Key Features:**
- 🎨 7 Pre-built Color Schemes (Light, Dark, Ocean, Forest, Sunset, Cyberpunk, Minimal)
- 🔄 Dynamic Theme Switching
- 🎯 Real-time DOM Updates
- 📱 Responsive Design
- 🧩 Modular Architecture
- 🎪 CDK Portal Integration
- 🎭 Custom Theme Support

## Color Schemes

### 1. **Light Theme** (Default)
Professional, clean light theme suitable for most applications.
```
Primary:    #3f51b5 (Indigo)
Secondary:  #ff4081 (Pink)
Accent:     #00bcd4 (Cyan)
Background: #ffffff (White)
Foreground: #212121 (Dark Gray)
```

### 2. **Dark Theme**
Modern dark theme with vibrant accents for reduced eye strain.
```
Primary:    #bb86fc (Purple)
Secondary:  #03dac6 (Teal)
Accent:     #3f51b5 (Indigo)
Background: #121212 (Very Dark Gray)
Foreground: #ffffff (White)
```

### 3. **Ocean Theme**
Calming ocean-inspired blues and aqua colors.
```
Primary:    #0077be (Ocean Blue)
Secondary:  #00a8e8 (Sky Blue)
Accent:     #00c9ff (Aqua)
Background: #f0f7ff (Ice Blue)
Foreground: #001f3f (Deep Blue)
```

### 4. **Forest Theme**
Natural earth tones with green accents.
```
Primary:    #2d5016 (Dark Green)
Secondary:  #558000 (Olive Green)
Accent:     #8bc34a (Light Green)
Background: #f1f5ee (Off White)
Foreground: #1b3a1b (Forest Green)
```

### 5. **Sunset Theme**
Warm, energetic colors inspired by sunsets.
```
Primary:    #ff6b35 (Orange Red)
Secondary:  #f7931e (Orange)
Accent:     #fdb833 (Golden Yellow)
Background: #fff8f0 (Cream)
Foreground: #2c1810 (Dark Brown)
```

### 6. **Cyberpunk Theme**
Bold, neon colors for modern, tech-forward interfaces.
```
Primary:    #ff006e (Hot Pink)
Secondary:  #00f5ff (Neon Cyan)
Accent:     #ffbe0b (Neon Yellow)
Background: #0a0e27 (Deep Black)
Foreground: #00f5ff (Neon Cyan)
```

### 7. **Minimal Theme**
Simplistic black and white with subtle grays.
```
Primary:    #000000 (Black)
Secondary:  #666666 (Gray)
Accent:     #cccccc (Light Gray)
Background: #ffffff (White)
Foreground: #333333 (Dark Gray)
```

## Component Architecture

### PortalThemeService
Central service for theme management and CSS variable injection.

**Key Methods:**
```typescript
// Get observable of current theme
getTheme(): Observable<ThemeName>

// Get observable of current colors
getColors(): Observable<ThemeColors>

// Get current colors synchronously
getCurrentColors(): ThemeColors

// Get current theme name
getCurrentTheme(): ThemeName

// Apply a theme
applyTheme(themeName: ThemeName): void

// Get available themes
getAvailableThemes(): ThemeName[]

// Create custom theme
createCustomTheme(name: string, colors: Partial<ThemeColors>): void

// Get theme colors
getThemeColors(themeName: ThemeName): ThemeColors | null
```

### PortalThemeDemoComponent
Standalone component demonstrating portal theming capabilities.

**Features:**
- 🎨 Interactive theme selector
- 📊 Real-time color palette display
- 🎯 Attach/detach portal functionality
- 📱 Responsive grid layout
- ✨ Smooth animations and transitions

**Usage:**
```typescript
import { PortalThemeDemoComponent } from './components/portal-theme-demo/portal-theme-demo.component';

@NgModule({
  imports: [PortalThemeDemoComponent]
})
export class AppModule {}
```

### ThemeSwitcherComponent
Lightweight theme switcher component for UI integration.

**Features:**
- 📝 Dropdown theme selector
- 🎨 Color preview dots
- 💫 Responsive design
- 🎯 Real-time updates

**Usage:**
```typescript
<app-theme-switcher></app-theme-switcher>
```

## CSS Variables

All theme colors are automatically injected as CSS variables on the `:root` element:

```css
--theme-primary
--theme-secondary
--theme-accent
--theme-background
--theme-foreground
--theme-border
--theme-success
--theme-warning
--theme-danger
--theme-info
```

**Usage in Components:**
```css
.my-element {
  background: var(--theme-background);
  color: var(--theme-foreground);
  border-color: var(--theme-primary);
}
```

## Creating Custom Themes

### Method 1: Using Service
```typescript
constructor(private themeService: PortalThemeService) {}

ngOnInit() {
  this.themeService.createCustomTheme('myTheme', {
    primary: '#ff0000',
    secondary: '#00ff00',
    accent: '#0000ff',
    background: '#f5f5f5',
    foreground: '#1a1a1a'
  });
  
  this.themeService.applyTheme('myTheme' as ThemeName);
}
```

### Method 2: Direct CSS Variable Override
```css
:host {
  --theme-primary: #ff0000;
  --theme-secondary: #00ff00;
  --theme-accent: #0000ff;
  --theme-background: #f5f5f5;
  --theme-foreground: #1a1a1a;
  --theme-border: #e0e0e0;
  --theme-success: #4caf50;
  --theme-warning: #ff9800;
  --theme-danger: #f44336;
  --theme-info: #2196f3;
}
```

## Integration Examples

### Basic Portal with Theming
```typescript
import { Component, ViewChild, TemplateRef } from '@angular/core';
import { CdkPortalOutlet, TemplatePortal } from '@angular/cdk/portal';
import { PortalThemeService } from './services/portal-theme.service';

@Component({
  selector: 'app-themed-portal',
  template: `
    <ng-template #myPortal>
      <div [ngStyle]="getPortalStyle()">
        <h3>Themed Portal Content</h3>
        <p>This content is themed dynamically</p>
      </div>
    </ng-template>
    
    <div cdkPortalOutlet [portal]="portal"></div>
  `
})
export class ThemedPortalComponent {
  @ViewChild('myPortal') portalTemplate!: TemplateRef<any>;
  @ViewChild(CdkPortalOutlet) portalOutlet!: CdkPortalOutlet;
  portal: any;

  constructor(private themeService: PortalThemeService) {}

  getPortalStyle() {
    const colors = this.themeService.getCurrentColors();
    return {
      background: colors.background,
      color: colors.foreground
    };
  }
}
```

### Theme Switcher in Navigation
```typescript
import { Component } from '@angular/core';
import { ThemeSwitcherComponent } from './components/theme-switcher/theme-switcher.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [ThemeSwitcherComponent],
  template: `
    <header class="navbar">
      <h1>My App</h1>
      <app-theme-switcher></app-theme-switcher>
    </header>
  `,
  styles: [`
    .navbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px;
      background: var(--theme-background);
      border-bottom: 1px solid var(--theme-border);
    }
  `]
})
export class HeaderComponent {}
```

## Advanced Features

### Theme Persistence
To persist theme selection across sessions:

```typescript
// In PortalThemeService
applyTheme(themeName: ThemeName): void {
  // ... existing code
  localStorage.setItem('selectedTheme', themeName);
}

// In component ngOnInit
ngOnInit() {
  const savedTheme = localStorage.getItem('selectedTheme') as ThemeName || 'light';
  this.themeService.applyTheme(savedTheme);
}
```

### System Preference Detection
```typescript
private getSystemPreference(): ThemeName {
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }
  return 'light';
}

ngOnInit() {
  const theme = this.getSystemPreference();
  this.themeService.applyTheme(theme);
}
```

### Theme Animation
CSS transitions are automatically applied due to CSS variables:

```css
:host {
  transition: all 0.3s ease;
}
```

## Color Semantics

### Standard Colors
- **Primary**: Main brand color for primary actions
- **Secondary**: Complementary brand color
- **Accent**: Highlight color for interactive elements

### Semantic Colors
- **Success**: Positive actions, confirmations
- **Warning**: Cautionary states, alerts
- **Danger**: Destructive actions, errors
- **Info**: Informational messages

### UI Colors
- **Background**: Main background color
- **Foreground**: Text and primary content color
- **Border**: Border and divider color

## Best Practices

1. **Contrast**: Ensure sufficient contrast between foreground and background
2. **Accessibility**: Test with accessibility tools
3. **Consistency**: Use semantic colors consistently
4. **Performance**: CSS variables are performant and fast
5. **Testing**: Test theme switching with different components

## File Structure

```
frontend/src/app/
├── services/
│   ├── portal.service.ts
│   ├── portal-theme.service.ts (NEW)
├── components/
│   ├── portal-outlet/
│   │   └── portal-outlet.component.ts
│   ├── portal-theme-demo/ (NEW)
│   │   └── portal-theme-demo.component.ts
│   └── theme-switcher/ (NEW)
│       └── theme-switcher.component.ts
```

## Browser Support

- ✅ Chrome/Edge 49+
- ✅ Firefox 31+
- ✅ Safari 9.1+
- ✅ Opera 36+

CSS Variables are supported in all modern browsers.

## Performance Considerations

- **CSS Variables**: Zero runtime overhead
- **Observable Subscriptions**: Automatically managed by async pipe
- **Portal Rendering**: Optimized by CDK
- **Theme Switching**: Instant visual update

## Troubleshooting

### Theme not applying?
```typescript
// Make sure to inject ViewContainerRef
constructor(private viewContainerRef: ViewContainerRef) {}
```

### Colors not updating?
```typescript
// Subscribe to theme changes
this.themeService.getColors().subscribe(colors => {
  this.colors = colors;
  this.cdr.detectChanges();
});
```

### Portal not rendering?
```typescript
// Ensure PortalModule is imported
imports: [PortalModule, CdkPortalOutlet]
```

## Examples Repository

Check the `PortalThemeDemoComponent` for a complete working example with:
- Theme selection
- Portal attachment/detachment
- Color palette display
- Responsive grid layout
- Animation effects

## Extending the System

To add a new theme:

```typescript
// In PortalThemeService
private themes: Record<ThemeName, ThemeColors> = {
  // ... existing themes
  myCustomTheme: {
    primary: '#...',
    secondary: '#...',
    // ... other colors
  }
};
```

Or use the `createCustomTheme()` method for runtime creation.

## License

This theme system is part of the S26_SE4920_TeamC project.

---

**Last Updated**: March 2026
**Version**: 1.0.0
