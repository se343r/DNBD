import React from 'react';
import { ArrowUp } from 'lucide-react';
import './Footer.css';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <footer className="footer" id="footer-section">
      <div className="footer__inner">
        {/* Column 1: Brand & Back to Top */}
        <div className="footer__column brand-col">
          <a href="/" className="footer__logo">
            ✨ <span className="logo-text">Bắc Đẩu</span>
          </a>
          <p className="footer__desc">
            Nơi kết nối thế hệ trẻ với các giá trị lịch sử hào hùng, tôn vinh những tấm gương hiếu học và vĩ nhân dựng nước Đại Việt.
          </p>
          <button 
            className="footer__back-to-top" 
            onClick={scrollToTop}
            aria-label="Về đầu trang"
            title="Về đầu trang"
          >
            <ArrowUp size={16} />
            <span>Về đầu trang</span>
          </button>
        </div>

        {/* Column 2: Categories */}
        <div className="footer__column links-col">
          <h3 className="footer__title">Danh mục khám phá</h3>
          <ul className="footer__links">
            <li><a href="/danh-muc?cat=lanh-tu">Lãnh tụ & Chính trị gia</a></li>
            <li><a href="/danh-muc?cat=anh-hung">Anh hùng dân tộc</a></li>
            <li><a href="/danh-muc?cat=nha-van">Nhà văn & Đại thi hào</a></li>
            <li><a href="/danh-muc?cat=khoa-hoc">Nhà khoa học lỗi lạc</a></li>
          </ul>
        </div>

        {/* Column 3: Project info */}
        <div className="footer__column links-col">
          <h3 className="footer__title">Về dự án</h3>
          <ul className="footer__links">
            <li><a href="#about-section">Giới thiệu chung</a></li>
            <li><a href="/">Đội ngũ phát triển</a></li>
            <li><a href="/">Điều khoản sử dụng</a></li>
            <li><a href="/">Chính sách bảo mật</a></li>
          </ul>
        </div>

        {/* Column 4: Socials */}
        <div className="footer__column social-col">
          <h3 className="footer__title">Kết nối với chúng tôi</h3>
          <p className="footer__desc">Theo dõi để cập nhật các câu chuyện danh nhân hấp dẫn mỗi ngày.</p>
          <div className="footer__social-links">
            <a href="https://facebook.com" target="_blank" rel="noreferrer" className="footer__social-link" aria-label="Facebook">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer" className="footer__social-link" aria-label="Twitter">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
              </svg>
            </a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="footer__social-link" aria-label="Instagram">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678a6.162 6.162 0 100 12.324 6.162 6.162 0 100-12.324zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405a1.441 1.441 0 11-2.882 0 1.441 1.441 0 012.882 0z"/>
              </svg>
            </a>
            <a href="https://github.com" target="_blank" rel="noreferrer" className="footer__social-link" aria-label="Github">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
              </svg>
            </a>
          </div>
        </div>
      </div>

      <div className="footer__bottom">
        <div className="footer__bottom-inner">
          <p className="footer__copyright">
            © 2026 Dự án Danh nhân Bắc Đẩu. Phát triển bởi Đội ngũ Senior Frontend.
          </p>
          <p className="footer__tech">
            Powered by React + Vite. Designed with ❤️ for Vietnam History.
          </p>
        </div>
      </div>
    </footer>
  );
}
