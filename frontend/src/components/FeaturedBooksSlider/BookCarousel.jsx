import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import './BookCarousel.css';

const SparklesIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M9.93 2.25 12 7.5l2.07-5.25a.5.5 0 0 1 .9 0L17.25 8.5l4.16.34a.5.5 0 0 1 .29.88l-3.2 3.1.95 4.5a.5.5 0 0 1-.73.53L12 14.5l-3.72 2.33a.5.5 0 0 1-.73-.53l.95-4.5-3.2-3.1a.5.5 0 0 1 .29-.88l4.16-.34Z" />
  </svg>
);

const ChevronLeftIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="m15 18-6-6 6-6" />
  </svg>
);

const ChevronRightIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="m9 18 6-6-6-6" />
  </svg>
);

const Badge = ({ children, className }) => (
  <div className={`book-carousel-badge ${className || ''}`}>
    {children}
  </div>
);

export default function BookCarousel({ books, activeIndex, onChangeIndex }) {
  const [localActiveIndex, setLocalActiveIndex] = useState(activeIndex || 0);
  const [isPaused, setIsPaused] = useState(false);
  const autoplayIntervalRef = useRef(null);
  const autoplayDelay = 3000;

  useEffect(() => {
    if (activeIndex !== undefined && activeIndex !== localActiveIndex) {
      setLocalActiveIndex(activeIndex);
    }
  }, [activeIndex]);

  const goToNext = () => {
    setLocalActiveIndex((prev) => {
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
    setLocalActiveIndex(newSafeIndex);
    if (onChangeIndex) onChangeIndex(newSafeIndex);
    
    if (autoplayIntervalRef.current) {
      clearInterval(autoplayIntervalRef.current);
    }
    if (!isPaused) {
      autoplayIntervalRef.current = setInterval(goToNext, autoplayDelay);
    }
  };

  const onDragEnd = (event, info) => {
    const dragThreshold = 75;
    const dragOffset = info.offset.x;
    if (dragOffset > dragThreshold) {
      changeSlide(localActiveIndex - 1);
    } else if (dragOffset < -dragThreshold) {
      changeSlide(localActiveIndex + 1);
    }
  };

  if (!books || books.length === 0) return null;

  return (
    <div className="book-carousel-container" onMouseEnter={() => setIsPaused(true)} onMouseLeave={() => setIsPaused(false)}>
      <div className="book-carousel-inner">
        <Badge>
          <SparklesIcon className="badge-icon" />
          Nổi bật nhất
        </Badge>

        <div className="book-carousel-track-wrapper">
          <motion.div 
            className="book-carousel-track" 
            drag="x" 
            dragConstraints={{ left: 0, right: 0 }} 
            dragElastic={0.2} 
            onDragEnd={onDragEnd}
          >
            {books.map((book, index) => (
              <Card 
                key={book.id || index} 
                book={book} 
                index={index} 
                activeIndex={localActiveIndex} 
                totalCards={books.length} 
              />
            ))}
          </motion.div>
        </div>

        <div className="book-carousel-controls">
          <button onClick={() => changeSlide(localActiveIndex - 1)} className="control-btn">
            <ChevronLeftIcon className="control-icon" />
          </button>

          <div className="book-carousel-dots">
            {books.map((_, index) => (
              <button 
                key={index} 
                onClick={() => changeSlide(index)} 
                className={`dot-btn ${localActiveIndex === index ? "dot-btn--active" : ""}`} 
                aria-label={`Go to slide ${index + 1}`} 
              />
            ))}
          </div>

          <button onClick={() => changeSlide(localActiveIndex + 1)} className="control-btn">
            <ChevronRightIcon className="control-icon" />
          </button>
        </div>
      </div>
    </div>
  );
}

function Card({ book, index, activeIndex, totalCards }) {
  let offset = index - activeIndex;
  if (offset > totalCards / 2) {
    offset -= totalCards;
  } else if (offset < -totalCards / 2) {
    offset += totalCards;
  }
  
  const isVisible = Math.abs(offset) <= 1;
  const animate = {
    x: `${offset * 65}%`,
    scale: offset === 0 ? 1 : 0.8,
    zIndex: totalCards - Math.abs(offset),
    opacity: isVisible ? 1 : 0,
    transition: {
      type: "spring",
      stiffness: 260,
      damping: 30
    }
  };
  
  return (
    <motion.div 
      className="book-carousel-card-wrapper" 
      style={{ transformStyle: "preserve-3d" }} 
      animate={animate} 
      initial={false}
    >
      <div className="book-carousel-card">
        <img 
          src={book.coverImage} 
          alt={book.title} 
          className="book-carousel-card-img" 
          onError={e => {
            const target = e.target;
            target.onerror = null;
            target.src = "https://placehold.co/400x600/1e1e1e/ffffff?text=Image+Missing";
          }} 
        />
        <div className="book-carousel-card-overlay">
          <h4 className="book-carousel-card-title">{book.title}</h4>
        </div>
      </div>
    </motion.div>
  );
}
