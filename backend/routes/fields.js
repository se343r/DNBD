const express = require('express');
const router = express.Router();
const { getPool, sql } = require('../config/db');

// ============================================
// GET /api/fields — Lấy tất cả lĩnh vực
// ============================================
router.get('/', async (req, res) => {
  try {
    const pool = getPool();
    const result = await pool.request().query(`
      SELECT id, name, description
      FROM fields
      ORDER BY name
    `);
    res.json(result.recordset);
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
    const pool = getPool();
    const result = await pool.request()
      .input('id', sql.Int, req.params.id)
      .query(`SELECT id, name, description FROM fields WHERE id = @id`);

    if (result.recordset.length === 0) {
      return res.status(404).json({ error: 'Không tìm thấy lĩnh vực' });
    }
    res.json(result.recordset[0]);
  } catch (error) {
    console.error('Lỗi lấy lĩnh vực:', error.message);
    res.status(500).json({ error: 'Không thể lấy thông tin lĩnh vực' });
  }
});

module.exports = router;
