import React, { useState } from 'react';
import { ArrowRight, Compass } from 'lucide-react';
import figuresData from '../../data/figures.json';
import Button from '../common/Button/Button';
import './WelcomeGallery.css';

export default function WelcomeGallery() {
  // Use 5 random figures for the gallery, shuffled on load
  const [galleryFigures] = useState(() => {
    return [...figuresData].sort(() => 0.5 - Math.random()).slice(0, 5);
  });

  return (
    <section className="welcome" id="welcome-section">
      <div className="welcome__inner">
        {/* Header */}
        <div className="welcome__header">
          <span className="welcome__badge">
            <Compass size={14} />
            Hành trình Văn hóa & Lịch sử
          </span>
          <h2 className="welcome__title">Khám Phá Các Nhân Vật</h2>
          <p className="welcome__subtitle">
            Cùng tìm hiểu về cuộc đời, sự nghiệp và những cống hiến vĩ đại của các danh nhân, hiền tài nước Việt qua các triều đại lịch sử dựng nước và giữ nước.
          </p>
          <div className="welcome__header-cta">
            <a href="/danh-muc">
              <Button variant="primary" size="lg">
                Khám phá danh mục
              </Button>
            </a>
          </div>
        </div>

        {/* Gallery */}
        <div className="welcome__gallery" id="welcome-gallery">
          <div className="welcome__gallery-track">
            {galleryFigures.map((figure, i) => (
              <div 
                key={figure.id}
                className={`welcome__gallery-item welcome__gallery-item--${i + 1}`}
              >
                <div className="welcome__gallery-img-wrapper">
                  <img 
                    src={figure.image} 
                    alt={figure.name} 
                    className="welcome__gallery-img"
                  />
                  <div className="welcome__gallery-overlay">
                    <span className="gallery-figure-name">{figure.name}</span>
                    <span className="gallery-figure-tag">{figure.categoryLabel}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* See More button */}
        <div className="welcome__see-more">
          <a href="/danh-muc" className="welcome__see-more-link">
            Xem tất cả nhân vật
            <ArrowRight size={18} />
          </a>
        </div>
      </div>
    </section>
  );
}
