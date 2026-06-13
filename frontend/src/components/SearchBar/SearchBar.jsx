import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Compass, Clock } from 'lucide-react';
import figuresData from '../../data/figures.json';
import './SearchBar.css';

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeCategory, setActiveCategory] = useState('tat-ca');
  const dropdownRef = useRef(null);

  const categories = [
    { id: 'tat-ca', label: 'Tất cả' },
    { id: 'lanh-tu', label: 'Lãnh tụ' },
    { id: 'anh-hung', label: 'Anh hùng dân tộc' },
    { id: 'nha-van', label: 'Nhà văn & Nhà thơ' },
    { id: 'khoa-hoc', label: 'Nhà khoa học' },
  ];

  // Handle clicking outside suggestions to close them
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter figures for suggestions
  useEffect(() => {
    if (query.trim() === '') {
      setSuggestions([]);
      return;
    }

    const filtered = figuresData.filter(figure => {
      const matchesSearch = figure.name.toLowerCase().includes(query.toLowerCase()) || 
                            figure.realName.toLowerCase().includes(query.toLowerCase()) ||
                            figure.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()));
      
      const matchesCategory = activeCategory === 'tat-ca' || figure.category === activeCategory;
      
      return matchesSearch && matchesCategory;
    });

    setSuggestions(filtered.slice(0, 5)); // Show max 5 items
  }, [query, activeCategory]);

  const handleClear = () => {
    setQuery('');
    setSuggestions([]);
  };

  const handleChipClick = (catId) => {
    setActiveCategory(catId);
    // If there is query, trigger search/suggest recalculation
  };

  return (
    <section className="search-section" id="search-section">
      <div className="search-section__inner">
        <div className="search-bar__container" ref={dropdownRef}>
          {/* Main Input Frame */}
          <div className={`search-bar__input-wrapper ${showSuggestions && suggestions.length > 0 ? 'has-dropdown' : ''}`}>
            <Search className="search-icon" size={20} />
            <input
              type="text"
              placeholder="Tìm kiếm danh nhân, thời kỳ, từ khóa (ví dụ: cách mạng, truyện kiều)..."
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              className="search-input"
            />
            {query && (
              <button onClick={handleClear} className="clear-btn" aria-label="Xóa tìm kiếm">
                <X size={18} />
              </button>
            )}
          </div>

          {/* Suggestions Dropdown */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="suggestions-dropdown">
              <div className="suggestions-header">
                <span>Kết quả gợi ý ({suggestions.length})</span>
              </div>
              <ul className="suggestions-list">
                {suggestions.map(figure => (
                  <li key={figure.id} className="suggestion-item">
                    <a href={`/danh-nhan/${figure.id}`} className="suggestion-link">
                      <img 
                        src={figure.thumbnail} 
                        alt={figure.name} 
                        className="suggestion-thumb"
                      />
                      <div className="suggestion-info">
                        <span className="suggestion-name">{figure.name}</span>
                        <span className="suggestion-desc">{figure.shortDescription}</span>
                      </div>
                      <span className="suggestion-category">{figure.categoryLabel}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Suggestions Empty State */}
          {showSuggestions && query.trim() !== '' && suggestions.length === 0 && (
            <div className="suggestions-dropdown empty">
              <p>Không tìm thấy danh nhân phù hợp với từ khóa của bạn.</p>
            </div>
          )}
        </div>

        {/* Category Filter Chips */}
        <div className="search-chips">
          <span className="chips-label">Lọc nhanh:</span>
          <div className="chips-list">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => handleChipClick(cat.id)}
                className={`chip ${activeCategory === cat.id ? 'chip--active' : ''}`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
