import React from 'react';
import './SectionTitle.css';

export default function SectionTitle({ title, subtitle, align = 'center' }) {
  return (
    <div className={`section-title-container align-${align}`}>
      {subtitle && <span className="section-subtitle">{subtitle}</span>}
      <h2 className="section-main-title">{title}</h2>
      <div className="section-title-divider">
        <span className="divider-line"></span>
        <span className="divider-dot"></span>
        <span className="divider-line"></span>
      </div>
    </div>
  );
}
