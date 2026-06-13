const express = require('express');
const router = express.Router();
const supabase = require('../config/db');

// ============================================
// GET /api/stories — Lấy tất cả câu chuyện
// ============================================
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('stories')
      .select(`
        id, title, view_count, created_at, celebrity_id,
        celebrities (name, avatar_image)
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;

    const formatted = (data || []).map(s => ({
      id: s.id,
      title: s.title,
      view_count: s.view_count,
      created_at: s.created_at,
      celebrity_id: s.celebrity_id,
      celebrity_name: s.celebrities?.name,
      avatar_image: s.celebrities?.avatar_image
    }));

    res.json(formatted);
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
    const id = parseInt(req.params.id) || 0;

    // Tăng lượt xem
    const { data: current } = await supabase
      .from('stories')
      .select('view_count')
      .eq('id', id)
      .maybeSingle();

    if (current) {
      await supabase
        .from('stories')
        .update({ view_count: (current.view_count || 0) + 1 })
        .eq('id', id);
    }

    // Lấy chi tiết câu chuyện
    const { data: story, error: storyError } = await supabase
      .from('stories')
      .select(`
        id, title, content, view_count, created_at, celebrity_id,
        celebrities (name, avatar_image, summary)
      `)
      .eq('id', id)
      .maybeSingle();

    if (storyError) throw storyError;
    if (!story) {
      return res.status(404).json({ error: 'Không tìm thấy câu chuyện' });
    }

    // Lấy bình luận
    const { data: comments, error: commentsError } = await supabase
      .from('comments')
      .select(`
        id, content, created_at,
        users (username)
      `)
      .eq('story_id', id)
      .order('created_at', { ascending: false });

    if (commentsError) throw commentsError;

    const formattedComments = (comments || []).map(c => ({
      id: c.id,
      content: c.content,
      created_at: c.created_at,
      username: c.users?.username
    }));

    const responseData = {
      id: story.id,
      title: story.title,
      content: story.content,
      view_count: story.view_count,
      created_at: story.created_at,
      celebrity_id: story.celebrity_id,
      celebrity_name: story.celebrities?.name,
      avatar_image: story.celebrities?.avatar_image,
      celebrity_summary: story.celebrities?.summary,
      comments: formattedComments
    };

    res.json(responseData);
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
    const celebrityId = parseInt(req.params.celebrityId) || 0;
    const { data, error } = await supabase
      .from('stories')
      .select('id, title, view_count, created_at')
      .eq('celebrity_id', celebrityId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(data || []);
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
    const storyId = parseInt(req.params.id) || 0;
    const { user_id, content } = req.body;

    if (!user_id || !content) {
      return res.status(400).json({ error: 'Thiếu user_id hoặc content' });
    }

    const { error } = await supabase
      .from('comments')
      .insert({
        user_id: parseInt(user_id) || 0,
        story_id: storyId,
        content
      });

    if (error) throw error;

    res.status(201).json({ message: 'Bình luận đã được thêm thành công' });
  } catch (error) {
    console.error('Lỗi thêm bình luận:', error.message);
    res.status(500).json({ error: 'Không thể thêm bình luận' });
  }
});

module.exports = router;
