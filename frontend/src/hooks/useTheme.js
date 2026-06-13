import { useState, useEffect } from 'react';

export function useTheme() {
  // Lock theme permanently to dark mode
  const theme = 'dark';

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'dark');
  }, []);

  const toggleTheme = () => {
    // Theme toggle is disabled
  };

  return { theme, toggleTheme, isDark: true };
}
