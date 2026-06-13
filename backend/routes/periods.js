const express = require('express');
const router = express.Router();
const supabase = require('../config/db');

// ============================================
// GET /api/periods — Lấy tất cả thời kỳ lịch sử
// ============================================
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('historical_periods')
      .select('id, name, description')
      .order('id');

    if (error) throw error;
    res.json(data || []);
  } catch (error) {
    console.error('Lỗi lấy danh sách thời kỳ:', error.message);
    res.status(500).json({ error: 'Không thể lấy danh sách thời kỳ lịch sử' });
  }
});

// ============================================
// GET /api/periods/:id — Lấy chi tiết 1 thời kỳ
// ============================================
router.get('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id) || 0;
    const { data, error } = await supabase
      .from('historical_periods')
      .select('id, name, description')
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;
    if (!data) {
      return res.status(404).json({ error: 'Không tìm thấy thời kỳ lịch sử' });
    }
    res.json(data);
  } catch (error) {
    console.error('Lỗi lấy thời kỳ:', error.message);
    res.status(500).json({ error: 'Không thể lấy thông tin thời kỳ' });
  }
});

module.exports = router;
