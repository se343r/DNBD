import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight, Award, Calendar } from 'lucide-react';
import figuresData from '../../data/figures.json';
import SectionTitle from '../common/SectionTitle/SectionTitle';
import Button from '../common/Button/Button';
import './FeaturedSlider.css';

export default function FeaturedSlider() {
  const [featuredFigures, setFeaturedFigures] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [fadeState, setFadeState] = useState('fade-in');
  const isAnimatingRef = useRef(false);
  const autoPlayRef = useRef(null);

  // Fetch từ API, fallback về file tĩnh nếu lỗi
  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await fetch('/api/celebrities');
        if (!res.ok) throw new Error('API error');
        const data = await res.json();
        // Lấy tối đa 5 danh nhân đầu tiên làm featured
        const featured = Array.isArray(data) && data.length > 0
          ? data.slice(0, 5)
          : figuresData.filter(f => f.featured);
        setFeaturedFigures(featured);
      } catch {
        setFeaturedFigures(figuresData.filter(f => f.featured));
      }
    };
    fetchFeatured();
  }, []);

  const goToSlide = useCallback((index) => {
    if (isAnimatingRef.current || index === currentSlide) return;
    isAnimatingRef.current = true;
    setFadeState('fade-out');
    setTimeout(() => {
      setCurrentSlide(index);
      setFadeState('fade-in');
      setTimeout(() => { isAnimatingRef.current = false; }, 300);
    }, 300);
  }, [currentSlide]);

  const nextSlide = useCallback(() => {
    if (isAnimatingRef.current || featuredFigures.length === 0) return;
    goToSlide((currentSlide + 1) % featuredFigures.length);
  }, [currentSlide, goToSlide, featuredFigures.length]);

  const prevSlide = useCallback(() => {
    if (isAnimatingRef.current || featuredFigures.length === 0) return;
    goToSlide((currentSlide - 1 + featuredFigures.length) % featuredFigures.length);
  }, [currentSlide, goToSlide, featuredFigures.length]);

  const startAutoPlay = useCallback(() => {
    stopAutoPlay();
    autoPlayRef.current = setInterval(nextSlide, 7000);
  }, [nextSlide]);

  const stopAutoPlay = useCallback(() => {
    if (autoPlayRef.current) clearInterval(autoPlayRef.current);
  }, []);

  useEffect(() => {
    if (featuredFigures.length > 0) startAutoPlay();
    return () => stopAutoPlay();
  }, [startAutoPlay, stopAutoPlay, featuredFigures.length]);

  if (featuredFigures.length === 0) return null;

  const current = featuredFigures[currentSlide];
  if (!current) return null;

  // Hỗ trợ cả cấu trúc DB lẫn file tĩnh
  const name = current.name;
  const lifespan = current.lifespan || `${current.birth_date || ''} – ${current.death_date || ''}`;
  const era = current.era || current.period_name || 'Lịch sử';
  const description = current.shortDescription || current.summary || '';
  const image = current.image || current.avatar_image || '';
  const categoryLabel = current.categoryLabel || (current.fields?.[0]?.name) || 'Danh nhân';
  const achievements = current.achievements || [];
  const figureId = current.id;

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
          <div className="featured__bg-glow"></div>
          <div className="featured__bg-card"></div>

          <div className={`featured__card ${fadeState}`}>
            <div className="featured__card-content">
              <div className="featured__badge-container">
                <span className="featured__category-badge">{categoryLabel}</span>
                <span className="featured__era-badge">
                  <Calendar size={14} />
                  {era}
                </span>
              </div>

              <h3 className="featured__card-title">{name}</h3>
              <p className="featured__card-lifespan">🗓️ {lifespan}</p>
              <p className="featured__card-desc">{description}</p>

              {achievements.length > 0 && (
                <div className="featured__achievements">
                  <h4 className="achievements-title">
                    <Award size={16} />
                    Thành tựu nổi bật:
                  </h4>
                  <ul>
                    {achievements.slice(0, 2).map((ach, idx) => (
                      <li key={idx}>✨ {ach}</li>
                    ))}
                  </ul>
                </div>
              )}

              <a href={`/danh-nhan/${figureId}`} className="featured__cta-wrapper">
                <Button variant="primary" icon={ArrowRight} iconPosition="right">
                  Đọc tiểu sử
                </Button>
              </a>
            </div>

            <div className="featured__card-visual">
              <div className="featured__image-container">
                <img src={image} alt={name} className="featured__figure-img" />
                <div className="featured__image-gradient"></div>
              </div>
            </div>
          </div>
        </div>

        <button className="featured__arrow featured__arrow--prev" onClick={prevSlide} aria-label="Slide trước" id="slider-prev">
          <ChevronLeft size={24} />
        </button>
        <button className="featured__arrow featured__arrow--next" onClick={nextSlide} aria-label="Slide sau" id="slider-next">
          <ChevronRight size={24} />
        </button>

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
