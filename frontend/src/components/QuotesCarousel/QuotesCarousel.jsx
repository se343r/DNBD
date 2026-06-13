import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ChevronLeft, ChevronRight, MessageSquare } from 'lucide-react';
import quotesData from '../../data/quotes.json';
import SectionTitle from '../common/SectionTitle/SectionTitle';
import './QuotesCarousel.css';

export default function QuotesCarousel() {
  const [currentQuote, setCurrentQuote] = useState(0);
  const [isFade, setIsFade] = useState(false);
  const autoPlayRef = useRef(null);
  
  const [randomGradient] = useState(() => {
    const angle = Math.floor(Math.random() * 360);
    return `linear-gradient(${angle}deg, #5f31ec, #000000, #d56bff)`;
  });

  const triggerNext = useCallback(() => {
    setIsFade(true);
    setTimeout(() => {
      setCurrentQuote(prev => (prev + 1) % quotesData.length);
      setIsFade(false);
    }, 400);
  }, []);

  const triggerPrev = useCallback(() => {
    setIsFade(true);
    setTimeout(() => {
      setCurrentQuote(prev => (prev - 1 + quotesData.length) % quotesData.length);
      setIsFade(false);
    }, 400);
  }, []);

  // Auto Play
  const startTimer = useCallback(() => {
    stopTimer();
    autoPlayRef.current = setInterval(triggerNext, 8000);
  }, [triggerNext]);

  const stopTimer = useCallback(() => {
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current);
    }
  }, []);

  useEffect(() => {
    startTimer();
    return () => stopTimer();
  }, [startTimer, stopTimer]);

  const current = quotesData[currentQuote];

  if (!current) return null;

  return (
    <section 
      className="quotes-section" 
      id="quotes-section"
      style={{ background: randomGradient }}
      onMouseEnter={stopTimer}
      onMouseLeave={startTimer}
    >
      <div className="quotes-section__inner">
        <SectionTitle 
          title="Trích Dẫn Bất Hủ" 
          subtitle="Tư tưởng hiền tài"
          align="center"
        />

        <div className="quotes-carousel__container">
          {/* Big decorative quotation mark */}
          <div className="quotes-carousel__quote-mark">“</div>

          {/* Quote Card */}
          <div className={`quotes-carousel__card ${isFade ? 'fade' : ''}`}>
            <p className="quotes-carousel__text">
              “{current.text}”
            </p>

            <a href={`/danh-nhan/${current.authorId}`} className="quotes-carousel__author-wrapper">
              <img 
                src={current.authorImage} 
                alt={current.author} 
                className="quotes-carousel__author-img"
              />
              <div className="quotes-carousel__author-info">
                <span className="author-name">{current.author}</span>
                <span className="author-link-label">Tìm hiểu tiểu sử &rarr;</span>
              </div>
            </a>
          </div>

          {/* Controls */}
          <button 
            className="quotes-carousel__btn prev" 
            onClick={triggerPrev}
            aria-label="Câu trước"
          >
            <ChevronLeft size={20} />
          </button>
          <button 
            className="quotes-carousel__btn next" 
            onClick={triggerNext}
            aria-label="Câu sau"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        {/* Carousel Indicators */}
        <div className="quotes-carousel__indicators">
          {quotesData.map((_, i) => (
            <button
              key={i}
              className={`indicator-dot ${i === currentQuote ? 'active' : ''}`}
              onClick={() => {
                setIsFade(true);
                setTimeout(() => {
                  setCurrentQuote(i);
                  setIsFade(false);
                }, 400);
              }}
              aria-label={`Đi tới trích dẫn ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
