import { create } from 'zustand';

export type GraphicsQuality = 'high' | 'balanced' | 'low' | 'canvas2d';
export type AppTheme = 'dark' | 'light';

export interface SettingsState {
  theme: AppTheme;
  graphicsQuality: GraphicsQuality;
  reducedMotion: boolean;
  soundEnabled: boolean;
  showLabels: boolean;
  autoRotate: boolean;
  customCursorEnabled: boolean;
  setTheme: (theme: AppTheme) => void;
  toggleTheme: () => void;
  setGraphicsQuality: (quality: GraphicsQuality) => void;
  setReducedMotion: (val: boolean) => void;
  setSoundEnabled: (val: boolean) => void;
  setShowLabels: (val: boolean) => void;
  setAutoRotate: (val: boolean) => void;
  setCustomCursorEnabled: (val: boolean) => void;
  resetPreferences: () => void;
}

const getSavedTheme = (): AppTheme => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('aether-theme');
    if (saved === 'dark' || saved === 'light') return saved;
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
      return 'light';
    }
  }
  return 'dark';
};

const applyThemeClass = (theme: AppTheme) => {
  if (typeof document !== 'undefined') {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    }
    document.documentElement.setAttribute('data-theme', theme);
  }
};

const initialTheme = getSavedTheme();
applyThemeClass(initialTheme);

export const useSettingsStore = create<SettingsState>((set, get) => ({
  theme: initialTheme,
  graphicsQuality: 'high',
  reducedMotion: typeof window !== 'undefined' && typeof window.matchMedia === 'function' ? window.matchMedia('(prefers-reduced-motion: reduce)').matches : false,
  soundEnabled: false,
  showLabels: true,
  autoRotate: false,
  customCursorEnabled: true,

  setTheme: (theme) => {
    localStorage.setItem('aether-theme', theme);
    applyThemeClass(theme);
    set({ theme });
  },

  toggleTheme: () => {
    const nextTheme = get().theme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('aether-theme', nextTheme);
    applyThemeClass(nextTheme);
    set({ theme: nextTheme });
  },

  setGraphicsQuality: (quality) => set({ graphicsQuality: quality }),
  setReducedMotion: (val) => set({ reducedMotion: val }),
  setSoundEnabled: (val) => set({ soundEnabled: val }),
  setShowLabels: (val) => set({ showLabels: val }),
  setAutoRotate: (val) => set({ autoRotate: val }),
  setCustomCursorEnabled: (val) => set({ customCursorEnabled: val }),

  resetPreferences: () => {
    const defaultTheme: AppTheme = 'dark';
    localStorage.setItem('aether-theme', defaultTheme);
    applyThemeClass(defaultTheme);
    set({
      theme: defaultTheme,
      graphicsQuality: 'high',
      reducedMotion: false,
      soundEnabled: false,
      showLabels: true,
      autoRotate: false,
      customCursorEnabled: true
    });
  }
}));
