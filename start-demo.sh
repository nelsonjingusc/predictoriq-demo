#!/bin/bash

# PredictorIQ Demo 一键启动脚本
# 使用方法: ./start-demo.sh

set -e  # 遇到错误立即退出

echo "🚀 Starting PredictorIQ Demo..."
echo ""

# 确保在正确的目录
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# 进入 client 目录
cd client

# 检查并创建 .env.local 文件
if [ ! -f .env.local ]; then
    echo "📝 Creating .env.local file..."
    cp .env.local.example .env.local
    echo "✅ Demo mode enabled"
else
    echo "✅ .env.local already exists"
fi

echo ""

# 检查是否需要安装依赖
if [ ! -d node_modules ]; then
    echo "📦 Installing dependencies..."
    npm install
    echo "✅ Dependencies installed"
else
    echo "✅ Dependencies already installed"
fi

echo ""
echo "🎬 Starting dev server..."
echo "   The demo will open at http://localhost:3000"
echo "   (or http://localhost:3001 if port 3000 is in use)"
echo ""
echo "📊 Demo Mode Active - Mock data enabled"
echo "   Press Ctrl+C to stop the server"
echo ""
echo "---"

# 启动开发服务器
npm run dev
