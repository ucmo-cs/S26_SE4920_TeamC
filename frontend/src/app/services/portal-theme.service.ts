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
    // Professional Blue - Corporate & Trustworthy
    light: {
      primary: '#0066cc',
      secondary: '#3b82f6',
      accent: '#10b981',
      background: '#ffffff',
      foreground: '#1f2937',
      border: '#e5e7eb',
      success: '#10b981',
      warning: '#f59e0b',
      danger: '#ef4444',
      info: '#3b82f6',
    },
    // Modern Dark - Sophisticated & Premium
    dark: {
      primary: '#60a5fa',
      secondary: '#34d399',
      accent: '#fbbf24',
      background: '#0f172a',
      foreground: '#f1f5f9',
      border: '#334155',
      success: '#34d399',
      warning: '#fcd34d',
      danger: '#f87171',
      info: '#60a5fa',
    },
    // Ocean - Calm & Professional
    ocean: {
      primary: '#0369a1',
      secondary: '#0891b2',
      accent: '#06b6d4',
      background: '#f0f9ff',
      foreground: '#0c2d4a',
      border: '#cffafe',
      success: '#0d9488',
      warning: '#f59e0b',
      danger: '#dc2626',
      info: '#0369a1',
    },
    // Forest - Natural & Balanced
    forest: {
      primary: '#15803d',
      secondary: '#059669',
      accent: '#84cc16',
      background: '#f0fdf4',
      foreground: '#15211e',
      border: '#bbf7d0',
      success: '#059669',
      warning: '#d97706',
      danger: '#dc2626',
      info: '#0369a1',
    },
    // Sunset - Warm & Creative
    sunset: {
      primary: '#dc2626',
      secondary: '#f97316',
      accent: '#fbbf24',
      background: '#fef3c7',
      foreground: '#7c2d12',
      border: '#fed7aa',
      success: '#16a34a',
      warning: '#ea580c',
      danger: '#991b1b',
      info: '#0369a1',
    },
    // Cyberpunk - Bold & Modern
    cyberpunk: {
      primary: '#ec4899',
      secondary: '#06b6d4',
      accent: '#a855f7',
      background: '#0d0221',
      foreground: '#f0f9ff',
      border: '#ec4899',
      success: '#10b981',
      warning: '#fbbf24',
      danger: '#ec4899',
      info: '#06b6d4',
    },
    // Minimal - Clean & Minimalist
    minimal: {
      primary: '#1f2937',
      secondary: '#6b7280',
      accent: '#9ca3af',
      background: '#ffffff',
      foreground: '#111827',
      border: '#d1d5db',
      success: '#059669',
      warning: '#d97706',
      danger: '#7f1d1d',
      info: '#1e40af',
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
