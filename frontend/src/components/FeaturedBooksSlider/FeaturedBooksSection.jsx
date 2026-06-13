import React, { useState, useMemo, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import BookInfoPanel from './BookInfoPanel';
import BookCoverflowSlider from './BookCoverflowSlider';
import { mockBooks } from '../../data/mockBooks';
import './FeaturedBooksSection.css';

// Extract unique categories from data
const allCategories = [...new Set(mockBooks.map(b => b.category))];

export default function FeaturedBooksSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState('Tất cả');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter books by selected category
  const filteredBooks = useMemo(() => {
    if (selectedCategory === 'Tất cả') return mockBooks;
    return mockBooks.filter(b => b.category === selectedCategory);
  }, [selectedCategory]);

  // Reset active index when category changes
  const handleCategorySelect = (cat) => {
    setSelectedCategory(cat);
    setActiveIndex(0);
    setDropdownOpen(false);
  };

  return (
    <section className="featured-books-section" id="featured-books-section">
      <div className="featured-books-inner">
        {/* Main Content: Info + Slider */}
        <div className="featured-books-grid">
          {/* Left Column: Top Bar + Info Panel */}
          <div className="featured-books-col-info">
            {/* Top Bar: "Đề Xuất" title + Category Dropdown */}
            <div className="featured-top-bar" id="featured-top-bar">
              <h2 className="featured-top-bar__title">Đề Xuất</h2>

              <div className="featured-top-bar__dropdown" ref={dropdownRef}>
                <button
                  className={`featured-dropdown-btn ${dropdownOpen ? 'featured-dropdown-btn--open' : ''}`}
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  id="category-dropdown-btn"
                  aria-haspopup="listbox"
                  aria-expanded={dropdownOpen}
                >
                  <span>{selectedCategory === 'Tất cả' ? 'Chọn thể loại' : selectedCategory}</span>
                  <ChevronDown size={18} className={`dropdown-chevron ${dropdownOpen ? 'dropdown-chevron--open' : ''}`} />
                </button>

                {dropdownOpen && (
                  <ul className="featured-dropdown-menu" role="listbox" id="category-dropdown-menu">
                    <li
                      role="option"
                      aria-selected={selectedCategory === 'Tất cả'}
                      className={`featured-dropdown-item ${selectedCategory === 'Tất cả' ? 'featured-dropdown-item--active' : ''}`}
                      onClick={() => handleCategorySelect('Tất cả')}
                    >
                      Tất cả thể loại
                    </li>
                    {allCategories.map((cat) => (
                      <li
                        key={cat}
                        role="option"
                        aria-selected={selectedCategory === cat}
                        className={`featured-dropdown-item ${selectedCategory === cat ? 'featured-dropdown-item--active' : ''}`}
                        onClick={() => handleCategorySelect(cat)}
                      >
                        {cat}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            <BookInfoPanel book={filteredBooks[activeIndex] || filteredBooks[0]} />
          </div>

          {/* Right Column: 3D Coverflow Slider */}
          <div className="featured-books-col-slider">
            <BookCoverflowSlider
              books={filteredBooks}
              onChangeIndex={setActiveIndex}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
