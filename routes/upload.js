const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

// 设置存储
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// 上传路由
router.post('/', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded');
  }
  res.json({ imagePath: `/uploads/${path.basename(req.file.path)}` });
});

module.exports = router;
