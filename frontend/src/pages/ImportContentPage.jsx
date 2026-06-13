import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Sparkles, Layout, Eye, CheckCircle, AlertCircle, Plus, X, List, Image, FileText } from 'lucide-react';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import './ImportContentPage.css';

const API_CELEBRITIES_URL = '/api/celebrities';

const CATEGORIES = [
  { id: 'anh-hung', label: 'Quân sự & Anh hùng' },
  { id: 'lanh-tu', label: 'Chính trị & Lãnh tụ' },
  { id: 'khoa-hoc', label: 'Khoa học & Giáo dục' },
  { id: 'nha-van', label: 'Văn học & Nghệ thuật' }
];

const ERAS = ['Cổ đại', 'Trung đại', 'Cận đại', 'Hiện đại'];

export default function ImportContentPage() {
  const navigate = useNavigate();

  // Core Form states
  const [name, setName] = useState('');
  const [realName, setRealName] = useState('');
  const [birthYear, setBirthYear] = useState('');
  const [deathYear, setDeathYear] = useState('');
  const [category, setCategory] = useState('anh-hung');
  const [era, setEra] = useState('Trung đại');
  const [image, setImage] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [fullBio, setFullBio] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  
  // Dynamic arrays states
  const [achievements, setAchievements] = useState(['']);
  const [facts, setFacts] = useState(['']);
  const [galleryImages, setGalleryImages] = useState(['', '']);
  const [related, setRelated] = useState([{ title: '', content: '', image: '' }]);

  // UI state
  const [previewMode, setPreviewMode] = useState('card'); // 'card' or 'detail'
  const [activeTab, setActiveTab] = useState('basic'); // 'basic' or 'detail-content'
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Achievements handlers
  const handleAddAchievement = () => setAchievements([...achievements, '']);
  const handleRemoveAchievement = (index) => {
    const updated = achievements.filter((_, i) => i !== index);
    setAchievements(updated.length === 0 ? [''] : updated);
  };
  const handleAchievementChange = (index, value) => {
    const updated = [...achievements];
    updated[index] = value;
    setAchievements(updated);
  };

  // Facts handlers
  const handleAddFact = () => setFacts([...facts, '']);
  const handleRemoveFact = (index) => {
    const updated = facts.filter((_, i) => i !== index);
    setFacts(updated.length === 0 ? [''] : updated);
  };
  const handleFactChange = (index, value) => {
    const updated = [...facts];
    updated[index] = value;
    setFacts(updated);
  };

  // Gallery image handlers
  const handleGalleryChange = (index, value) => {
    const updated = [...galleryImages];
    updated[index] = value;
    setGalleryImages(updated);
  };

  // Related articles handlers
  const handleAddRelated = () => setRelated([...related, { title: '', content: '', image: '' }]);
  const handleRemoveRelated = (index) => {
    const updated = related.filter((_, i) => i !== index);
    setRelated(updated.length === 0 ? [{ title: '', content: '', image: '' }] : updated);
  };
  const handleRelatedChange = (index, field, value) => {
    const updated = [...related];
    updated[index] = { ...updated[index], [field]: value };
    setRelated(updated);
  };

  // Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg('Vui lòng nhập tên vĩ nhân');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');
    setSuccess(false);

    // Format fields
    const tags = tagsInput
      .split(',')
      .map(t => t.trim())
      .filter(t => t !== '');
    
    const cleanAchievements = achievements.map(a => a.trim()).filter(a => a !== '');
    const cleanFacts = facts.map(f => f.trim()).filter(f => f !== '');
    const cleanGallery = galleryImages.map(img => img.trim()).filter(img => img !== '');
    const cleanRelated = related.filter(r => r.title.trim() !== '' && r.content.trim() !== '');

    const selectedCat = CATEGORIES.find(c => c.id === category);

    const payload = {
      name,
      realName: realName || name,
      birthYear: parseInt(birthYear) || null,
      deathYear: parseInt(deathYear) || null,
      lifespan: `${birthYear || ''} – ${deathYear || ''}`,
      category,
      categoryLabel: selectedCat ? selectedCat.label : 'Danh nhân',
      shortDescription,
      fullBio,
      image: image || 'https://images.unsplash.com/photo-1578925547913-d86a9e16d814?q=80&w=300&auto=format&fit=crop',
      tags,
      achievements: cleanAchievements,
      era,
      facts: cleanFacts,
      galleryImages: cleanGallery,
      related: cleanRelated
    };

    try {
      const response = await fetch(API_CELEBRITIES_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Có lỗi xảy ra khi gửi dữ liệu lên server.');
      }

      setSuccess(true);
      // Reset form
      setName('');
      setRealName('');
      setBirthYear('');
      setDeathYear('');
      setShortDescription('');
      setFullBio('');
      setImage('');
      setTagsInput('');
      setAchievements(['']);
      setFacts(['']);
      setGalleryImages(['', '']);
      setRelated([{ title: '', content: '', image: '' }]);

      // Auto redirect
      setTimeout(() => {
        navigate(`/danh-muc/${category}`);
      }, 2500);

    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || 'Không thể kết nối đến Backend. Vui lòng đảm bảo server đang chạy.');
    } finally {
      setIsLoading(false);
    }
  };

  // Derive Preview Values
  const previewFigureName = name || 'Tên Vĩ Nhân';
  const previewRealName = realName || '';
  const previewLifespan = `${birthYear || '?' } – ${deathYear || '?'}`;
  const previewSummary = shortDescription || 'Mô tả ngắn về vĩ nhân sẽ hiển thị ở đây khi bạn nhập vào form nhập liệu...';
  const previewBio = fullBio || 'Tiểu sử chi tiết đầy đủ của vĩ nhân sẽ hiển thị tại đây khi bạn điền nội dung...';
  const previewImg = image || 'https://images.unsplash.com/photo-1578925547913-d86a9e16d814?q=80&w=300&auto=format&fit=crop';
  const previewTags = tagsInput.split(',').map(t => t.trim()).filter(t => t !== '');
  const previewAchievements = achievements.filter(a => a.trim() !== '');
  
  const previewFacts = facts.filter(f => f.trim() !== '');
  const finalFacts = previewFacts.length > 0 ? previewFacts : ['Câu chuyện sự thật thú vị thứ nhất...', 'Câu chuyện sự thật thú vị thứ hai...'];
  
  const finalGallery = galleryImages.map(img => img.trim()).filter(img => img !== '');
  const previewGallery1 = finalGallery[0] || 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=300&auto=format&fit=crop';
  const previewGallery2 = finalGallery[1] || 'https://images.unsplash.com/photo-1599940824399-b87987ceb72a?q=80&w=300&auto=format&fit=crop';

  const previewRelated = related.filter(r => r.title.trim() !== '');
  const finalRelated = previewRelated.length > 0 ? previewRelated : [
    { title: 'Bài viết liên quan thứ nhất', content: 'Nội dung sơ lược bài viết liên quan...', image: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?q=80&w=300&auto=format&fit=crop' }
  ];
  const [currentRelatedPreview, setCurrentRelatedPreview] = useState(0);
  const activeRelatedPreview = finalRelated[currentRelatedPreview % finalRelated.length] || finalRelated[0];

  return (
    <div className="import-page" id="import-page">
      <Header />

      <main className="import-page__main">
        <div className="import-page__inner">
          
          {/* Header section */}
          <div className="import-header-bar">
            <button onClick={() => navigate(-1)} className="import-back-btn" id="import-back-btn">
              <ArrowLeft size={16} />
              <span>Trở về</span>
            </button>
            <h1 className="import-title">Nhập Nội Dung Vĩ Nhân</h1>
            <p className="import-subtitle">
              Thêm mới nhân vật lịch sử và các sự kiện, câu chuyện đi kèm dựa trên wireframe chuẩn.
            </p>
          </div>

          <div className="import-layout">
            
            {/* LEFT COLUMN: Input Form */}
            <div className="import-col-form">
              <div className="import-card">
                
                {/* Form Tabs Nav */}
                <div className="import-tabs">
                  <button 
                    type="button"
                    onClick={() => setActiveTab('basic')}
                    className={`import-tab-btn ${activeTab === 'basic' ? 'import-tab-btn--active' : ''}`}
                  >
                    <List size={15} />
                    Thông tin cơ bản
                  </button>
                  <button 
                    type="button"
                    onClick={() => setActiveTab('detail-content')}
                    className={`import-tab-btn ${activeTab === 'detail-content' ? 'import-tab-btn--active' : ''}`}
                  >
                    <FileText size={15} />
                    Nội dung trang chi tiết
                  </button>
                </div>

                {success && (
                  <div className="alert alert--success animate-fadeIn">
                    <CheckCircle size={18} />
                    <div>
                      <strong>Thành công!</strong> Đã lưu trữ vĩ nhân và đồng bộ dữ liệu. Đang chuyển hướng về trang danh mục...
                    </div>
                  </div>
                )}

                {errorMsg && (
                  <div className="alert alert--error animate-fadeIn">
                    <AlertCircle size={18} />
                    <div>
                      <strong>Thất bại!</strong> {errorMsg}
                    </div>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="import-form">
                  
                  {/* TAB 1: BASIC INFORMATION */}
                  {activeTab === 'basic' && (
                    <div className="tab-pane animate-fadeIn">
                      
                      {/* Name field */}
                      <div className="form-group">
                        <label htmlFor="fig-name">Tên vĩ nhân <span className="required">*</span></label>
                        <input
                          type="text"
                          id="fig-name"
                          placeholder="Ví dụ: Trần Hưng Đạo"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          required
                        />
                      </div>

                      {/* Real Name */}
                      <div className="form-group">
                        <label htmlFor="fig-real-name">Tên thật / Tên khác</label>
                        <input
                          type="text"
                          id="fig-real-name"
                          placeholder="Ví dụ: Trần Quốc Tuấn"
                          value={realName}
                          onChange={(e) => setRealName(e.target.value)}
                        />
                      </div>

                      {/* Lifespan years */}
                      <div className="form-row">
                        <div className="form-group col-6">
                          <label htmlFor="fig-birth">Năm sinh</label>
                          <input
                            type="text"
                            id="fig-birth"
                            placeholder="Ví dụ: 1228"
                            value={birthYear}
                            onChange={(e) => setBirthYear(e.target.value)}
                          />
                        </div>
                        <div className="form-group col-6">
                          <label htmlFor="fig-death">Năm mất</label>
                          <input
                            type="text"
                            id="fig-death"
                            placeholder="Ví dụ: 1300"
                            value={deathYear}
                            onChange={(e) => setDeathYear(e.target.value)}
                          />
                        </div>
                      </div>

                      {/* Category & Era */}
                      <div className="form-row">
                        <div className="form-group col-6">
                          <label htmlFor="fig-cat">Lĩnh vực chính</label>
                          <select
                            id="fig-cat"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                          >
                            {CATEGORIES.map(c => (
                              <option key={c.id} value={c.id}>{c.label}</option>
                            ))}
                          </select>
                        </div>
                        <div className="form-group col-6">
                          <label htmlFor="fig-era">Thời kỳ lịch sử</label>
                          <select
                            id="fig-era"
                            value={era}
                            onChange={(e) => setEra(e.target.value)}
                          >
                            {ERAS.map(e => (
                              <option key={e} value={e}>{e}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* Portrait Image URL */}
                      <div className="form-group">
                        <label htmlFor="fig-img">Đường dẫn ảnh đại diện (Portrait URL)</label>
                        <input
                          type="url"
                          id="fig-img"
                          placeholder="https://images.unsplash.com/photo-..."
                          value={image}
                          onChange={(e) => setImage(e.target.value)}
                        />
                      </div>

                      {/* Short Description */}
                      <div className="form-group">
                        <label htmlFor="fig-summary">Mô tả ngắn (Thẻ danh sách)</label>
                        <textarea
                          id="fig-summary"
                          rows="3"
                          placeholder="Nhập dòng giới thiệu ngắn sẽ hiển thị trên thẻ danh mục..."
                          value={shortDescription}
                          onChange={(e) => setShortDescription(e.target.value)}
                        ></textarea>
                      </div>

                      {/* Tags */}
                      <div className="form-group">
                        <label htmlFor="fig-tags">Tags (Từ khóa liên quan)</label>
                        <input
                          type="text"
                          id="fig-tags"
                          placeholder="Quân sự, Nhà Trần, Bạch Đằng (Phân tách bằng dấu phẩy)"
                          value={tagsInput}
                          onChange={(e) => setTagsInput(e.target.value)}
                        />
                      </div>

                      {/* Achievements */}
                      <div className="form-group" style={{ marginTop: '10px' }}>
                        <label>Thành tựu chính</label>
                        {achievements.map((ach, idx) => (
                          <div key={idx} className="achievement-input-row">
                            <input
                              type="text"
                              placeholder={`Thành tựu ${idx + 1}`}
                              value={ach}
                              onChange={(e) => handleAchievementChange(idx, e.target.value)}
                            />
                            <button
                              type="button"
                              className="remove-ach-btn"
                              onClick={() => handleRemoveAchievement(idx)}
                            >
                              <X size={16} />
                            </button>
                          </div>
                        ))}
                        <button
                          type="button"
                          className="add-ach-btn"
                          onClick={handleAddAchievement}
                        >
                          <Plus size={14} />
                          Thêm thành tựu
                        </button>
                      </div>

                    </div>
                  )}

                  {/* TAB 2: DETAIL PAGE DYNAMIC CONTENT LAYOUT */}
                  {activeTab === 'detail-content' && (
                    <div className="tab-pane animate-fadeIn">
                      
                      {/* Full Biography */}
                      <div className="form-group">
                        <label htmlFor="fig-bio">Tiểu sử đầy đủ</label>
                        <textarea
                          id="fig-bio"
                          rows="5"
                          placeholder="Nhập nội dung đầy đủ của phần giới thiệu tiểu sử vĩ nhân..."
                          value={fullBio}
                          onChange={(e) => setFullBio(e.target.value)}
                        ></textarea>
                      </div>

                      {/* Interesting Facts (Sự thật thú vị) */}
                      <div className="form-group" style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '15px' }}>
                        <label>Sự thật thú vị (Trivia Facts)</label>
                        {facts.map((fact, idx) => (
                          <div key={idx} className="achievement-input-row">
                            <textarea
                              rows="2"
                              placeholder={`Sự thật thú vị thứ ${idx + 1}...`}
                              value={fact}
                              onChange={(e) => handleFactChange(idx, e.target.value)}
                            ></textarea>
                            <button
                              type="button"
                              className="remove-ach-btn"
                              onClick={() => handleRemoveFact(idx)}
                              style={{ height: 'auto' }}
                            >
                              <X size={16} />
                            </button>
                          </div>
                        ))}
                        <button
                          type="button"
                          className="add-ach-btn"
                          onClick={handleAddFact}
                        >
                          <Plus size={14} />
                          Thêm sự thật thú vị
                        </button>
                      </div>

                      {/* Gallery Images URLs */}
                      <div className="form-group" style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '15px' }}>
                        <label>Hình ảnh phụ (Gallery Images - 2 ảnh chồng lên nhau)</label>
                        <div className="form-row">
                          <div className="form-group col-6">
                            <label htmlFor="gallery-1" style={{ fontSize: '11px', color: '#aaa' }}>Đường dẫn ảnh phụ 1</label>
                            <input
                              type="url"
                              id="gallery-1"
                              placeholder="https://..."
                              value={galleryImages[0]}
                              onChange={(e) => handleGalleryChange(0, e.target.value)}
                            />
                          </div>
                          <div className="form-group col-6">
                            <label htmlFor="gallery-2" style={{ fontSize: '11px', color: '#aaa' }}>Đường dẫn ảnh phụ 2</label>
                            <input
                              type="url"
                              id="gallery-2"
                              placeholder="https://..."
                              value={galleryImages[1]}
                              onChange={(e) => handleGalleryChange(1, e.target.value)}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Related articles (Bài viết liên quan / Giai thoại) */}
                      <div className="form-group" style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '15px' }}>
                        <label>Bài viết liên quan / Giai thoại (Related Articles)</label>
                        {related.map((rel, idx) => (
                          <div key={idx} className="related-input-group">
                            <div className="related-input-header">
                              <span style={{ fontSize: '12px', fontWeight: '700', color: '#d4af37' }}>Bài viết #{idx + 1}</span>
                              <button
                                type="button"
                                className="remove-ach-btn"
                                onClick={() => handleRemoveRelated(idx)}
                                style={{ width: '28px', height: '28px', padding: 0 }}
                              >
                                <X size={14} />
                              </button>
                            </div>
                            
                            <div className="form-group" style={{ gap: '4px' }}>
                              <label style={{ fontSize: '11px', color: '#bbb' }}>Tiêu đề</label>
                              <input
                                type="text"
                                placeholder="Ví dụ: Chiến thắng Bạch Đằng 1288..."
                                value={rel.title}
                                onChange={(e) => handleRelatedChange(idx, 'title', e.target.value)}
                              />
                            </div>

                            <div className="form-group" style={{ gap: '4px' }}>
                              <label style={{ fontSize: '11px', color: '#bbb' }}>Ảnh bài viết (Image URL)</label>
                              <input
                                type="url"
                                placeholder="Link ảnh minh họa..."
                                value={rel.image}
                                onChange={(e) => handleRelatedChange(idx, 'image', e.target.value)}
                              />
                            </div>

                            <div className="form-group" style={{ gap: '4px' }}>
                              <label style={{ fontSize: '11px', color: '#bbb' }}>Nội dung bài viết</label>
                              <textarea
                                rows="3"
                                placeholder="Nội dung câu chuyện/giai thoại liên quan..."
                                value={rel.content}
                                onChange={(e) => handleRelatedChange(idx, 'content', e.target.value)}
                              ></textarea>
                            </div>
                          </div>
                        ))}
                        <button
                          type="button"
                          className="add-ach-btn"
                          onClick={handleAddRelated}
                        >
                          <Plus size={14} />
                          Thêm bài viết liên quan
                        </button>
                      </div>

                    </div>
                  )}

                  {/* Submit buttons available at both tabs */}
                  <button type="submit" disabled={isLoading} className="import-submit-btn" id="import-submit-btn">
                    <Save size={18} />
                    <span>{isLoading ? 'Đang lưu vĩ nhân...' : 'Thêm vĩ nhân vào hệ thống'}</span>
                  </button>

                </form>
              </div>
            </div>

            {/* RIGHT COLUMN: Realtime Live Preview */}
            <div className="import-col-preview">
              <div className="preview-sticky-box">
                <div className="preview-header">
                  <span className="preview-badge">
                    <Eye size={12} />
                    LIVE PREVIEW
                  </span>

                  <div className="preview-toggler">
                    <button
                      onClick={() => setPreviewMode('card')}
                      className={`preview-toggler-btn ${previewMode === 'card' ? 'preview-toggler-btn--active' : ''}`}
                    >
                      <Layout size={14} />
                      Thẻ hiển thị
                    </button>
                    <button
                      onClick={() => setPreviewMode('detail')}
                      className={`preview-toggler-btn ${previewMode === 'detail' ? 'preview-toggler-btn--active' : ''}`}
                    >
                      <Eye size={14} />
                      Trang chi tiết
                    </button>
                  </div>
                </div>

                <div className="preview-body">
                  {previewMode === 'card' ? (
                    /* 1. Preview Card Mode */
                    <div className="preview-card-container">
                      <div className="figure-card" style={{ width: '100%', animation: 'none' }}>
                        <div className="figure-card__img-container">
                          <img src={previewImg} alt={previewFigureName} className="figure-card__img" />
                          <div className="figure-card__img-overlay"></div>
                          <span className="figure-card__era-badge">
                            🗓️ {era}
                          </span>
                        </div>
                        <div className="figure-card__content">
                          <span className="figure-card__lifespan">🗓️ {previewLifespan}</span>
                          <h3 className="figure-card__name">
                            {previewFigureName}
                            {previewRealName && <span className="figure-card__alt-name"> ({previewRealName})</span>}
                          </h3>
                          <p className="figure-card__summary">{previewSummary}</p>

                          {previewAchievements.length > 0 && (
                            <div className="figure-card__achievements" style={{ marginTop: '12px' }}>
                              <h4 className="achievements-heading" style={{ fontSize: '12px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '6px', margin: '0 0 6px 0', color: 'var(--chat-gold-primary)' }}>
                                ✨ Thành tựu chính:
                              </h4>
                              <ul style={{ margin: 0, paddingLeft: '16px', listStyleType: 'disc', fontSize: '12px', color: '#ccc' }}>
                                {previewAchievements.slice(0, 2).map((a, i) => (
                                  <li key={i} style={{ marginBottom: '3px' }}>{a}</li>
                                ))}
                              </ul>
                            </div>
                          )}

                          <div className="figure-card__footer">
                            <div className="figure-card__cta" style={{ pointerEvents: 'none' }}>
                              <span>Đọc tiểu sử</span>
                              <ArrowLeft size={14} style={{ transform: 'rotate(180deg)' }} />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* 2. Preview Detail Page Mode (MATCHING THE WIREFRAME!) */
                    <div className="preview-detail-container">
                      <div className="preview-details-layout">
                        
                        {/* Section 1: PROFILE ROW */}
                        <div className="preview-sec-profile">
                          <div className="preview-profile-avatar">
                            <img src={previewImg} alt={previewFigureName} />
                          </div>
                          <div className="preview-profile-info">
                            <h2 className="preview-profile-name">{previewFigureName}</h2>
                            {previewRealName && <p className="preview-profile-alt">({previewRealName})</p>}
                            <div className="preview-profile-meta">
                              <span>📅 {previewLifespan}</span>
                              <span>🏛️ {era}</span>
                            </div>
                            <div className="preview-profile-bio">
                              <p>{previewBio}</p>
                            </div>
                          </div>
                        </div>

                        {/* Section 2: FUN FACTS (SỰ THẬT THÚ VỊ) & IMAGES */}
                        <div className="preview-sec-facts">
                          <div className="preview-facts-content">
                            <h3 className="preview-sec-title">SỰ THẬT THÚ VỊ</h3>
                            <div className="preview-facts-list">
                              {finalFacts.map((fact, idx) => (
                                <p key={idx}>✨ {fact}</p>
                              ))}
                            </div>
                          </div>
                          
                          {/* Collage images overlap */}
                          <div className="preview-facts-images">
                            <div className="preview-facts-img preview-facts-img--1">
                              <img src={previewGallery1} alt="Gallery 1" />
                            </div>
                            <div className="preview-facts-img preview-facts-img--2">
                              <img src={previewGallery2} alt="Gallery 2" />
                            </div>
                          </div>
                        </div>

                        {/* Section 3: RELATED NEWS & SLIDER */}
                        <div className="preview-sec-related">
                          <div className="preview-related-info">
                            <span className="related-label">NEWS</span>
                            <h3 className="preview-sec-title">BÀI VIẾT LIÊN QUAN</h3>
                            <h4 className="active-rel-title">{activeRelatedPreview.title}</h4>
                            <p className="active-rel-desc">{activeRelatedPreview.content}</p>
                          </div>
                          
                          {/* Related slide display */}
                          <div className="preview-related-slider">
                            <div className="preview-related-slide">
                              <img src={activeRelatedPreview.image || 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?q=80&w=300&auto=format&fit=crop'} alt="Slider active" />
                            </div>
                            
                            {/* Pagination indicator dots */}
                            <div className="preview-slider-dots">
                              {finalRelated.map((_, i) => (
                                <button
                                  key={i}
                                  type="button"
                                  onClick={() => setCurrentRelatedPreview(i)}
                                  className={`slider-dot-btn ${currentRelatedPreview % finalRelated.length === i ? 'slider-dot-btn--active' : ''}`}
                                />
                              ))}
                            </div>
                          </div>
                        </div>

                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
