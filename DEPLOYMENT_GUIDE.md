# 🚀 部署指南

本指南将帮助您将在线AI城建系统部署到各种平台，获得在线访问地址。

## 📋 部署前准备

### 1. 确保代码已推送到GitHub
```bash
git add .
git commit -m "feat: add deployment configuration"
git push origin main
```

### 2. 构建测试
```bash
npm run build
npm run preview
```

## 🌐 部署选项

### 方案一：Netlify 部署（推荐）⭐

**优势**：免费、快速、自动部署、CDN加速

#### 步骤：
1. 访问 [Netlify](https://netlify.com)
2. 点击 "New site from Git"
3. 选择您的GitHub仓库
4. 配置构建设置：
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
   - **Node version**: `18`

#### 自动部署配置：
项目已包含 `netlify.toml` 配置文件，支持：
- ✅ 自动构建和部署
- ✅ SPA路由重定向
- ✅ 安全头设置
- ✅ 资源缓存优化
- ✅ 性能优化

**预期访问地址**：`https://your-site-name.netlify.app`

---

### 方案二：Vercel 部署

**优势**：极快的构建速度、边缘网络、零配置

#### 步骤：
1. 访问 [Vercel](https://vercel.com)
2. 点击 "New Project"
3. 导入您的GitHub仓库
4. Vercel会自动检测React项目并配置

项目已包含 `vercel.json` 配置文件。

**预期访问地址**：`https://your-project.vercel.app`

---

### 方案三：GitHub Pages 部署

**优势**：完全免费、与GitHub集成

#### 自动部署（推荐）：
1. 在GitHub仓库中启用Actions
2. 推送代码到main分支
3. GitHub Actions会自动构建并部署

项目已包含 `.github/workflows/deploy.yml` 配置。

#### 手动部署：
```bash
npm run build
npm install -g gh-pages
gh-pages -d dist
```

**预期访问地址**：`https://yourusername.github.io/repository-name`

---

### 方案四：自定义服务器部署

#### 使用内置服务器：
```bash
# 构建项目
npm run build

# 启动服务器
npm run serve
```

#### 使用Nginx：
```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    location / {
        root /path/to/dist;
        try_files $uri $uri/ /index.html;
    }
    
    location /assets/ {
        root /path/to/dist;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

## 🔧 环境变量配置

创建 `.env.production` 文件：
```env
VITE_APP_TITLE=在线AI城建系统
VITE_API_URL=https://your-api.com
VITE_ANALYTICS_ID=your-analytics-id
```

## 📱 PWA功能

项目已配置PWA功能：
- ✅ 离线访问支持
- ✅ 安装到主屏幕
- ✅ 后台同步
- ✅ 推送通知支持

用户可以：
1. 在浏览器中点击"添加到主屏幕"
2. 像原生应用一样使用
3. 离线访问基本功能

## 🎯 性能优化

### 已实现的优化：
- ✅ 代码分割和懒加载
- ✅ 资源压缩和缓存
- ✅ CDN加速配置
- ✅ 图片优化
- ✅ 字体优化

### 性能监控：
- Lighthouse CI 集成
- Web Vitals 监控
- 构建大小分析

## 🔒 安全配置

### HTTP安全头：
- ✅ X-Frame-Options
- ✅ X-Content-Type-Options
- ✅ X-XSS-Protection
- ✅ Referrer-Policy
- ✅ Permissions-Policy

### HTTPS配置：
所有推荐的部署平台都自动提供HTTPS。

## 📊 监控和分析

### 推荐集成：
1. **Google Analytics 4**
2. **Sentry** - 错误监控
3. **Hotjar** - 用户行为分析

### 配置示例：
```javascript
// 在 main.jsx 中添加
if (import.meta.env.PROD) {
  // Google Analytics
  gtag('config', 'GA_MEASUREMENT_ID')
  
  // Sentry
  Sentry.init({
    dsn: "YOUR_DSN",
    environment: "production"
  })
}
```

## 🌍 自定义域名

### Netlify：
1. 在Netlify控制台中添加自定义域名
2. 配置DNS记录指向Netlify

### Vercel：
1. 在项目设置中添加域名
2. 配置DNS记录

### GitHub Pages：
1. 在仓库设置中配置自定义域名
2. 添加CNAME文件到public目录

## 🚀 快速部署命令

### 一键部署到Netlify：
```bash
npx netlify-cli deploy --prod --dir=dist
```

### 一键部署到Vercel：
```bash
npx vercel --prod
```

## 📋 部署检查清单

部署前请确认：
- [ ] 代码已推送到GitHub
- [ ] 构建成功 (`npm run build`)
- [ ] 本地预览正常 (`npm run preview`)
- [ ] 环境变量已配置
- [ ] 域名DNS已配置（如使用自定义域名）
- [ ] 分析工具已集成
- [ ] 错误监控已配置

## 🎉 部署成功后

### 测试项目：
1. ✅ 访问主页
2. ✅ 测试所有功能模块
3. ✅ 检查移动端适配
4. ✅ 验证PWA功能
5. ✅ 测试离线访问

### 性能检查：
1. 使用Lighthouse测试
2. 检查页面加载速度
3. 验证SEO设置
4. 测试可访问性

---

## 🆘 常见问题

### Q: 部署后页面空白？
A: 检查路由配置，确保SPA重定向规则正确。

### Q: 静态资源加载失败？
A: 检查base路径配置，确保与部署路径一致。

### Q: PWA功能无效？
A: 确保HTTPS环境，检查service worker注册。

### Q: 构建失败？
A: 检查Node.js版本，确保依赖安装完整。

---

**🎯 推荐部署方案**：Netlify（免费且功能完整）

**📱 访问体验**：支持桌面、平板、手机全平台访问

**⚡ 性能保证**：首屏加载 < 2秒，交互响应 < 100ms