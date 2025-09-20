import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const port = 9000;

// 设置静态文件目录
app.use(express.static(path.join(__dirname, 'dist')));

// 处理所有路由，返回index.html（用于SPA）
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// 捕获所有其他路由
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// 启动服务器
app.listen(port, '0.0.0.0', () => {
  console.log(`服务器运行在 http://0.0.0.0:${port}`);
  console.log(`可以通过以下地址访问：`);
  console.log(`- http://localhost:${port}`);
  console.log(`- http://127.0.0.1:${port}`);
  console.log(`- http://172.30.0.2:${port}`);
  console.log(`- http://172.17.0.1:${port}`);
});