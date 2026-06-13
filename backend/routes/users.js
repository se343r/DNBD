const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const supabase = require('../config/db');

const SALT_ROUNDS = 10;

// ============================================
// POST /api/users/register — Đăng ký tài khoản
// ============================================
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Vui lòng nhập đầy đủ username, email và password' });
    }

    // Kiểm tra tài khoản đã tồn tại
    const { data: existing, error: checkError } = await supabase
      .from('users')
      .select('id')
      .or(`username.eq.${username},email.eq.${email}`);

    if (checkError) throw checkError;

    if (existing && existing.length > 0) {
      return res.status(409).json({ error: 'Username hoặc email đã tồn tại' });
    }

    // Hash mật khẩu trước khi lưu
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const { data: newUser, error: insertError } = await supabase
      .from('users')
      .insert({
        username,
        email,
        password_hash: hashedPassword
      })
      .select('id, username, email, role, created_at')
      .single();

    if (insertError) throw insertError;

    res.status(201).json({
      message: 'Đăng ký thành công!',
      user: newUser,
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
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Vui lòng nhập username và password' });
    }

    const { data: user, error: fetchError } = await supabase
      .from('users')
      .select('id, username, email, password_hash, role, created_at')
      .eq('username', username)
      .maybeSingle();

    if (fetchError) throw fetchError;

    if (!user) {
      return res.status(401).json({ error: 'Sai tên đăng nhập hoặc mật khẩu' });
    }

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

module.exports = router;
