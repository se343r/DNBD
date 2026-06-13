const express = require('express');
const router = express.Router();
const { getPool, sql } = require('../config/db');

// ============================================
// GET /api/periods — Lấy tất cả thời kỳ lịch sử
// ============================================
router.get('/', async (req, res) => {
  try {
    const pool = getPool();
    const result = await pool.request().query(`
      SELECT id, name, description
      FROM historical_periods
      ORDER BY id
    `);
    res.json(result.recordset);
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
    const pool = getPool();
    const result = await pool.request()
      .input('id', sql.Int, req.params.id)
      .query(`SELECT id, name, description FROM historical_periods WHERE id = @id`);

    if (result.recordset.length === 0) {
      return res.status(404).json({ error: 'Không tìm thấy thời kỳ lịch sử' });
    }
    res.json(result.recordset[0]);
  } catch (error) {
    console.error('Lỗi lấy thời kỳ:', error.message);
    res.status(500).json({ error: 'Không thể lấy thông tin thời kỳ' });
  }
});

module.exports = router;
