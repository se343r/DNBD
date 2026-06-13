import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import CategoryPage from './pages/CategoryPage';
import CelebrityDetailPage from './pages/CelebrityDetailPage';
import Chatbot from './components/Chatbot/Chatbot';
import { ThemeProvider } from './contexts/ThemeContext';
import './App.css';

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/danh-muc" element={<CategoryPage />} />
          <Route path="/danh-muc/:categoryId" element={<CategoryPage />} />
          <Route path="/danh-nhan/:id" element={<CelebrityDetailPage />} />
          <Route path="*" element={<HomePage />} />
        </Routes>
        <Chatbot />
      </BrowserRouter>
    </ThemeProvider>
  );
}
