/**
 * TypeScript declaration file for theme-switcher.js
 */

declare const themeSwitcher: {
  currentTheme: string;
  init(): void;
  setTheme(theme: string): void;
  toggleTheme(): string;
  createToggleButton(): void;
  getButtonContent(theme?: string): string;
};

export default themeSwitcher;
