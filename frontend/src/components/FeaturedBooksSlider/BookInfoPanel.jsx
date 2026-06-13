import React from 'react';
import { BookOpen, Play, Heart } from 'lucide-react';

export default function BookInfoPanel({ book }) {
  if (!book) return null;

  return (
    <div className="book-info-panel" id={`book-info-panel-${book.id}`}>
      {/* Title */}
      <h2 className="book-info-panel__title" id="book-title">
        {book.title}
      </h2>

      {/* Summary */}
      <p className="book-info-panel__summary" id="book-summary">
        {book.summary}
      </p>

      {/* Action Buttons */}
      <div className="book-info-panel__actions">
        {/* Đọc sách button */}
        <a
          href={book.readUrl}
          className="book-info-panel__btn book-info-panel__btn--primary"
          id="book-read-btn"
        >
          <BookOpen size={18} />
          <span>Đọc sách</span>
        </a>

        {/* Nghe sách audio button */}
        <a
          href={book.audioUrl}
          aria-label="Nghe sách nói"
          className="book-info-panel__btn-round"
          id="book-audio-btn"
        >
          <Play size={18} fill="currentColor" style={{ marginLeft: '2px' }} />
        </a>

        {/* Yêu thích button */}
        <button
          aria-label="Thêm vào yêu thích"
          className={`book-info-panel__btn-round ${book.isFavorite ? 'book-info-panel__btn-round--favorite' : ''}`}
          id="book-fav-btn"
        >
          <Heart size={18} fill={book.isFavorite ? "currentColor" : "none"} />
        </button>
      </div>
    </div>
  );
}
