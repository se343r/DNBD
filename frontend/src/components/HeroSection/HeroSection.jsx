import React from 'react';
import { ArrowRight, Compass } from 'lucide-react';
import { useTypewriter } from '../../hooks/useTypewriter';
import Button from '../common/Button/Button';
import './HeroSection.css';

export default function HeroSection() {
  const words = [
    'Hành trình tìm hiểu các bậc vĩ nhân Đại Việt',
    'Khám phá câu chuyện của những người mở cõi',
    'Lưu giữ tinh hoa văn hóa lịch sử ngàn năm',
  ];
  
  const typewriterText = useTypewriter(words, 80, 40, 2500);

  return (
    <section className="hero" id="hero-section">
      <div className="hero__inner">
        <div className="hero__image">
          <img 
            src="https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?q=80&w=800&auto=format&fit=crop"
            alt="Bản đồ sao Bắc Đẩu - Starry Sky"
            className="hero__img"
          />
          <div className="hero__image-overlay"></div>
          <div className="hero__floating-compass">
            <Compass size={40} className="compass-icon" />
          </div>
        </div>

        <div className="hero__content">
          <span className="hero__tagline">🌟 Dự án Danh nhân Lịch sử Việt Nam</span>
          
          <h1 className="hero__title" id="hero-title">
            DANH NHÂN<br />
            <span className="title-highlight">BẮC ĐẨU</span>
          </h1>

          <div className="hero__typewriter-container">
            <p className="hero__typewriter">{typewriterText}<span className="typewriter-cursor">|</span></p>
          </div>

          <div className="hero__quote">
            <span className="hero__quote-mark">“</span>
            <p className="hero__quote-text">
              Lịch sử là tấm gương phản chiếu quá khứ và là ngọn hải đăng soi sáng tương lai. Tìm hiểu về các bậc hiền tài là tìm về với cội nguồn sức mạnh dân tộc.
            </p>
          </div>

          <div className="hero__actions">
            <a href="#featured-slider-section">
              <Button variant="primary" size="lg" icon={ArrowRight} iconPosition="right">
                Bắt đầu khám phá
              </Button>
            </a>
            <a href="#about-section">
              <Button variant="outline" size="lg">
                Tìm hiểu thêm
              </Button>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
