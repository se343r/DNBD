const express = require('express');
const router = express.Router();
const { getPool, sql } = require('../config/db');

// ============================================
// GET /api/stories — Lấy tất cả câu chuyện
// ============================================
router.get('/', async (req, res) => {
  try {
    const pool = getPool();
    const result = await pool.request().query(`
      SELECT 
        s.id, s.title, s.view_count, s.created_at,
        s.celebrity_id,
        c.name AS celebrity_name, c.avatar_image
      FROM stories s
      JOIN celebrities c ON s.celebrity_id = c.id
      ORDER BY s.created_at DESC
    `);
    res.json(result.recordset);
  } catch (error) {
    console.error('Lỗi lấy danh sách câu chuyện:', error.message);
    res.status(500).json({ error: 'Không thể lấy danh sách câu chuyện' });
  }
});

// ============================================
// GET /api/stories/:id — Lấy chi tiết câu chuyện
// Tự động tăng view_count
// ============================================
router.get('/:id', async (req, res) => {
  try {
    const pool = getPool();
    const id = parseInt(req.params.id);

    // Tăng lượt xem
    await pool.request()
      .input('id', sql.Int, id)
      .query(`UPDATE stories SET view_count = view_count + 1 WHERE id = @id`);

    // Lấy chi tiết câu chuyện
    const result = await pool.request()
      .input('id', sql.Int, id)
      .query(`
        SELECT 
          s.id, s.title, s.content, s.view_count, s.created_at,
          s.celebrity_id,
          c.name AS celebrity_name, c.avatar_image, c.summary AS celebrity_summary
        FROM stories s
        JOIN celebrities c ON s.celebrity_id = c.id
        WHERE s.id = @id
      `);

    if (result.recordset.length === 0) {
      return res.status(404).json({ error: 'Không tìm thấy câu chuyện' });
    }

    // Lấy bình luận
    const commentsResult = await pool.request()
      .input('storyId', sql.Int, id)
      .query(`
        SELECT 
          cm.id, cm.content, cm.created_at,
          u.username
        FROM comments cm
        JOIN users u ON cm.user_id = u.id
        WHERE cm.story_id = @storyId
        ORDER BY cm.created_at DESC
      `);

    const story = {
      ...result.recordset[0],
      comments: commentsResult.recordset,
    };

    res.json(story);
  } catch (error) {
    console.error('Lỗi lấy chi tiết câu chuyện:', error.message);
    res.status(500).json({ error: 'Không thể lấy thông tin câu chuyện' });
  }
});

// ============================================
// GET /api/stories/celebrity/:celebrityId — Lấy câu chuyện theo danh nhân
// ============================================
router.get('/celebrity/:celebrityId', async (req, res) => {
  try {
    const pool = getPool();
    const result = await pool.request()
      .input('celebrityId', sql.Int, req.params.celebrityId)
      .query(`
        SELECT id, title, view_count, created_at
        FROM stories
        WHERE celebrity_id = @celebrityId
        ORDER BY created_at DESC
      `);
    res.json(result.recordset);
  } catch (error) {
    console.error('Lỗi lấy câu chuyện theo danh nhân:', error.message);
    res.status(500).json({ error: 'Không thể lấy câu chuyện' });
  }
});

// ============================================
// POST /api/stories/:id/comments — Thêm bình luận
// ============================================
router.post('/:id/comments', async (req, res) => {
  try {
    const pool = getPool();
    const { user_id, content } = req.body;

    if (!user_id || !content) {
      return res.status(400).json({ error: 'Thiếu user_id hoặc content' });
    }

    await pool.request()
      .input('userId', sql.Int, user_id)
      .input('storyId', sql.Int, req.params.id)
      .input('content', sql.NVarChar(sql.MAX), content)
      .query(`
        INSERT INTO comments (user_id, story_id, content)
        VALUES (@userId, @storyId, @content)
      `);

    res.status(201).json({ message: 'Bình luận đã được thêm thành công' });
  } catch (error) {
    console.error('Lỗi thêm bình luận:', error.message);
    res.status(500).json({ error: 'Không thể thêm bình luận' });
  }
});

module.exports = router;
