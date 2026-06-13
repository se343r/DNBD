const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { getPool, sql } = require('../config/db');

const SALT_ROUNDS = 10;

// ============================================
// POST /api/users/register — Đăng ký tài khoản
// ============================================
router.post('/register', async (req, res) => {
  try {
    const pool = getPool();
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Vui lòng nhập đầy đủ username, email và password' });
    }

    // Kiểm tra tài khoản đã tồn tại
    const checkExist = await pool.request()
      .input('username', sql.VarChar(50), username)
      .input('email', sql.VarChar(100), email)
      .query(`
        SELECT id FROM users WHERE username = @username OR email = @email
      `);

    if (checkExist.recordset.length > 0) {
      return res.status(409).json({ error: 'Username hoặc email đã tồn tại' });
    }

    // Hash mật khẩu trước khi lưu
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const result = await pool.request()
      .input('username', sql.VarChar(50), username)
      .input('email', sql.VarChar(100), email)
      .input('password_hash', sql.VarChar(255), hashedPassword)
      .query(`
        INSERT INTO users (username, email, password_hash)
        VALUES (@username, @email, @password_hash)
        RETURNING id, username, email, role, created_at
      `);

    res.status(201).json({
      message: 'Đăng ký thành công!',
      user: result.recordset[0],
    });
  } catch (error) {
    console.error('Lỗi đăng ký:', error.message);
    res.status(500).json({ error: 'Không thể đăng ký tài khoản' });
  }
});

// ============================================
// POST /api/users/login — Đăng nhập
// ============================================
router.post('/login', async (req, res) => {
  try {
    const pool = getPool();
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Vui lòng nhập username và password' });
    }

    const result = await pool.request()
      .input('username', sql.VarChar(50), username)
      .query(`
        SELECT id, username, email, password_hash, role, created_at
        FROM users
        WHERE username = @username
      `);

    if (result.recordset.length === 0) {
      return res.status(401).json({ error: 'Sai tên đăng nhập hoặc mật khẩu' });
    }

    const user = result.recordset[0];

    // So sánh mật khẩu với bcrypt
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Sai tên đăng nhập hoặc mật khẩu' });
    }

    // Không trả về password_hash
    const { password_hash, ...safeUser } = user;

    res.json({
      message: 'Đăng nhập thành công!',
      user: safeUser,
    });
  } catch (error) {
    console.error('Lỗi đăng nhập:', error.message);
    res.status(500).json({ error: 'Không thể đăng nhập' });
  }
});

// ============================================
// GET /api/users/:id/history — Lấy lịch sử đọc
// ============================================
router.get('/:id/history', async (req, res) => {
  try {
    const pool = getPool();
    const result = await pool.request()
      .input('userId', sql.Int, req.params.id)
      .query(`
        SELECT 
          rh.last_read_at,
          s.id AS story_id, s.title AS story_title,
          c.name AS celebrity_name
        FROM reading_history rh
        JOIN stories s ON rh.story_id = s.id
        JOIN celebrities c ON s.celebrity_id = c.id
        WHERE rh.user_id = @userId
        ORDER BY rh.last_read_at DESC
      `);

    res.json(result.recordset);
  } catch (error) {
    console.error('Lỗi lấy lịch sử đọc:', error.message);
    res.status(500).json({ error: 'Không thể lấy lịch sử đọc' });
  }
});

module.exports = router;
