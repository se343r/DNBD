import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function BookCoverflowSlider({ books, onChangeIndex }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const autoplayIntervalRef = useRef(null);
  const autoplayDelay = 3000;

  useEffect(() => {
    setActiveIndex(0);
  }, [books]);

  const goToNext = () => {
    setActiveIndex((prev) => {
      const nextIndex = (prev + 1) % books.length;
      if (onChangeIndex) onChangeIndex(nextIndex);
      return nextIndex;
    });
  };

  useEffect(() => {
    if (!isPaused) {
      autoplayIntervalRef.current = setInterval(goToNext, autoplayDelay);
    }
    return () => {
      if (autoplayIntervalRef.current) {
        clearInterval(autoplayIntervalRef.current);
      }
    };
  }, [isPaused, books.length]);

  const changeSlide = (newIndex) => {
    const newSafeIndex = (newIndex + books.length) % books.length;
    setActiveIndex(newSafeIndex);
    if (onChangeIndex) onChangeIndex(newSafeIndex);
    
    if (autoplayIntervalRef.current) {
      clearInterval(autoplayIntervalRef.current);
    }
    if (!isPaused) {
      autoplayIntervalRef.current = setInterval(goToNext, autoplayDelay);
    }
  };

  const onDragEnd = (event, info) => {
    const dragThreshold = 50;
    const dragOffset = info.offset.x;
    if (dragOffset > dragThreshold) {
      changeSlide(activeIndex - 1);
    } else if (dragOffset < -dragThreshold) {
      changeSlide(activeIndex + 1);
    }
  };

  if (!books || books.length === 0) return null;

  return (
    <div 
      className="book-coverflow" 
      id="book-coverflow-slider"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      style={{ overflow: 'visible', padding: '20px 0', height: '450px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
    >
      <motion.div
        className="book-swiper"
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.2}
        onDragEnd={onDragEnd}
        style={{ width: '100%', height: '100%', position: 'relative' }}
      >
        {books.map((book, index) => {
          let offset = index - activeIndex;
          const totalCards = books.length;
          
          if (offset > totalCards / 2) {
            offset -= totalCards;
          } else if (offset < -totalCards / 2) {
            offset += totalCards;
          }

          const isVisible = Math.abs(offset) <= 1;

          const animate = {
            x: `${offset * 50}%`, 
            scale: offset === 0 ? 1 : 0.85,
            zIndex: totalCards - Math.abs(offset),
            opacity: isVisible ? 1 : 0,
            transition: { type: "spring", stiffness: 260, damping: 30 },
          };

          const isActive = offset === 0;

          return (
            <motion.div
              key={book.id}
              className={`book-swiper-slide ${isActive ? 'book-swiper-slide--active' : ''}`}
              style={{
                position: 'absolute',
                top: 0,
                bottom: 0,
                left: 0,
                right: 0,
                margin: 'auto',
                transformStyle: "preserve-3d",
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '290px',
                aspectRatio: '3/4.15'
              }}
              animate={animate}
              initial={false}
            >
              <div 
                className={`book-card-slide ${isActive ? 'book-card-slide--active' : ''}`}
                style={{ width: '100%', height: '100%', borderRadius: 'var(--radius-xl)' }}
              >
                <img
                  src={book.coverImage}
                  alt={book.title}
                  className="book-card-slide__img"
                  loading="lazy"
                  draggable={false}
                />
                <div className="book-card-slide__overlay"></div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Navigation Buttons */}
      <button
        onClick={() => changeSlide(activeIndex - 1)}
        className="book-swiper-arrow book-swiper-arrow--prev"
        aria-label="Ảnh trước"
      >
        <ChevronLeft size={22} />
      </button>

      <button
        onClick={() => changeSlide(activeIndex + 1)}
        className="book-swiper-arrow book-swiper-arrow--next"
        aria-label="Ảnh sau"
      >
        <ChevronRight size={22} />
      </button>

      {/* Custom Pagination dots (bottom right) */}
      <div className="custom-swiper-pagination" style={{ bottom: '-15px', right: '25px', display: 'flex', gap: '8px', zIndex: 10 }}>
        {books.map((_, index) => (
          <span 
            key={index}
            onClick={() => changeSlide(index)}
            className={`swiper-pagination-bullet ${index === activeIndex ? 'swiper-pagination-bullet-active' : ''}`}
            style={{
              width: index === activeIndex ? '18px' : '6px',
              height: '6px',
              borderRadius: '99px',
              background: 'rgba(255, 255, 255, 0.5)',
              cursor: 'pointer',
              transition: 'all 0.3s'
            }}
          />
        ))}
      </div>
    </div>
  );
}
