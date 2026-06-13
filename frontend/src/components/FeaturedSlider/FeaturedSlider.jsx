import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight, Award, Calendar } from 'lucide-react';
import figuresData from '../../data/figures.json';
import SectionTitle from '../common/SectionTitle/SectionTitle';
import Button from '../common/Button/Button';
import './FeaturedSlider.css';

export default function FeaturedSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [fadeState, setFadeState] = useState('fade-in');
  const isAnimatingRef = useRef(false);
  const autoPlayRef = useRef(null);

  // Filter only featured figures
  const featuredFigures = figuresData.filter(figure => figure.featured);

  const goToSlide = useCallback((index) => {
    if (isAnimatingRef.current || index === currentSlide) return;
    isAnimatingRef.current = true;
    setFadeState('fade-out');

    setTimeout(() => {
      setCurrentSlide(index);
      setFadeState('fade-in');

      setTimeout(() => {
        isAnimatingRef.current = false;
      }, 300);
    }, 300);
  }, [currentSlide]);

  const nextSlide = useCallback(() => {
    if (isAnimatingRef.current) return;
    goToSlide((currentSlide + 1) % featuredFigures.length);
  }, [currentSlide, goToSlide, featuredFigures.length]);

  const prevSlide = useCallback(() => {
    if (isAnimatingRef.current) return;
    goToSlide((currentSlide - 1 + featuredFigures.length) % featuredFigures.length);
  }, [currentSlide, goToSlide, featuredFigures.length]);

  // Start auto-play timer
  const startAutoPlay = useCallback(() => {
    stopAutoPlay();
    autoPlayRef.current = setInterval(nextSlide, 7000);
  }, [nextSlide]);

  // Stop auto-play timer
  const stopAutoPlay = useCallback(() => {
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current);
    }
  }, []);

  useEffect(() => {
    startAutoPlay();
    return () => stopAutoPlay();
  }, [startAutoPlay, stopAutoPlay]);

  const current = featuredFigures[currentSlide];

  if (!current) return null;

  return (
    <section 
      className="featured" 
      id="featured-slider-section"
      onMouseEnter={stopAutoPlay}
      onMouseLeave={startAutoPlay}
    >
      <div className="featured__inner">
        <SectionTitle 
          title="Những Nhân Vật Tiêu Biểu" 
          subtitle="Gương sáng muôn đời"
          align="center"
        />

        <div className="featured__slider-wrapper">
          {/* Background glowing/decorative cards */}
          <div className="featured__bg-glow"></div>
          <div className="featured__bg-card"></div>

          {/* Main Card */}
          <div className={`featured__card ${fadeState}`}>
            <div className="featured__card-content">
              <div className="featured__badge-container">
                <span className="featured__category-badge">{current.categoryLabel}</span>
                <span className="featured__era-badge">
                  <Calendar size={14} />
                  {current.era}
                </span>
              </div>

              <h3 className="featured__card-title">{current.name}</h3>
              <p className="featured__card-lifespan">🗓️ {current.lifespan}</p>
              
              <p className="featured__card-desc">{current.shortDescription}</p>

              <div className="featured__achievements">
                <h4 className="achievements-title">
                  <Award size={16} />
                  Thành tựu nổi bật:
                </h4>
                <ul>
                  {current.achievements.slice(0, 2).map((achievement, idx) => (
                    <li key={idx}>✨ {achievement}</li>
                  ))}
                </ul>
              </div>

              <a href={`/danh-nhan/${current.id}`} className="featured__cta-wrapper">
                <Button variant="primary" icon={ArrowRight} iconPosition="right">
                  Đọc tiểu sử
                </Button>
              </a>
            </div>

            <div className="featured__card-visual">
              <div className="featured__image-container">
                <img 
                  src={current.image} 
                  alt={current.name} 
                  className="featured__figure-img"
                />
                <div className="featured__image-gradient"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation arrows */}
        <button 
          className="featured__arrow featured__arrow--prev" 
          onClick={prevSlide} 
          aria-label="Slide trước" 
          id="slider-prev"
        >
          <ChevronLeft size={24} />
        </button>
        <button 
          className="featured__arrow featured__arrow--next" 
          onClick={nextSlide} 
          aria-label="Slide sau" 
          id="slider-next"
        >
          <ChevronRight size={24} />
        </button>

        {/* Dots */}
        <div className="featured__dots" id="slider-dots">
          {featuredFigures.map((_, i) => (
            <button
              key={i}
              className={`featured__dot ${i === currentSlide ? 'featured__dot--active' : ''}`}
              onClick={() => goToSlide(i)}
              aria-label={`Đi tới slide ${i + 1}`}
              id={`dot-${i}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
