// routes/posts.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Post = require('../models/post');

// 設定圖片上傳存儲
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // 指定圖片上傳目錄
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // 使用當前時間戳作為文件名
  }
});

const upload = multer({ storage: storage });

// 創建新帖子
router.post('/', upload.single('image'), async (req, res) => {
  const { content } = req.body;
  if (!content) {
    return res.status(400).send('Content is required');
  }

  try {
    const newPost = new Post({
      content,
      image: req.file ? `/uploads/${path.basename(req.file.path)}` : null
    });
    await newPost.save();
    res.status(201).json({ message: 'Post created successfully', data: newPost });
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).send('Error creating post: ' + error.message);
  }
});

// 獲取所有帖子
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find();
    res.send(posts);
  } catch (error) {
    res.status(500).send('Error fetching posts: ' + error.message);
  }
});

module.exports = router;
