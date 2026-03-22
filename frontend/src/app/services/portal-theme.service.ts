import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  foreground: string;
  border: string;
  success: string;
  warning: string;
  danger: string;
  info: string;
}

export type ThemeName = 'light' | 'dark' | 'ocean' | 'forest' | 'sunset' | 'cyberpunk' | 'minimal';

@Injectable({ providedIn: 'root' })
export class PortalThemeService {
  private themes: Record<ThemeName, ThemeColors> = {
    light: {
      primary: '#3f51b5',
      secondary: '#ff4081',
      accent: '#00bcd4',
      background: '#ffffff',
      foreground: '#212121',
      border: '#e0e0e0',
      success: '#4caf50',
      warning: '#ff9800',
      danger: '#f44336',
      info: '#2196f3',
    },
    dark: {
      primary: '#bb86fc',
      secondary: '#03dac6',
      accent: '#3f51b5',
      background: '#121212',
      foreground: '#ffffff',
      border: '#37474f',
      success: '#81c784',
      warning: '#ffb74d',
      danger: '#ef5350',
      info: '#64b5f6',
    },
    ocean: {
      primary: '#0077be',
      secondary: '#00a8e8',
      accent: '#00c9ff',
      background: '#f0f7ff',
      foreground: '#001f3f',
      border: '#004e98',
      success: '#00d084',
      warning: '#ff9500',
      danger: '#d32f2f',
      info: '#0288d1',
    },
    forest: {
      primary: '#2d5016',
      secondary: '#558000',
      accent: '#8bc34a',
      background: '#f1f5ee',
      foreground: '#1b3a1b',
      border: '#4a6fa5',
      success: '#66bb6a',
      warning: '#ffa726',
      danger: '#ef5350',
      info: '#29b6f6',
    },
    sunset: {
      primary: '#ff6b35',
      secondary: '#f7931e',
      accent: '#fdb833',
      background: '#fff8f0',
      foreground: '#2c1810',
      border: '#ffb85c',
      success: '#66bb6a',
      warning: '#f57c00',
      danger: '#d32f2f',
      info: '#1976d2',
    },
    cyberpunk: {
      primary: '#ff006e',
      secondary: '#00f5ff',
      accent: '#ffbe0b',
      background: '#0a0e27',
      foreground: '#00f5ff',
      border: '#ff006e',
      success: '#39ff14',
      warning: '#ffbe0b',
      danger: '#ff006e',
      info: '#00f5ff',
    },
    minimal: {
      primary: '#000000',
      secondary: '#666666',
      accent: '#cccccc',
      background: '#ffffff',
      foreground: '#333333',
      border: '#cccccc',
      success: '#2e7d32',
      warning: '#f57c00',
      danger: '#c62828',
      info: '#1565c0',
    },
  };

  private currentTheme$ = new BehaviorSubject<ThemeName>('light');
  private currentColors$ = new BehaviorSubject<ThemeColors>(this.themes['light']);

  constructor() {
    this.applyTheme('light');
  }

  getTheme(): Observable<ThemeName> {
    return this.currentTheme$.asObservable();
  }

  getColors(): Observable<ThemeColors> {
    return this.currentColors$.asObservable();
  }

  getCurrentColors(): ThemeColors {
    return this.currentColors$.value;
  }

  getCurrentTheme(): ThemeName {
    return this.currentTheme$.value;
  }

  applyTheme(themeName: ThemeName): void {
    const colors = this.themes[themeName];
    if (!colors) {
      console.error(`Theme "${themeName}" not found`);
      return;
    }

    this.currentTheme$.next(themeName);
    this.currentColors$.next(colors);
    this.applyThemeToDOM(colors);
  }

  private applyThemeToDOM(colors: ThemeColors): void {
    const root = document.documentElement;
    Object.entries(colors).forEach(([key, value]) => {
      root.style.setProperty(`--theme-${this.camelToKebab(key)}`, value);
    });
  }

  private camelToKebab(str: string): string {
    return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
  }

  getAvailableThemes(): ThemeName[] {
    return Object.keys(this.themes) as ThemeName[];
  }

  createCustomTheme(name: string, colors: Partial<ThemeColors>): void {
    const defaultTheme = this.themes['light'];
    const mergedColors = { ...defaultTheme, ...colors };
    (this.themes as any)[name] = mergedColors;
  }

  getThemeColors(themeName: ThemeName): ThemeColors | null {
    return this.themes[themeName] || null;
  }
}
