import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useThemeContext } from '../../../contexts/ThemeContext';
import './ThemeToggle.css';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useThemeContext();
  
  return (
    <button
      className="theme-toggle-btn"
      onClick={toggleTheme}
      aria-label={`Chuyển sang chế độ ${theme === 'light' ? 'tối' : 'sáng'}`}
      title={`Chuyển sang chế độ ${theme === 'light' ? 'tối' : 'sáng'}`}
    >
      <div className={`icon-wrapper ${theme}`}>
        <Sun className="theme-icon sun" size={20} />
        <Moon className="theme-icon moon" size={20} />
      </div>
    </button>
  );
}
