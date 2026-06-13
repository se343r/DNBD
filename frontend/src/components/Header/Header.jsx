import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search } from 'lucide-react';
import './Header.css';

export default function Header() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { label: 'Trang chủ', to: '/' },
    { label: 'Danh mục', to: '/danh-muc' },
    { label: 'Nhập nội dung', to: '/nhap-noi-dung' },
  ];

  return (
    <header className="header" id="main-header">
      <div className="header__inner">
        <Link to="/" className="header__logo" id="logo">
          ✨ <span className="logo-main">Bắc Đẩu</span>
        </Link>

        <nav className={`header__nav ${mobileMenuOpen ? 'header__nav--open' : ''}`} id="main-nav">
          {navItems.map((item, i) => (
            <Link
              key={i}
              to={item.to}
              className={`header__nav-link ${location.pathname === item.to ? 'header__nav-link--active' : ''}`}
              id={`nav-link-${i}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="header__actions">
          <button
            className={`header__hamburger ${mobileMenuOpen ? 'header__hamburger--open' : ''}`}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            id="hamburger-btn"
            aria-label="Toggle menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>
    </header>
  );
}
