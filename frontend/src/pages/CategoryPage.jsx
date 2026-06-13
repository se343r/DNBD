import React, { useState, useEffect, useMemo } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Search, Grid, List, ArrowLeft, Calendar, Award, ArrowRight, Eye, RefreshCw, Compass } from 'lucide-react';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import FeaturedBooksSection from '../components/FeaturedBooksSlider/FeaturedBooksSection';
import CategoryScrollCard from '../components/CategoryScrollCard/CategoryScrollCard';
import localFigures from '../data/figures.json';
import './CategoryPage.css';

const API_BASE_URL = '/api';

const categories = [
  {
    id: 'anh-hung',
    name: 'Quân sự & Anh hùng',
    description: 'Các vị tướng lĩnh kiệt xuất, anh hùng dân tộc giải phóng đất nước dựng nước và giữ nước.',
    gradient: 'linear-gradient(135deg, #581c1c 0%, #881337 60%, #b91c1c 100%)',
    bgImage: 'https://images.unsplash.com/photo-1599940824399-b87987ceb72a?q=80&w=800&auto=format&fit=crop',
    icon: '⚔️',
  },
  {
    id: 'lanh-tu',
    name: 'Chính trị & Lãnh tụ',
    description: 'Các lãnh tụ vĩ đại, nhà chính trị lỗi lạc khai quốc công thần và nhà ngoại giao xuất chúng.',
    gradient: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 60%, #2563eb 100%)',
    bgImage: 'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=800&auto=format&fit=crop',
    icon: '🏛️',
  },
  {
    id: 'khoa-hoc',
    name: 'Khoa học & Giáo dục',
    description: 'Những trạng nguyên hiền tài, nhà toán học lỗi lạc đặt nền móng tri thức nước Việt.',
    gradient: 'linear-gradient(135deg, #064e3b 0%, #065f46 60%, #059669 100%)',
    bgImage: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=800&auto=format&fit=crop',
    icon: '🎓',
  },
  {
    id: 'nha-van',
    name: 'Văn học & Nghệ thuật',
    description: 'Các đại thi hào dân tộc, nhà thơ lớn và những danh nhân nghệ thuật văn hóa kiệt xuất.',
    gradient: 'linear-gradient(135deg, #78350f 0%, #92400e 60%, #d97706 100%)',
    bgImage: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=800&auto=format&fit=crop',
    icon: '✒️',
  },
  {
    id: 'cong-nghe',
    name: 'Công nghệ & Kỹ thuật',
    description: 'Các danh nhân kỹ sư đóng góp phát triển khoa học công nghệ tiên tiến hiện đại.',
    gradient: 'linear-gradient(135deg, #374151 0%, #4b5563 60%, #6b7280 100%)',
    bgImage: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=800&auto=format&fit=crop',
    icon: '💻',
  },
  {
    id: 'kinh-doanh',
    name: 'Kinh doanh & Doanh nhân',
    description: 'Các thương gia vĩ đại dựng nghiệp kinh tế quốc dân, kiến thiết giao thương thịnh trị.',
    gradient: 'linear-gradient(135deg, #111827 0%, #1f2937 60%, #374151 100%)',
    bgImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=800&auto=format&fit=crop',
    icon: '💼',
  }
];

// Helper to remove accents for robust searching and slug matching
const slugify = (str) => {
  if (!str) return '';
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[đĐ]/g, 'd')
    .replace(/([^a-z0-9\s-]|)/g, '')
    .trim()
    .replace(/\s+/g, '-');
};

export default function CategoryPage() {
  const { categoryId } = useParams();
  const navigate = useNavigate();

  // State management
  const [figures, setFigures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [usingFallback, setUsingFallback] = useState(false);

  // Filter & UI state
  const [searchText, setSearchText] = useState('');
  const [selectedEra, setSelectedEra] = useState('All');
  const [sortBy, setSortBy] = useState('name-asc');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

  // Fetch figures
  useEffect(() => {
    const fetchFigures = async () => {
      try {
        setLoading(true);
        setErrorMsg('');
        const response = await fetch(`${API_BASE_URL}/celebrities`);
        if (!response.ok) throw new Error('API server error');
        const data = await response.json();
        
        // Ensure data is an array
        if (Array.isArray(data)) {
          setFigures(data);
          setUsingFallback(false);
        } else {
          throw new Error('Data format invalid');
        }
      } catch (error) {
        console.warn('Backend API connection failed, using local figures.json data fallback:', error.message);
        setFigures(localFigures);
        setUsingFallback(true);
      } finally {
        setLoading(false);
      }
    };
    fetchFigures();
  }, []);

  // Back to category list
  const handleBackToList = () => {
    navigate('/danh-muc');
    setSearchText('');
    setSelectedEra('All');
    setSortBy('name-asc');
  };

  // Find active category
  const activeCategory = useMemo(() => {
    if (!categoryId) return null;
    return categories.find(cat => cat.id === categoryId);
  }, [categoryId]);

  // Unified dynamic filtering logic
  const filteredFigures = useMemo(() => {
    if (!categoryId) return [];

    let list = figures.filter(fig => {
      // 1. Filter by category
      let inCategory = false;
      
      // Static category ID matching
      if (fig.category === categoryId) {
        inCategory = true;
      }
      
      // DB fields matching
      if (!inCategory && fig.fields && Array.isArray(fig.fields)) {
        inCategory = fig.fields.some(field => {
          const fieldSlug = slugify(field.name);
          return fieldSlug === categoryId || field.id?.toString() === categoryId || 
                 (categoryId === 'anh-hung' && fieldSlug === 'quan-su') ||
                 (categoryId === 'lanh-tu' && fieldSlug === 'chinh-tri') ||
                 (categoryId === 'khoa-hoc' && fieldSlug === 'khoa-hoc') ||
                 (categoryId === 'nha-van' && fieldSlug === 'van-hoc');
        });
      }

      if (!inCategory) return false;

      // 2. Filter by Search Text (Name, alternativeName, achievements)
      if (searchText.trim() !== '') {
        const query = slugify(searchText);
        const nameMatch = slugify(fig.name).includes(query);
        const altMatch = fig.alternative_name ? slugify(fig.alternative_name).includes(query) : false;
        const realNameMatch = fig.realName ? slugify(fig.realName).includes(query) : false;
        const shortDescMatch = fig.shortDescription ? slugify(fig.shortDescription).includes(query) : false;
        const achievementsMatch = fig.achievements ? fig.achievements.some(a => slugify(a).includes(query)) : false;

        if (!nameMatch && !altMatch && !realNameMatch && !shortDescMatch && !achievementsMatch) {
          return false;
        }
      }

      // 3. Filter by Era
      if (selectedEra !== 'All') {
        const figureEra = fig.era || fig.period_name || '';
        if (!figureEra.toLowerCase().includes(selectedEra.toLowerCase())) {
          return false;
        }
      }

      return true;
    });

    // 4. Sorting logic
    return list.sort((a, b) => {
      if (sortBy === 'name-asc') {
        return a.name.localeCompare(b.name, 'vi');
      } else if (sortBy === 'name-desc') {
        return b.name.localeCompare(a.name, 'vi');
      } else if (sortBy === 'birth-asc') {
        const yearA = a.birthYear || parseInt(a.birth_date) || 0;
        const yearB = b.birthYear || parseInt(b.birth_date) || 0;
        return yearA - yearB;
      } else if (sortBy === 'birth-desc') {
        const yearA = a.birthYear || parseInt(a.birth_date) || 0;
        const yearB = b.birthYear || parseInt(b.birth_date) || 0;
        return yearB - yearA;
      }
      return 0;
    });
  }, [figures, categoryId, searchText, selectedEra, sortBy]);

  // Eras options based on active category data
  const availableEras = useMemo(() => {
    if (!categoryId) return [];
    
    // Default eras list
    return ['All', 'Cổ đại', 'Trung đại', 'Cận đại', 'Hiện đại'];
  }, [categoryId]);

  return (
    <div className="category-page" id="category-page">
      <Header />
      
      <main className="category-page__main">
        {/* Dynamic Header Promotion: Coverflow Book Slider */}
        <FeaturedBooksSection />

        <div className="category-page__inner">
          {/* STATE 1: Overall Categories Grid (No Category ID selected) */}
          {!categoryId && (
            <div className="category-scroll-section animate-fadeIn" id="category-scroll-section">
              {categories.map((cat, catIndex) => {
                // Filter figures belonging to this category
                const catFigures = figures.filter(fig => {
                  if (fig.category === cat.id) return true;
                  if (fig.fields && Array.isArray(fig.fields)) {
                    return fig.fields.some(field => slugify(field.name) === cat.id || 
                           (cat.id === 'anh-hung' && slugify(field.name) === 'quan-su') ||
                           (cat.id === 'lanh-tu' && slugify(field.name) === 'chinh-tri') ||
                           (cat.id === 'khoa-hoc' && slugify(field.name) === 'khoa-hoc') ||
                           (cat.id === 'nha-van' && slugify(field.name) === 'van-hoc'));
                  }
                  return false;
                });

                return (
                  <div
                    key={cat.id}
                    className="category-scroll-row"
                    id={`category-row-${cat.id}`}
                    style={{ '--row-delay': `${catIndex * 0.1}s` }}
                  >
                    {/* Row Header */}
                    <div className="category-scroll-row__header">
                      <div className="category-scroll-row__left">
                        <span className="category-scroll-row__icon">{cat.icon}</span>
                        <h2 className="category-scroll-row__title">{cat.name}</h2>
                      </div>
                      <Link
                        to={`/danh-muc/${cat.id}`}
                        className="category-scroll-row__see-all"
                      >
                        <span>Xem tất cả</span>
                        <ArrowRight size={14} />
                      </Link>
                    </div>

                    {/* Horizontal Scroll Track */}
                    <div className="category-scroll-row__track">
                      {catFigures.length > 0 ? (
                        catFigures.map(fig => (
                          <CategoryScrollCard key={fig.id} figure={fig} />
                        ))
                      ) : (
                        <div className="category-scroll-row__empty">
                          <span>📚</span>
                          <p>Đang cập nhật nhân vật cho danh mục này...</p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* STATE 2: Category Details Explorer View (Category selected) */}
          {categoryId && activeCategory && (
            <div className="category-detail-explorer animate-fadeIn" id="category-detail-explorer">
              
              {/* Back to Category Grid button */}
              <button onClick={handleBackToList} className="category-detail-back-btn" id="category-back-btn">
                <ArrowLeft size={16} />
                <span>Trở lại danh sách danh mục</span>
              </button>

              <div className="category-detail-layout">
                {/* 2.1 Sticky LEFT Sidebar: Categories Quick Navigation */}
                <aside className="category-sidebar">
                  <div className="category-sidebar__box">
                    <h3 className="category-sidebar__title">Lĩnh Vực Khác</h3>
                    <nav className="category-sidebar__nav">
                      {categories.map((cat) => (
                        <Link
                          key={cat.id}
                          to={`/danh-muc/${cat.id}`}
                          className={`category-sidebar__link ${cat.id === categoryId ? 'category-sidebar__link--active' : ''}`}
                        >
                          <span className="sidebar-link-icon">{cat.icon}</span>
                          <span className="sidebar-link-name">{cat.name}</span>
                        </Link>
                      ))}
                    </nav>
                  </div>
                </aside>

                {/* 2.2 MAIN AREA: Figure Details, Search, Filters, and List */}
                <section className="category-main-content">
                  {/* Category Header */}
                  <div className="category-detail-header" style={{ '--cat-gradient': activeCategory.gradient }}>
                    <div className="category-detail-header__visual">
                      <img src={activeCategory.bgImage} alt={activeCategory.name} className="category-detail-header__img" />
                      <div className="category-detail-header__overlay"></div>
                    </div>
                    <div className="category-detail-header__text">
                      <span className="category-detail-header__icon">{activeCategory.icon}</span>
                      <h1 className="category-detail-header__title">{activeCategory.name}</h1>
                      <p className="category-detail-header__desc">{activeCategory.description}</p>
                    </div>
                  </div>

                  {/* Dynamic Indicators: loading / fallback state */}
                  {loading && (
                    <div className="category-loading-indicator">
                      <RefreshCw size={20} className="spinner" />
                      <span>Đang tải thông tin danh nhân...</span>
                    </div>
                  )}

                  {!loading && usingFallback && (
                    <div className="category-fallback-notice">
                      <span>💡 Đang chạy ở chế độ Offline (sử dụng dữ liệu dự phòng cục bộ).</span>
                    </div>
                  )}

                  {/* Interactive Filtering and Search Toolbar */}
                  <div className="category-toolbar">
                    {/* Search Input Box */}
                    <div className="category-toolbar__search">
                      <Search size={18} className="search-box-icon" />
                      <input
                        type="text"
                        placeholder="Tìm kiếm danh nhân theo tên, tự tự, thành tựu..."
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        className="search-box-input"
                        id="figure-search-input"
                      />
                    </div>

                    {/* Era Tabs */}
                    <div className="category-toolbar__eras">
                      {availableEras.map((era) => (
                        <button
                          key={era}
                          onClick={() => setSelectedEra(era)}
                          className={`era-tab ${selectedEra === era ? 'era-tab--active' : ''}`}
                          id={`era-tab-${era}`}
                        >
                          {era === 'All' ? 'Tất cả thời kỳ' : era}
                        </button>
                      ))}
                    </div>

                    {/* Sorter and Layout Toggler */}
                    <div className="category-toolbar__right">
                      {/* Sorter selection */}
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="category-sorter"
                        id="category-sort-select"
                        aria-label="Sắp xếp danh sách"
                      >
                        <option value="name-asc">Sắp xếp: Tên A-Z</option>
                        <option value="name-desc">Sắp xếp: Tên Z-A</option>
                        <option value="birth-asc">Năm sinh: Tăng dần</option>
                        <option value="birth-desc">Năm sinh: Giảm dần</option>
                      </select>

                      {/* View Mode Toggle buttons */}
                      <div className="view-toggle">
                        <button
                          onClick={() => setViewMode('grid')}
                          className={`view-toggle-btn ${viewMode === 'grid' ? 'view-toggle-btn--active' : ''}`}
                          aria-label="Xem dạng lưới"
                          id="view-grid-btn"
                        >
                          <Grid size={16} />
                        </button>
                        <button
                          onClick={() => setViewMode('list')}
                          className={`view-toggle-btn ${viewMode === 'list' ? 'view-toggle-btn--active' : ''}`}
                          aria-label="Xem dạng danh sách"
                          id="view-list-btn"
                        >
                          <List size={16} />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Figure List Display Grid/List */}
                  {!loading && filteredFigures.length > 0 && (
                    <div className={`figures-${viewMode}`} id="figures-display-container">
                      {filteredFigures.map((fig, idx) => {
                        const figureId = fig.id;
                        const figureName = fig.name;
                        const altName = fig.alternative_name || fig.realName;
                        const lifespan = fig.lifespan || `${fig.birth_date || ''} – ${fig.death_date || ''}`;
                        const eraName = fig.era || fig.period_name || 'Lịch sử';
                        const achievements = fig.achievements || [];
                        const summary = fig.shortDescription || fig.summary || '';
                        
                        // Default image fallback if missing
                        const imgUrl = fig.avatar_image || fig.image || 'https://images.unsplash.com/photo-1578925547913-d86a9e16d814?q=80&w=300&auto=format&fit=crop';

                        return (
                          <div 
                            key={figureId} 
                            className="figure-card" 
                            id={`figure-card-${figureId}`}
                            style={{ '--card-anim-delay': `${idx * 0.05}s` }}
                          >
                            <div className="figure-card__img-container">
                              <img src={imgUrl} alt={figureName} className="figure-card__img" />
                              <div className="figure-card__img-overlay"></div>
                              <span className="figure-card__era-badge">
                                <Calendar size={12} />
                                {eraName}
                              </span>
                            </div>

                            <div className="figure-card__content">
                              <span className="figure-card__lifespan">🗓️ {lifespan}</span>
                              <h3 className="figure-card__name">
                                {figureName}
                                {altName && <span className="figure-card__alt-name"> ({altName})</span>}
                              </h3>
                              <p className="figure-card__summary">{summary}</p>

                              {achievements.length > 0 && (
                                <div className="figure-card__achievements">
                                  <h4 className="achievements-heading">
                                    <Award size={14} />
                                    Thành tựu chính:
                                  </h4>
                                  <ul>
                                    {achievements.slice(0, 2).map((ach, aIdx) => (
                                      <li key={aIdx}>✨ {ach}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}

                              <div className="figure-card__footer">
                                <Link to={`/danh-nhan/${figureId}`} className="figure-card__cta" id={`figure-card-cta-${figureId}`}>
                                  <span>Đọc tiểu sử</span>
                                  <ArrowRight size={14} />
                                </Link>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Empty state: No figures match filters */}
                  {!loading && filteredFigures.length === 0 && (
                    <div className="figures-empty-state" id="figures-empty-state">
                      <div className="empty-state-icon">🔍</div>
                      <h3>Không tìm thấy nhân vật nào</h3>
                      <p>Rất tiếc, không có nhân vật lịch sử nào trong danh mục phù hợp với bộ lọc tìm kiếm hoặc thời kỳ đã chọn của bạn.</p>
                      <button 
                        onClick={() => {
                          setSearchText('');
                          setSelectedEra('All');
                        }}
                        className="empty-state-reset-btn"
                        id="empty-reset-btn"
                      >
                        Đặt lại bộ lọc
                      </button>
                    </div>
                  )}
                </section>
              </div>

            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
