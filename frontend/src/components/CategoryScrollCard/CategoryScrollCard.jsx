import React, { useState, useRef, useCallback, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import { BookOpen, Heart } from 'lucide-react';
import './CategoryScrollCard.css';

/**
 * Mock data cho demo — bổ sung tác giả, giá tiền cho từng nhân vật.
 * Trong thực tế, data này sẽ đến từ API.
 */
const mockExtras = {
  'ho-chi-minh':    { author: 'Trần Dân Tiên',    price: '89.000đ' },
  'tran-hung-dao':  { author: 'Hoàng Quốc Hải',   price: '79.000đ' },
  'nguyen-du':      { author: 'Nguyễn Lộc',        price: '69.000đ' },
  'le-loi':         { author: 'Phan Huy Lê',       price: '75.000đ' },
  'hai-ba-trung':   { author: 'Lê Văn Hưu',        price: '65.000đ' },
  'nguyen-trai':    { author: 'Trần Huy Liệu',     price: '72.000đ' },
  'vo-nguyen-giap': { author: 'Cecil B. Currey',    price: '99.000đ' },
  'luong-the-vinh': { author: 'Quỳnh Cư',          price: '59.000đ' },
};

const POPUP_WIDTH = 340;
const POPUP_GAP = 8;

/**
 * CategoryScrollCard — Thẻ nhân vật dạng bìa sách
 * Card cơ bản: ảnh trên, tên dưới (không overlay)
 * Hover: popup chi tiết hiện ra bên cạnh (qua Portal)
 */
export default function CategoryScrollCard({ figure, className = '' }) {
  const [isHovered, setIsHovered] = useState(false);
  const [popupStyle, setPopupStyle] = useState({});
  const cardRef = useRef(null);
  const closeTimer = useRef(null);

  const imgUrl =
    figure.thumbnail ||
    figure.image ||
    figure.avatar_image ||
    'https://images.unsplash.com/photo-1578925547913-d86a9e16d814?q=80&w=300&auto=format&fit=crop';

  const extras = mockExtras[figure.id] || { author: figure.categoryLabel || 'Tác giả', price: '49.000đ' };
  const description = figure.shortDescription || figure.fullBio || figure.summary || '';

  // -- Hover handlers with delay to allow moving to popup --
  const calculatePosition = useCallback(() => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    let top = rect.top + window.scrollY;
    let left;

    // Try positioning to the right first
    if (rect.right + POPUP_GAP + POPUP_WIDTH < vw) {
      left = rect.right + POPUP_GAP;
    } else {
      // Fall back to the left
      left = rect.left - POPUP_GAP - POPUP_WIDTH;
    }

    // Clamp to not go below viewport
    const popupEstimatedHeight = 280;
    if (rect.top + popupEstimatedHeight > vh) {
      top = rect.bottom + window.scrollY - popupEstimatedHeight;
    }

    setPopupStyle({ top, left, width: POPUP_WIDTH });
  }, []);

  const handleMouseEnter = useCallback(() => {
    clearTimeout(closeTimer.current);
    calculatePosition();
    setIsHovered(true);
  }, [calculatePosition]);

  const handleMouseLeave = useCallback(() => {
    closeTimer.current = setTimeout(() => {
      setIsHovered(false);
    }, 150); // small delay so user can move to popup
  }, []);

  const handlePopupEnter = useCallback(() => {
    clearTimeout(closeTimer.current);
  }, []);

  const handlePopupLeave = useCallback(() => {
    closeTimer.current = setTimeout(() => {
      setIsHovered(false);
    }, 100);
  }, []);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => clearTimeout(closeTimer.current);
  }, []);

  return (
    <div
      className={`scroll-card-wrapper ${className}`}
      ref={cardRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Card: Image on top, text below */}
      <Link
        to={`/danh-nhan/${figure.id}`}
        className="scroll-card"
        id={`scroll-card-${figure.id}`}
      >
        <div className="scroll-card__image">
          <img src={imgUrl} alt={figure.name} loading="lazy" />
        </div>
      </Link>

      {/* Text label below image */}
      <div className="scroll-card__label">
        <h4 className="scroll-card__name">{figure.name}</h4>
      </div>

      {/* Hover Popup — rendered via Portal to escape overflow:hidden */}
      {isHovered &&
        createPortal(
          <div
            className="scroll-card-popup"
            style={{
              position: 'absolute',
              top: `${popupStyle.top}px`,
              left: `${popupStyle.left}px`,
              width: `${popupStyle.width}px`,
            }}
            onMouseEnter={handlePopupEnter}
            onMouseLeave={handlePopupLeave}
          >
            {/* Popup inner content */}
            <div className="scroll-card-popup__inner">
              {/* Left: thumbnail */}
              <div className="scroll-card-popup__thumb">
                <img src={imgUrl} alt={figure.name} />
              </div>

              {/* Right: details */}
              <div className="scroll-card-popup__details">
                <h3 className="scroll-card-popup__title">{figure.name}</h3>
                <p className="scroll-card-popup__author">{extras.author}</p>
                <p className="scroll-card-popup__price">{extras.price}</p>

                {/* Action buttons */}
                <div className="scroll-card-popup__actions">
                  <Link
                    to={`/danh-nhan/${figure.id}`}
                    className="scroll-card-popup__read-btn"
                  >
                    <BookOpen size={14} />
                    <span>Đọc sách</span>
                  </Link>
                  <button className="scroll-card-popup__heart-btn" aria-label="Yêu thích">
                    <Heart size={16} />
                  </button>
                </div>

                {/* Description */}
                {description && (
                  <p className="scroll-card-popup__desc">{description}</p>
                )}

                {/* Detail link */}
                <Link
                  to={`/danh-nhan/${figure.id}`}
                  className="scroll-card-popup__detail-link"
                >
                  Chi tiết
                </Link>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}
