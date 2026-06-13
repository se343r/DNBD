const express = require('express');
const router = express.Router();
const supabase = require('../config/db');

// ============================================
// GET /api/fields — Lấy tất cả lĩnh vực
// ============================================
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('fields')
      .select('id, name, description')
      .order('name');

    if (error) throw error;
    res.json(data || []);
  } catch (error) {
    console.error('Lỗi lấy danh sách lĩnh vực:', error.message);
    res.status(500).json({ error: 'Không thể lấy danh sách lĩnh vực' });
  }
});

// ============================================
// GET /api/fields/:id — Lấy chi tiết 1 lĩnh vực
// ============================================
router.get('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id) || 0;
    const { data, error } = await supabase
      .from('fields')
      .select('id, name, description')
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;
    if (!data) {
      return res.status(404).json({ error: 'Không tìm thấy lĩnh vực' });
    }
    res.json(data);
  } catch (error) {
    console.error('Lỗi lấy lĩnh vực:', error.message);
    res.status(500).json({ error: 'Không thể lấy thông tin lĩnh vực' });
  }
});

module.exports = router;
