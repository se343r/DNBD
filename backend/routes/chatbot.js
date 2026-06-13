const express = require('express');
const router = express.Router();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

const SYSTEM_PROMPT = `Bạn là Trợ lý Lịch Sử AI của "Cổng Khám Phá Danh Nhân Việt Nam".
Nhiệm vụ của bạn là hỗ trợ người dùng tìm hiểu thông tin về các danh nhân lịch sử Việt Nam, các thời kỳ lịch sử, và tính năng của trang web.
Hãy trả lời ngắn gọn, chính xác, thân thiện và bằng tiếng Việt.
Nếu câu hỏi không liên quan đến lịch sử Việt Nam hoặc trang web, hãy lịch sự từ chối và hướng người dùng về chủ đề chính.`;

// ============================================
// POST /api/chatbot — Gửi tin nhắn tới Gemini
// ============================================
router.post('/', async (req, res) => {
  const { message, history = [] } = req.body;

  if (!message || !message.trim()) {
    return res.status(400).json({ error: 'Thiếu nội dung tin nhắn' });
  }

  if (!GEMINI_API_KEY) {
    return res.status(500).json({ error: 'Chưa cấu hình GEMINI_API_KEY' });
  }

  try {
    // Chuyển history sang định dạng Gemini (parts thay vì text)
    const formattedHistory = history.map(msg => ({
      role: msg.role === 'model' ? 'model' : 'user',
      parts: [{ text: msg.text }]
    }));

    const body = {
      system_instruction: {
        parts: [{ text: SYSTEM_PROMPT }]
      },
      contents: [
        ...formattedHistory,
        {
          role: 'user',
          parts: [{ text: message }]
        }
      ],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 1024
      }
    };

    const response = await fetch(GEMINI_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Gemini API error:', data);
      return res.status(502).json({ error: 'Lỗi từ Gemini API', detail: data.error?.message });
    }

    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!reply) {
      return res.status(502).json({ error: 'Gemini không trả về nội dung' });
    }

    res.json({ reply });
  } catch (error) {
    console.error('Lỗi chatbot:', error.message);
    res.status(500).json({ error: 'Không thể kết nối tới Gemini API' });
  }
});

module.exports = router;
