import React, { useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Calendar, Compass, User } from 'lucide-react';
import timelineData from '../../data/timeline.json';
import figuresData from '../../data/figures.json';
import SectionTitle from '../common/SectionTitle/SectionTitle';
import './TimelineSection.css';

export default function TimelineSection() {
  const scrollContainerRef = useRef(null);
  const [scrollPosition, setScrollPosition] = useState(0);

  const scroll = (direction) => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const scrollAmount = 340; // Card width + gap
    const targetScroll = container.scrollLeft + (direction === 'left' ? -scrollAmount : scrollAmount);
    
    container.scrollTo({
      left: targetScroll,
      behavior: 'smooth',
    });
  };

  const getFigureName = (figureId) => {
    const figure = figuresData.find(f => f.id === figureId);
    return figure ? figure.name : '';
  };

  return (
    <section className="timeline-section" id="timeline-section">
      <div className="timeline-section__inner">
        <div className="timeline-header-container">
          <SectionTitle 
            title="Dòng Thời Gian Lịch Sử" 
            subtitle="Mốc son chói lọi"
            align="left"
          />
          {/* Scroll navigation arrows for desktop */}
          <div className="timeline-nav-arrows">
            <button 
              className="timeline-nav-arrow" 
              onClick={() => scroll('left')}
              aria-label="Cuộn sang trái"
            >
              <ArrowLeft size={18} />
            </button>
            <button 
              className="timeline-nav-arrow" 
              onClick={() => scroll('right')}
              aria-label="Cuộn sang phải"
            >
              <ArrowRight size={18} />
            </button>
          </div>
        </div>

        {/* Timeline Track Wrapper */}
        <div className="timeline-track-wrapper">
          {/* Axis line running behind the timeline */}
          <div className="timeline-axis-line"></div>

          {/* Scrolling card track */}
          <div className="timeline-cards-track" ref={scrollContainerRef}>
            {timelineData.map((item, index) => (
              <div key={item.id} className="timeline-card-wrapper">
                {/* Visual marker point on the axis */}
                <div className="timeline-axis-node">
                  <div className="node-outer">
                    <div className="node-inner"></div>
                  </div>
                  <span className="node-index">{index + 1}</span>
                </div>

                {/* Card Container */}
                <div className="timeline-card">
                  <span className="timeline-card-era">{item.era}</span>
                  <div className="timeline-card-year">
                    <Calendar size={16} />
                    <span>{item.year}</span>
                  </div>
                  <h3 className="timeline-card-title">{item.title}</h3>
                  <p className="timeline-card-desc">{item.description}</p>
                  
                  {item.figureId && (
                    <a 
                      href={`/danh-nhan/${item.figureId}`} 
                      className="timeline-card-figure-link"
                    >
                      <User size={14} />
                      <span>Nhân vật: {getFigureName(item.figureId)}</span>
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
