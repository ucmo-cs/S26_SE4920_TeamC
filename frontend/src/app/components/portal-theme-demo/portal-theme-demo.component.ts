import { Component, OnInit, ViewChild, TemplateRef, ViewContainerRef } from '@angular/core';
import { CdkPortalOutlet, ComponentPortal, TemplatePortal } from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';
import { PortalThemeService, ThemeName } from '../../services/portal-theme.service';

@Component({
  selector: 'app-portal-theme-demo',
  standalone: true,
  imports: [CommonModule, CdkPortalOutlet],
  template: `
    <div class="portal-container" [ngStyle]="getContainerStyle()">
      <div class="header">
        <h2>🎨 Portal with Custom Themes</h2>
        <p class="subtitle">Choose a theme to customize the portal appearance</p>
      </div>

      <div class="theme-selector">
        <label>Select Theme:</label>
        <div class="theme-buttons">
          <button 
            *ngFor="let theme of availableThemes"
            (click)="selectTheme(theme)"
            [class.active]="currentTheme === theme"
            [ngStyle]="getButtonStyle(theme)"
          >
            {{ formatThemeName(theme) }}
          </button>
        </div>
      </div>

      <div class="portal-content">
        <div cdkPortalOutlet [portal]="selectedPortal"></div>
      </div>

      <div class="controls">
        <button class="btn-primary" (click)="attachPortal()">📌 Attach Portal</button>
        <button class="btn-secondary" (click)="detachPortal()">🔓 Detach Portal</button>
        <button class="btn-info" (click)="toggleColorPalette()">🎯 Show Colors</button>
      </div>

      <div *ngIf="showColorPalette" class="color-palette">
        <h4>Color Palette</h4>
        <div class="color-grid">
          <div 
            *ngFor="let color of getColorArray()"
            class="color-item"
            [ngStyle]="{ backgroundColor: color.value }"
          >
            <span class="color-label">{{ color.name }}</span>
            <span class="color-value">{{ color.value }}</span>
          </div>
        </div>
      </div>

      <ng-template #themePortal>
        <div class="theme-portal-content" [ngStyle]="getThemePortalStyle()">
          <div class="portal-header">
            <h3>🌈 {{ formatThemeName(currentTheme) }} Theme</h3>
          </div>
          
          <div class="portal-body">
            <div class="content-card">
              <h4>Welcome to the Portal</h4>
              <p>This content is rendered dynamically using Angular CDK Portal with custom theming.</p>
              <p class="theme-desc">Current theme: <strong>{{ currentTheme }}</strong></p>
            </div>

            <div class="feature-grid">
              <div class="feature" [ngStyle]="{ borderLeftColor: colors?.success }">
                <h5>✅ Success</h5>
                <p>Highlight positive actions</p>
              </div>
              <div class="feature" [ngStyle]="{ borderLeftColor: colors?.warning }">
                <h5>⚠️ Warning</h5>
                <p>Show cautionary states</p>
              </div>
              <div class="feature" [ngStyle]="{ borderLeftColor: colors?.danger }">
                <h5>❌ Danger</h5>
                <p>Indicate critical states</p>
              </div>
              <div class="feature" [ngStyle]="{ borderLeftColor: colors?.info }">
                <h5>ℹ️ Info</h5>
                <p>Provide information</p>
              </div>
            </div>
          </div>
        </div>
      </ng-template>
    </div>
  `,
  styles: [`
    :host {
      --theme-primary: #3f51b5;
      --theme-secondary: #ff4081;
      --theme-accent: #00bcd4;
      --theme-background: #ffffff;
      --theme-foreground: #212121;
      --theme-border: #e0e0e0;
      --theme-success: #4caf50;
      --theme-warning: #ff9800;
      --theme-danger: #f44336;
      --theme-info: #2196f3;
    }

    .portal-container {
      max-width: 1000px;
      margin: 0 auto;
      padding: 24px;
      background: var(--theme-background);
      color: var(--theme-foreground);
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      transition: all 0.3s ease;
    }

    .header {
      text-align: center;
      margin-bottom: 32px;
      padding-bottom: 16px;
      border-bottom: 2px solid var(--theme-border);
    }

    .header h2 {
      margin: 0 0 8px 0;
      font-size: 28px;
      color: var(--theme-primary);
    }

    .subtitle {
      margin: 0;
      color: var(--theme-secondary);
      font-size: 14px;
    }

    .theme-selector {
      margin-bottom: 32px;
      padding: 16px;
      background: var(--theme-background);
      border: 1px solid var(--theme-border);
      border-radius: 8px;
    }

    .theme-selector label {
      display: block;
      font-weight: 600;
      margin-bottom: 12px;
      color: var(--theme-foreground);
    }

    .theme-buttons {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }

    .theme-buttons button {
      padding: 10px 16px;
      border: 2px solid var(--theme-border);
      background: var(--theme-background);
      color: var(--theme-foreground);
      border-radius: 6px;
      cursor: pointer;
      font-size: 12px;
      font-weight: 500;
      transition: all 0.2s ease;
    }

    .theme-buttons button:hover {
      border-color: var(--theme-primary);
      background: var(--theme-primary);
      color: white;
    }

    .theme-buttons button.active {
      border-color: var(--theme-accent);
      background: var(--theme-primary);
      color: white;
      box-shadow: 0 2px 8px rgba(63, 81, 181, 0.3);
    }

    .portal-content {
      margin-bottom: 32px;
    }

    .theme-portal-content {
      padding: 24px;
      background: var(--theme-background);
      border: 2px solid var(--theme-primary);
      border-radius: 8px;
      animation: slideIn 0.3s ease;
    }

    @keyframes slideIn {
      from {
        opacity: 0;
        transform: translateY(-10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .portal-header {
      padding-bottom: 12px;
      border-bottom: 2px solid var(--theme-accent);
      margin-bottom: 16px;
    }

    .portal-header h3 {
      margin: 0;
      color: var(--theme-primary);
      font-size: 20px;
    }

    .portal-body {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .content-card {
      padding: 16px;
      background: rgba(63, 81, 181, 0.05);
      border-radius: 6px;
      border-left: 4px solid var(--theme-accent);
    }

    .content-card h4 {
      margin: 0 0 8px 0;
      color: var(--theme-primary);
    }

    .content-card p {
      margin: 0 0 4px 0;
      color: var(--theme-foreground);
      font-size: 14px;
    }

    .theme-desc {
      margin-top: 8px;
      font-size: 12px;
      color: var(--theme-secondary);
    }

    .feature-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 12px;
    }

    .feature {
      padding: 12px;
      background: rgba(0, 0, 0, 0.02);
      border-left: 4px solid var(--theme-accent);
      border-radius: 4px;
      transition: all 0.2s ease;
    }

    .feature:hover {
      transform: translateX(4px);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .feature h5 {
      margin: 0 0 4px 0;
      font-size: 14px;
      color: var(--theme-foreground);
    }

    .feature p {
      margin: 0;
      font-size: 12px;
      color: var(--theme-secondary);
    }

    .controls {
      display: flex;
      gap: 12px;
      margin-bottom: 24px;
      flex-wrap: wrap;
    }

    button {
      padding: 12px 20px;
      border: none;
      border-radius: 6px;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .btn-primary {
      background: var(--theme-primary);
      color: white;
    }

    .btn-primary:hover {
      box-shadow: 0 4px 12px rgba(63, 81, 181, 0.3);
      transform: translateY(-2px);
    }

    .btn-secondary {
      background: var(--theme-secondary);
      color: white;
    }

    .btn-secondary:hover {
      box-shadow: 0 4px 12px rgba(255, 64, 129, 0.3);
      transform: translateY(-2px);
    }

    .btn-info {
      background: var(--theme-info);
      color: white;
    }

    .btn-info:hover {
      box-shadow: 0 4px 12px rgba(33, 150, 243, 0.3);
      transform: translateY(-2px);
    }

    .color-palette {
      margin-top: 24px;
      padding: 20px;
      background: var(--theme-background);
      border: 1px solid var(--theme-border);
      border-radius: 8px;
      animation: fadeIn 0.3s ease;
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    .color-palette h4 {
      margin: 0 0 16px 0;
      color: var(--theme-primary);
    }

    .color-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
      gap: 12px;
    }

    .color-item {
      padding: 12px;
      border-radius: 6px;
      text-align: center;
      color: white;
      text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      transition: transform 0.2s ease;
    }

    .color-item:hover {
      transform: scale(1.05);
    }

    .color-label {
      display: block;
      font-weight: 600;
      font-size: 12px;
      margin-bottom: 4px;
    }

    .color-value {
      display: block;
      font-size: 11px;
      opacity: 0.9;
      font-family: monospace;
    }
  `]
})
export class PortalThemeDemoComponent implements OnInit {
  @ViewChild('themePortal') themePortal!: TemplateRef<any>;
  @ViewChild(CdkPortalOutlet) portalOutlet!: CdkPortalOutlet;

  availableThemes: ThemeName[] = [];
  currentTheme: ThemeName = 'light';
  colors: any = {};
  selectedPortal: TemplatePortal<any> | null = null;
  showColorPalette = false;

  constructor(private themeService: PortalThemeService, private viewContainerRef: ViewContainerRef) {}

  ngOnInit(): void {
    this.availableThemes = this.themeService.getAvailableThemes();
    this.themeService.getColors().subscribe(colors => {
      this.colors = colors;
    });
    this.themeService.getTheme().subscribe(theme => {
      this.currentTheme = theme;
    });
  }

  selectTheme(theme: ThemeName): void {
    this.themeService.applyTheme(theme);
  }

  attachPortal(): void {
    if (this.themePortal && this.portalOutlet) {
      const portal = new TemplatePortal(this.themePortal, this.viewContainerRef);
      this.portalOutlet.attachTemplatePortal(portal);
    }
  }

  detachPortal(): void {
    if (this.portalOutlet) {
      this.portalOutlet.detach();
      this.selectedPortal = null;
    }
  }

  toggleColorPalette(): void {
    this.showColorPalette = !this.showColorPalette;
  }

  getContainerStyle(): any {
    return {
      'background': this.colors.background,
      'color': this.colors.foreground,
    };
  }

  getButtonStyle(theme: ThemeName): any {
    const themeColors = this.themeService.getThemeColors(theme);
    if (!themeColors) return {};
    return {
      '--accent': themeColors.primary,
    };
  }

  getThemePortalStyle(): any {
    return {
      'background': this.colors.background,
      'color': this.colors.foreground,
    };
  }

  getColorArray(): any[] {
    return Object.entries(this.colors).map(([name, value]) => ({
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
