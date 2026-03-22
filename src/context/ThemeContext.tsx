import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { Appearance } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@inventqry_theme';

export type ThemeMode = 'light' | 'dark' | 'system';

export interface ThemeColors {
  PrimaryBlue: string;
  SecondaryWhite: string;
  Background: string;
  DarkText: string;
  GrayText: string;
  SuccessGreen: string;
  Danger: string;
  Border: string;
  InputBg: string;
  CardBg: string;
  TabBar: string;
}

const lightColors: ThemeColors = {
  PrimaryBlue: '#4A7BF7',
  SecondaryWhite: '#F5F7FA',
  Background: '#FFFFFF',
  DarkText: '#2A3342',
  GrayText: '#8E9196',
  SuccessGreen: '#6EE7B7',
  Danger: '#EF4444',
  Border: '#E8EBF0',
  InputBg: '#F0F2F5',
  CardBg: '#F5F7FA',
  TabBar: '#FFFFFF',
};

const darkColors: ThemeColors = {
  PrimaryBlue: '#5B8DF8',
  SecondaryWhite: '#23272F',
  Background: '#1A1D23',
  DarkText: '#E8ECF0',
  GrayText: '#9CA3AF',
  SuccessGreen: '#34D399',
  Danger: '#F87171',
  Border: '#2E3340',
  InputBg: '#23272F',
  CardBg: '#23272F',
  TabBar: '#1F222A',
};

interface ThemeContextValue {
  mode: ThemeMode;
  isDark: boolean;
  colors: ThemeColors;
  setMode: (mode: ThemeMode) => Promise<void>;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setModeState] = useState<ThemeMode>('light');
  const [systemScheme, setSystemScheme] = useState(Appearance.getColorScheme());

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((saved) => {
      if (saved === 'light' || saved === 'dark' || saved === 'system') {
        setModeState(saved);
      }
    });
  }, []);

  useEffect(() => {
    const sub = Appearance.addChangeListener(({ colorScheme }) => {
      setSystemScheme(colorScheme);
    });
    return () => sub.remove();
  }, []);

  const setMode = async (m: ThemeMode) => {
    setModeState(m);
    await AsyncStorage.setItem(STORAGE_KEY, m);
  };

  const isDark = mode === 'dark' || (mode === 'system' && systemScheme === 'dark');
  const colors = isDark ? darkColors : lightColors;

  const value = useMemo<ThemeContextValue>(
    () => ({ mode, isDark, colors, setMode }),
    [mode, isDark]
  );

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
