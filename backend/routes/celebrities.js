const express = require('express');
const router = express.Router();
const { getPool, sql } = require('../config/db');
const { requireImportKey } = require('../middleware/auth');

// ============================================
// GET /api/celebrities — Lấy tất cả danh nhân
// Bao gồm: tên thời kỳ + danh sách lĩnh vực
// ============================================
router.get('/', async (req, res) => {
  try {
    const pool = getPool();

    // Lấy danh sách danh nhân kèm thời kỳ
    const result = await pool.request().query(`
      SELECT 
        c.id, c.name, c.alternative_name, 
        c.birth_date, c.death_date, c.nationality,
        c.summary, c.avatar_image, c.created_at,
        hp.name AS period_name
      FROM celebrities c
      LEFT JOIN historical_periods hp ON c.historical_period_id = hp.id
      ORDER BY c.name
    `);

    // Lấy tất cả quan hệ danh nhân - lĩnh vực
    const fieldsResult = await pool.request().query(`
      SELECT cf.celebrity_id, f.id AS field_id, f.name AS field_name
      FROM celebrity_fields cf
      JOIN fields f ON cf.field_id = f.id
    `);

    // Gộp lĩnh vực vào từng danh nhân
    const celebrities = result.recordset.map(celeb => ({
      ...celeb,
      fields: fieldsResult.recordset
        .filter(f => f.celebrity_id === celeb.id)
        .map(f => ({ id: f.field_id, name: f.field_name })),
    }));

    res.json(celebrities);
  } catch (error) {
    console.error('Lỗi lấy danh sách danh nhân:', error.message);
    res.status(500).json({ error: 'Không thể lấy danh sách danh nhân' });
  }
});

// ============================================
// GET /api/celebrities/:id — Lấy chi tiết 1 danh nhân
// ============================================
router.get('/:id', async (req, res) => {
  try {
    const pool = getPool();
    const id = parseInt(req.params.id);

    // Thông tin danh nhân
    const result = await pool.request()
      .input('id', sql.Int, id)
      .query(`
        SELECT 
          c.id, c.name, c.alternative_name,
          c.birth_date, c.death_date, c.nationality,
          c.summary, c.avatar_image, c.created_at,
          c.historical_period_id,
          hp.name AS period_name, hp.description AS period_description
        FROM celebrities c
        LEFT JOIN historical_periods hp ON c.historical_period_id = hp.id
        WHERE c.id = @id
      `);

    if (result.recordset.length === 0) {
      return res.status(404).json({ error: 'Không tìm thấy danh nhân' });
    }

    // Lĩnh vực của danh nhân
    const fieldsResult = await pool.request()
      .input('id', sql.Int, id)
      .query(`
        SELECT f.id, f.name, f.description
        FROM celebrity_fields cf
        JOIN fields f ON cf.field_id = f.id
        WHERE cf.celebrity_id = @id
      `);

    // Câu chuyện của danh nhân
    const storiesResult = await pool.request()
      .input('id', sql.Int, id)
      .query(`
        SELECT id, title, view_count, created_at
        FROM stories
        WHERE celebrity_id = @id
        ORDER BY created_at DESC
      `);

    const celebrity = {
      ...result.recordset[0],
      fields: fieldsResult.recordset,
      stories: storiesResult.recordset,
    };

    res.json(celebrity);
  } catch (error) {
    console.error('Lỗi lấy chi tiết danh nhân:', error.message);
    res.status(500).json({ error: 'Không thể lấy thông tin danh nhân' });
  }
});

// ============================================
// GET /api/celebrities/field/:fieldId — Lấy danh nhân theo lĩnh vực
// ============================================
router.get('/field/:fieldId', async (req, res) => {
  try {
    const pool = getPool();
    const result = await pool.request()
      .input('fieldId', sql.Int, req.params.fieldId)
      .query(`
        SELECT 
          c.id, c.name, c.alternative_name,
          c.birth_date, c.death_date, c.nationality,
          c.summary, c.avatar_image,
          hp.name AS period_name
        FROM celebrities c
        JOIN celebrity_fields cf ON c.id = cf.celebrity_id
        LEFT JOIN historical_periods hp ON c.historical_period_id = hp.id
        WHERE cf.field_id = @fieldId
        ORDER BY c.name
      `);

    res.json(result.recordset);
  } catch (error) {
    console.error('Lỗi lấy danh nhân theo lĩnh vực:', error.message);
    res.status(500).json({ error: 'Không thể lấy danh nhân theo lĩnh vực' });
  }
});

// ============================================
// POST /api/celebrities — Thêm danh nhân mới (chỉ admin)
// ============================================
router.post('/', requireImportKey, async (req, res) => {
  try {
    const pool = getPool();
    const {
      name, realName, birthYear, deathYear,
      shortDescription, image, era
    } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Thiếu tên danh nhân' });
    }

    // Tìm hoặc tạo thời kỳ lịch sử
    let periodId = null;
    if (era) {
      const periodResult = await pool.request()
        .input('era', sql.NVarChar(100), era)
        .query(`SELECT id FROM historical_periods WHERE name = @era`);

      if (periodResult.recordset.length > 0) {
        periodId = periodResult.recordset[0].id;
      } else {
        const newPeriod = await pool.request()
          .input('era', sql.NVarChar(100), era)
          .query(`INSERT INTO historical_periods (name) VALUES (@era) RETURNING id`);
        periodId = newPeriod.recordset[0].id;
      }
    }

    // Thêm danh nhân
    const result = await pool.request()
      .input('name', sql.NVarChar(200), name.trim())
      .input('alternative_name', sql.NVarChar(200), realName || null)
      .input('birth_date', sql.VarChar(20), birthYear ? String(birthYear) : null)
      .input('death_date', sql.VarChar(20), deathYear ? String(deathYear) : null)
      .input('summary', sql.NVarChar(sql.MAX), shortDescription || null)
      .input('avatar_image', sql.VarChar(500), image || null)
      .input('period_id', sql.Int, periodId)
      .query(`
        INSERT INTO celebrities
          (name, alternative_name, birth_date, death_date, summary, avatar_image, historical_period_id)
        VALUES
          (@name, @alternative_name, @birth_date, @death_date, @summary, @avatar_image, @period_id)
        RETURNING id, name
      `);

    res.status(201).json({
      message: 'Thêm danh nhân thành công!',
      celebrity: result.recordset[0]
    });
  } catch (error) {
    console.error('Lỗi thêm danh nhân:', error.message);
    res.status(500).json({ error: 'Không thể thêm danh nhân' });
  }
});

module.exports = router;
