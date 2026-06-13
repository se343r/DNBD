import React, { useState } from 'react';
import { Send, CheckCircle, Mail } from 'lucide-react';
import Button from '../common/Button/Button';
import './NewsletterCTA.css';

export default function NewsletterCTA() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  const validateEmail = (email) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) {
      setError('Vui lòng nhập địa chỉ email.');
      return;
    }
    if (!validateEmail(email)) {
      setError('Email không hợp lệ. Vui lòng kiểm tra lại.');
      return;
    }

    setError('');
    setIsSubmitted(true);
    setEmail('');
  };

  return (
    <section className="newsletter-cta" id="newsletter-cta">
      <div className="newsletter-cta__inner">
        {/* Decorative elements */}
        <div className="newsletter-decor-circle circle-1"></div>
        <div className="newsletter-decor-circle circle-2"></div>

        {!isSubmitted ? (
          <div className="newsletter-box">
            <div className="newsletter-icon-frame">
              <Mail size={28} className="mail-icon" />
            </div>

            <h2 className="newsletter-title">Đăng Ký Nhận Bài Viết Mới</h2>
            
            <p className="newsletter-desc">
              Nhận các bài phân tích sâu sắc, giai thoại hấp dẫn và câu chuyện cuộc đời của các bậc danh nhân Việt Nam trực tiếp vào hộp thư của bạn mỗi tuần.
            </p>

            <form onSubmit={handleSubmit} className="newsletter-form">
              <div className="input-group">
                <input
                  type="email"
                  placeholder="Nhập địa chỉ email của bạn..."
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError('');
                  }}
                  className={`newsletter-input ${error ? 'input-error' : ''}`}
                />
                {error && <span className="error-message">{error}</span>}
              </div>

              <Button 
                type="submit" 
                variant="primary" 
                size="lg" 
                icon={Send} 
                iconPosition="right"
                className="newsletter-submit-btn"
              >
                Đăng ký ngay
              </Button>
            </form>

            <span className="newsletter-meta">🔒 Cam kết bảo mật. Hủy đăng ký chỉ với 1 click.</span>
          </div>
        ) : (
          <div className="newsletter-success">
            <div className="success-icon-wrapper">
              <CheckCircle size={48} className="success-icon" />
            </div>
            
            <h2 className="success-title">Đăng Ký Thành Công!</h2>
            
            <p className="success-desc">
              Cảm ơn bạn đã quan tâm đến lịch sử nước nhà! Chúng tôi đã lưu địa chỉ email của bạn. Những câu chuyện danh nhân đầy cảm hứng sẽ sớm được gửi đến hòm thư của bạn.
            </p>

            <Button variant="outline" size="md" onClick={() => setIsSubmitted(false)}>
              Quay lại
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
