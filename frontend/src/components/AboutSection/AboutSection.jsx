import React, { useRef } from 'react';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import { useCountUp } from '../../hooks/useCountUp';
import { BookOpen, Star, Award } from 'lucide-react';
import './AboutSection.css';

export default function AboutSection() {
  const [revealRef, isVisible] = useScrollReveal();
  
  const countFigures = useCountUp(8, 2000, isVisible);
  const countMilestones = useCountUp(6, 2000, isVisible);
  const countEras = useCountUp(4, 2000, isVisible);

  return (
    <section className="about" id="about-section" ref={revealRef}>
      <div className="about__inner">
        <div className="about__content">
          <span className="about__subtitle">Về chúng tôi</span>
          <h2 className="about__title">Sứ Mệnh Tôn Vinh Lịch Sử</h2>
          <div className="about__text">
            <p>
              <strong>Bắc Đẩu</strong> - ngôi sao dẫn đường trong chòm Đại Hùng, từ xưa đã là kim chỉ nam cho người đi biển. Dự án <strong>"Danh nhân Bắc Đẩu"</strong> được xây dựng với sứ mệnh trở thành người dẫn đường tri thức, đưa bạn đọc quay ngược thời gian để tìm hiểu về những vĩ nhân lỗi lạc của dân tộc Việt Nam.
            </p>
            <p>
              Chúng tôi mong muốn kiến tạo một nền tảng đọc và học lịch sử trực quan, premium và đầy cảm hứng. Bằng cách kết hợp công nghệ hiện đại với kho tàng tri thức lịch sử hào hùng, "Danh nhân Bắc Đẩu" khơi dậy lòng tự hào dân tộc và lòng hiếu học trong mỗi thế hệ người Việt.
            </p>
          </div>

          {/* Stats Cards animated with useCountUp */}
          <div className="about__stats">
            <div className="stat-card">
              <div className="stat-icon-wrapper">
                <BookOpen size={20} className="stat-icon" />
              </div>
              <div className="stat-info">
                <span className="stat-number">{countFigures}</span>
                <span className="stat-label">Danh Nhân</span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon-wrapper">
                <Award size={20} className="stat-icon" />
              </div>
              <div className="stat-info">
                <span className="stat-number">{countMilestones}</span>
                <span className="stat-label">Mốc Lịch Sử</span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon-wrapper">
                <Star size={20} className="stat-icon" />
              </div>
              <div className="stat-info">
                <span className="stat-number">{countEras}</span>
                <span className="stat-label">Thời Kỳ</span>
              </div>
            </div>
          </div>
        </div>

        <div className="about__images">
          <div className="about__img about__img--1">
            <img 
              src="https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=400&auto=format&fit=crop" 
              alt="Học thuật cổ xưa" 
              className="about__figure-img"
            />
          </div>
          <div className="about__img about__img--2">
            <img 
              src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=400&auto=format&fit=crop" 
              alt="Danh họa/Tranh thư pháp cổ" 
              className="about__figure-img"
            />
          </div>
          <div className="about__img about__img--3">
            <img 
              src="https://images.unsplash.com/photo-1557971370-e7298ee473fb?q=80&w=400&auto=format&fit=crop" 
              alt="Bản đồ cổ" 
              className="about__figure-img"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
