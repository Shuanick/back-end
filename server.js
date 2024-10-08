const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./routes/users');
const postRoutes = require('./routes/posts');
const uploadRoutes = require('./routes/upload');
const cors = require('cors');
const path = require('path');

const app = express();
const port = 3000;

// 连接到 MongoDB
mongoose.connect('mongodb+srv://linshuan880727:linshuan0727@nickserver.0wgra.mongodb.net/?retryWrites=true&w=majority&appName=NickServer');

// 检查连接
mongoose.connection.on('connected', () => {
  console.log('Connected to MongoDB');
});
mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

app.use(cors({
    origin: 'http://localhost:5173', // 允许此来源的请求
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // 允许的 HTTP 方法
    allowedHeaders: ['Content-Type', 'Authorization'] // 允许的标头
}));

// 中间件
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 设置路由
app.use('/upload', uploadRoutes);
app.use('/users', userRoutes);
app.use('/posts', postRoutes);

// 启动服务器
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
