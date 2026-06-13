import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send, Sparkles, Trash2, Bot, HelpCircle } from 'lucide-react';
import './Chatbot.css';

const API_CHATBOT_URL = '/api/chatbot';

const QUICK_PROMPTS = [
  { text: 'Giới thiệu trang web này 🏛️', query: 'Giới thiệu về trang web Cổng Khám Phá Danh Nhân Việt Nam' },
  { text: 'Đại tướng Võ Nguyên Giáp ⚔️', query: 'Đại tướng Võ Nguyên Giáp là ai và có những chiến công gì nổi bật?' },
  { text: 'Nhà Trần có những ai? 👑', query: 'Trong danh sách danh nhân, những ai thuộc thời kỳ Nhà Trần?' },
  { text: 'Làm sao để chơi Quiz? 🎓', query: 'Trang web có tính năng chơi Quiz lịch sử không, làm thế nào để tham gia?' }
];

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'model',
      text: 'Xin chào! Tôi là Trợ lý AI của Cổng Khám Phá Danh Nhân Việt Nam. Tôi có thể giúp bạn tìm hiểu thông tin về trang web hoặc tiểu sử của các vĩ nhân lịch sử. Bạn muốn hỏi gì hôm nay?'
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const chatEndRef = useRef(null);

  // Tự động cuộn xuống cuối khi có tin nhắn mới
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend) => {
    const text = textToSend || inputValue;
    if (!text.trim()) return;

    // Thêm tin nhắn của user vào danh sách
    const newUserMessage = { role: 'user', text };
    setMessages(prev => [...prev, newUserMessage]);
    if (!textToSend) setInputValue('');
    setIsLoading(true);
    setErrorMsg('');

    try {
      // Chuẩn bị lịch sử hội thoại gửi lên Backend (loại bỏ tin nhắn chào đầu tiên nếu cần, hoặc gửi toàn bộ)
      // Gemini mong muốn định dạng lịch sử chỉ có 'user' và 'model' xen kẽ
      const historyPayload = messages.map(msg => ({
        role: msg.role === 'model' ? 'model' : 'user',
        text: msg.text
      }));

      const response = await fetch(API_CHATBOT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: text,
          history: historyPayload
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Lỗi kết nối tới máy chủ AI.');
      }

      setMessages(prev => [...prev, { role: 'model', text: data.reply }]);
    } catch (error) {
      console.error('Lỗi Chatbot:', error);
      setErrorMsg(error.message || 'Không thể kết nối đến máy chủ. Vui lòng kiểm tra xem Backend đã được chạy chưa.');
      setMessages(prev => [
        ...prev,
        {
          role: 'model',
          text: '⚠️ Xin lỗi, tôi không thể xử lý câu trả lời lúc này do sự cố kết nối hoặc lỗi cấu hình API Key. Vui lòng kiểm tra lại cấu hình Backend.'
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const handleResetChat = () => {
    setMessages([
      {
        role: 'model',
        text: 'Cuộc trò chuyện đã được làm mới. Tôi có thể giúp gì thêm cho bạn?'
      }
    ]);
    setErrorMsg('');
  };

  return (
    <div className={`chatbot-widget ${isOpen ? 'chatbot-widget--open' : ''}`} id="chatbot-widget">
      {/* 1. Nút bong bóng chat trôi nổi */}
      <button 
        className="chatbot-toggle-btn" 
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Mở trợ lý AI"
        id="chatbot-toggle"
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
        {!isOpen && <span className="chatbot-tooltip">Hỏi Trợ lý AI ✨</span>}
      </button>

      {/* 2. Cửa sổ Chatbot (Glassmorphism) */}
      <div className="chatbot-window" id="chatbot-window">
        {/* Header */}
        <div className="chatbot-header">
          <div className="chatbot-header__info">
            <div className="chatbot-header__avatar">
              <Bot size={20} />
              <span className="chatbot-header__status"></span>
            </div>
            <div>
              <h3 className="chatbot-header__title">Trợ Lý Lịch Sử AI</h3>
              <p className="chatbot-header__subtitle">Hỗ trợ bởi Gemini</p>
            </div>
          </div>
          <div className="chatbot-header__actions">
            <button 
              onClick={handleResetChat} 
              className="chatbot-action-btn"
              title="Xóa lịch sử trò chuyện"
              id="chatbot-reset-btn"
            >
              <Trash2 size={16} />
            </button>
            <button 
              onClick={() => setIsOpen(false)} 
              className="chatbot-action-btn chatbot-action-btn--close"
              title="Đóng cửa sổ"
              id="chatbot-close-btn"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Message Area */}
        <div className="chatbot-messages" id="chatbot-messages-container">
          {messages.map((msg, index) => (
            <div 
              key={index} 
              className={`chatbot-message-bubble chatbot-message-bubble--${msg.role}`}
            >
              {msg.role === 'model' && (
                <div className="bubble-avatar">
                  <Sparkles size={12} />
                </div>
              )}
              <div className="bubble-content">
                <p className="bubble-text">{msg.text}</p>
              </div>
            </div>
          ))}

          {/* Typing Indicator */}
          {isLoading && (
            <div className="chatbot-message-bubble chatbot-message-bubble--model">
              <div className="bubble-avatar">
                <Sparkles size={12} />
              </div>
              <div className="bubble-content bubble-content--typing">
                <span className="typing-dot"></span>
                <span className="typing-dot"></span>
                <span className="typing-dot"></span>
              </div>
            </div>
          )}

          {errorMsg && (
            <div className="chatbot-error-banner">
              <HelpCircle size={14} />
              <span>{errorMsg}</span>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Quick Suggestion Prompts */}
        {messages.length === 1 && !isLoading && (
          <div className="chatbot-suggestions">
            <p className="suggestions-title">💡 Gợi ý câu hỏi nhanh:</p>
            <div className="suggestions-list">
              {QUICK_PROMPTS.map((prompt, i) => (
                <button
                  key={i}
                  onClick={() => handleSendMessage(prompt.query)}
                  className="suggestion-chip"
                  id={`suggestion-chip-${i}`}
                >
                  {prompt.text}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input Footer */}
        <div className="chatbot-footer">
          <input
            type="text"
            placeholder="Nhập câu hỏi của bạn về lịch sử..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isLoading}
            className="chatbot-input"
            id="chatbot-input-field"
          />
          <button
            onClick={() => handleSendMessage()}
            disabled={isLoading || !inputValue.trim()}
            className="chatbot-send-btn"
            id="chatbot-send-btn"
            aria-label="Gửi tin nhắn"
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
