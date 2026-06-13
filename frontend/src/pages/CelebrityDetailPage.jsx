import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight, Eye } from 'lucide-react';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import './CelebrityDetailPage.css';

const API_BASE_URL = '/api';

// Dữ liệu mẫu khi chưa kết nối API hoặc DB chưa có dữ liệu
const FALLBACK_DATA = {
  id: 1,
  name: 'Trần Hưng Đạo',
  alternative_name: 'Trần Quốc Tuấn',
  birth_date: '1228',
  death_date: '1300',
  nationality: 'Đại Việt',
  period_name: 'Nhà Trần',
  summary: `Trần Hưng Đạo, tên thật là Trần Quốc Tuấn, là vị tướng kiệt xuất của Đại Việt thời nhà Trần. Ông là người đã chỉ huy quân đội Đại Việt ba lần đánh bại quân xâm lược Nguyên Mông, một đế quốc hùng mạnh nhất thế giới vào thế kỷ 13.

Ông được phong tước Hưng Đạo Đại Vương và là một trong những nhà quân sự vĩ đại nhất trong lịch sử Việt Nam. Trần Hưng Đạo còn là tác giả của "Hịch tướng sĩ" – một áng văn bất hủ khích lệ tinh thần chiến đấu của binh sĩ.

Sau khi qua đời, ông được nhân dân tôn thờ như một vị thánh, thường được gọi là Đức Thánh Trần. Nhiều đền thờ ông được xây dựng trên khắp cả nước, nổi tiếng nhất là đền Kiếp Bạc ở Hải Dương.`,
  avatar_image: null,
  fields: [
    { id: 1, name: 'Quân sự' },
    { id: 2, name: 'Chính trị' },
  ],
  stories: [
    { id: 1, title: 'Ba lần đánh bại quân Nguyên Mông', view_count: 1250 },
    { id: 2, title: 'Hịch tướng sĩ – Lời hiệu triệu ngàn năm', view_count: 980 },
    { id: 3, title: 'Thuở nhỏ và chí hướng cứu nước', view_count: 756 },
  ],
};

const FALLBACK_FACTS = [
  'Trần Hưng Đạo từng từ chối lời khuyên của cha mình – Trần Liễu – về việc cướp ngôi nhà Trần, thể hiện lòng trung thành tuyệt đối với quốc gia và triều đình.',
  'Ông là tác giả của "Binh thư yếu lược" và "Vạn Kiếp tông bí truyền thư", hai tác phẩm quân sự kinh điển của Việt Nam, thể hiện tài năng chiến lược quân sự xuất chúng.',
  'Chiến thuật "vườn không nhà trống" mà ông áp dụng đã khiến đội quân Nguyên Mông hùng mạnh phải chịu thất bại nặng nề, dù họ đã từng chinh phục gần như toàn bộ châu Á và Đông Âu.',
  'Trước khi mất, khi vua Trần Anh Tông hỏi kế sách giữ nước, ông đáp: "Khoan thư sức dân để làm kế sâu rễ bền gốc, đó là thượng sách giữ nước." Câu nói này vẫn còn nguyên giá trị đến ngày nay.',
];

const FALLBACK_RELATED = [
  {
    id: 1,
    title: 'Chiến thắng Bạch Đằng 1288 – Trận thủy chiến huyền thoại',
    content: 'Trận Bạch Đằng năm 1288 là một trong những chiến thắng vĩ đại nhất trong lịch sử chống ngoại xâm của dân tộc Việt Nam. Dưới sự chỉ huy tài tình của Trần Hưng Đạo, quân Đại Việt đã sử dụng chiến thuật cắm cọc gỗ bọc sắt dưới lòng sông, lợi dụng thủy triều để đánh bại hoàn toàn đoàn thuyền chiến của quân Nguyên.',
  },
  {
    id: 2,
    title: 'Nhà Trần và công cuộc xây dựng quốc gia thịnh vượng',
    content: 'Triều đại nhà Trần không chỉ nổi tiếng với những chiến công quân sự mà còn là thời kỳ phát triển rực rỡ về văn hóa, giáo dục và Phật giáo. Nhiều danh nhân kiệt xuất đã xuất hiện trong giai đoạn này.',
  },
  {
    id: 3,
    title: 'Tinh thần "Sát Thát" – Ý chí quật cường của dân tộc',
    content: 'Hai chữ "Sát Thát" (giết giặc Nguyên) được thích trên cánh tay mỗi người lính Đại Việt đã trở thành biểu tượng bất diệt cho tinh thần yêu nước và quyết tâm bảo vệ tổ quốc.',
  },
  {
    id: 4,
    title: 'Di sản Trần Hưng Đạo trong đời sống hiện đại',
    content: 'Hàng trăm con đường, trường học và công trình công cộng trên khắp Việt Nam mang tên Trần Hưng Đạo, thể hiện sự tôn kính sâu sắc của nhân dân đối với vị anh hùng dân tộc.',
  },
];

export default function CelebrityDetailPage() {
  const { id } = useParams();
  const [celebrity, setCelebrity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentRelated, setCurrentRelated] = useState(0);

  useEffect(() => {
    const fetchCelebrity = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/celebrities/${id}`);
        if (!response.ok) throw new Error('Không tìm thấy');
        const data = await response.json();
        setCelebrity(data);
      } catch (error) {
        console.warn('Dùng dữ liệu mẫu:', error.message);
        setCelebrity(FALLBACK_DATA);
      } finally {
        setLoading(false);
      }
    };
    fetchCelebrity();
    setCurrentRelated(0);
    window.scrollTo(0, 0);
  }, [id]);

  const nextRelated = () => {
    setCurrentRelated((prev) => (prev + 1) % FALLBACK_RELATED.length);
  };

  const prevRelated = () => {
    setCurrentRelated((prev) => (prev - 1 + FALLBACK_RELATED.length) % FALLBACK_RELATED.length);
  };

  if (loading) {
    return (
      <div className="celebrity-page">
        <Header />
        <main className="celebrity-page__main">
          <div className="celebrity-page__loading">
            <div className="celebrity-page__spinner"></div>
            <p>Đang tải thông tin danh nhân...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const data = celebrity || FALLBACK_DATA;
  const facts = data.facts && data.facts.length > 0 ? data.facts : FALLBACK_FACTS;
  const relatedArticles = data.related && data.related.length > 0 
    ? data.related.map((r, i) => ({ id: i, title: r.title, content: r.content, image: r.image })) 
    : FALLBACK_RELATED;
  const currentArticle = relatedArticles[currentRelated];

  return (
    <div className="celebrity-page" id="celebrity-detail-page">
      <Header />

      <main className="celebrity-page__main">
        {/* ===== SECTION 1: Profile ===== */}
        <section className="celeb-profile" id="celeb-profile">
          <div className="celeb-profile__inner">
            <div className="celeb-profile__avatar-wrapper">
              <div className="celeb-profile__avatar" id="celeb-avatar">
                {data.avatar_image ? (
                  <img src={data.avatar_image} alt={data.name} />
                ) : (
                  <div className="celeb-profile__avatar-placeholder">
                    <div className="celeb-profile__avatar-head"></div>
                    <div className="celeb-profile__avatar-body"></div>
                  </div>
                )}
              </div>
            </div>

            <div className="celeb-profile__content">
              <h1 className="celeb-profile__name" id="celeb-name">{data.name}</h1>

              {data.alternative_name && (
                <p className="celeb-profile__alt-name">({data.alternative_name})</p>
              )}

              <div className="celeb-profile__meta">
                {data.birth_date && (
                  <span className="celeb-profile__meta-item">
                    📅 {data.birth_date} – {data.death_date || '?'}
                  </span>
                )}
                {data.nationality && (
                  <span className="celeb-profile__meta-item">
                    🌍 {data.nationality}
                  </span>
                )}
                {data.period_name && (
                  <span className="celeb-profile__meta-item">
                    🏛️ {data.period_name}
                  </span>
                )}
              </div>

              {data.fields && data.fields.length > 0 && (
                <div className="celeb-profile__fields">
                  {data.fields.map((field) => (
                    <span key={field.id} className="celeb-profile__field-tag">
                      {field.name}
                    </span>
                  ))}
                </div>
              )}

              <div className="celeb-profile__bio" id="celeb-bio">
                {data.summary && data.summary.split('\n').filter(p => p.trim()).map((paragraph, i) => (
                  <p key={i}>{paragraph.trim()}</p>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ===== SECTION 2: Sự thật thú vị ===== */}
        <section className="celeb-facts" id="celeb-facts">
          <div className="celeb-facts__inner">
            <div className="celeb-facts__content">
              <h2 className="celeb-facts__title">SỰ THẬT THÚ VỊ</h2>
              <div className="celeb-facts__text">
                {facts.map((fact, i) => (
                  <p key={i}>{fact}</p>
                ))}
              </div>
            </div>

            <div className="celeb-facts__images">
              <div className="celeb-facts__img celeb-facts__img--1">
                {data.galleryImages && data.galleryImages[0] ? (
                  <img src={data.galleryImages[0]} alt="Sự thật thú vị 1" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div className="celeb-facts__img-placeholder"></div>
                )}
              </div>
              <div className="celeb-facts__img celeb-facts__img--2">
                {data.galleryImages && data.galleryImages[1] ? (
                  <img src={data.galleryImages[1]} alt="Sự thật thú vị 2" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div className="celeb-facts__img-placeholder"></div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ===== SECTION 3: Quiz CTA ===== */}
        <section className="celeb-quiz" id="celeb-quiz">
          <div className="celeb-quiz__inner">
            <Link to="/quiz" className="celeb-quiz__btn" id="quiz-cta-btn">
              QUIZ
              <ArrowRight size={18} />
            </Link>
          </div>
        </section>

        {/* ===== SECTION 4: Bài viết liên quan ===== */}
        <section className="celeb-related" id="celeb-related">
          <div className="celeb-related__inner">
            <div className="celeb-related__content">
              <span className="celeb-related__label">NEWS</span>
              <h2 className="celeb-related__title">BÀI VIẾT LIÊN QUAN</h2>
              <p className="celeb-related__text">{currentArticle.content}</p>
              <a href="#" className="celeb-related__read-btn" id="related-read-btn">
                Read Now
                <ArrowRight size={16} />
              </a>
            </div>

            <div className="celeb-related__slider">
              <div className="celeb-related__slider-track">
                <div className="celeb-related__slide celeb-related__slide--main">
                  {currentArticle.image ? (
                    <img src={currentArticle.image} alt={currentArticle.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <div className="celeb-related__slide-placeholder"></div>
                  )}
                </div>
                <div className="celeb-related__slide celeb-related__slide--overlay-1">
                  {relatedArticles[(currentRelated + 1) % relatedArticles.length]?.image ? (
                    <img src={relatedArticles[(currentRelated + 1) % relatedArticles.length].image} alt="Xem thêm 1" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <div className="celeb-related__slide-placeholder"></div>
                  )}
                </div>
                <div className="celeb-related__slide celeb-related__slide--overlay-2">
                  {relatedArticles[(currentRelated + 2) % relatedArticles.length]?.image ? (
                    <img src={relatedArticles[(currentRelated + 2) % relatedArticles.length].image} alt="Xem thêm 2" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <div className="celeb-related__slide-placeholder"></div>
                  )}
                </div>
              </div>

              {/* Slider dots */}
              <div className="celeb-related__dots">
                {relatedArticles.map((_, i) => (
                  <button
                    key={i}
                    className={`celeb-related__dot ${i === currentRelated ? 'celeb-related__dot--active' : ''}`}
                    onClick={() => setCurrentRelated(i)}
                    aria-label={`Slide ${i + 1}`}
                    id={`related-dot-${i}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ===== Câu chuyện / Giai thoại ===== */}
        {data.stories && data.stories.length > 0 && (
          <section className="celeb-stories" id="celeb-stories">
            <div className="celeb-stories__inner">
              <h2 className="celeb-stories__title">CÂU CHUYỆN & GIAI THOẠI</h2>
              <div className="celeb-stories__grid">
                {data.stories.map((story, index) => (
                  <Link
                    to={`/stories/${story.id}`}
                    key={story.id}
                    className="celeb-stories__card"
                    id={`story-card-${story.id}`}
                    style={{ '--delay': `${index * 0.1}s` }}
                  >
                    <span className="celeb-stories__card-number">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <h3 className="celeb-stories__card-title">{story.title}</h3>
                    <div className="celeb-stories__card-meta">
                      <Eye size={14} />
                      <span>{story.view_count?.toLocaleString() || 0} lượt xem</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
