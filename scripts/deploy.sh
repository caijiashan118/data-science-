#!/bin/bash

# 部署脚本 - 在线AI城建系统
# 使用方法: ./scripts/deploy.sh [platform]
# 平台选项: netlify, vercel, github-pages

set -e

echo "🚀 开始部署在线AI城建系统..."

# 检查Node.js版本
NODE_VERSION=$(node -v)
echo "📦 Node.js版本: $NODE_VERSION"

# 安装依赖
echo "📥 安装依赖..."
npm ci

# 代码质量检查
echo "🔍 代码质量检查..."
npm run lint

# 格式化检查
echo "💅 代码格式检查..."
npm run format:check

# 构建项目
echo "🔧 构建项目..."
npm run build

# 构建成功提示
echo "✅ 构建完成！"
echo "📊 构建产物："
ls -lah dist/

# 根据参数选择部署平台
PLATFORM=${1:-"manual"}

case $PLATFORM in
  "netlify")
    echo "🌐 部署到Netlify..."
    if command -v netlify &> /dev/null; then
      netlify deploy --prod --dir=dist
    else
      echo "❌ Netlify CLI未安装，请运行: npm install -g netlify-cli"
      exit 1
    fi
    ;;
  "vercel")
    echo "⚡ 部署到Vercel..."
    if command -v vercel &> /dev/null; then
      vercel --prod
    else
      echo "❌ Vercel CLI未安装，请运行: npm install -g vercel"
      exit 1
    fi
    ;;
  "github-pages")
    echo "📄 部署到GitHub Pages..."
    if command -v gh-pages &> /dev/null; then
      gh-pages -d dist
    else
      echo "❌ gh-pages未安装，请运行: npm install -g gh-pages"
      exit 1
    fi
    ;;
  "manual")
    echo "📋 手动部署模式"
    echo "构建完成，请手动上传 dist/ 目录到您的服务器"
    echo ""
    echo "或者选择以下自动部署选项："
    echo "  ./scripts/deploy.sh netlify     # 部署到Netlify"
    echo "  ./scripts/deploy.sh vercel      # 部署到Vercel"
    echo "  ./scripts/deploy.sh github-pages # 部署到GitHub Pages"
    ;;
  *)
    echo "❌ 不支持的部署平台: $PLATFORM"
    echo "支持的平台: netlify, vercel, github-pages"
    exit 1
    ;;
esac

echo ""
echo "🎉 部署完成！"
echo "📱 请访问您的网站测试功能"
echo "🔍 建议运行Lighthouse性能测试"