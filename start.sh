#!/bin/bash

# 题库管理系统启动脚本

echo "🚀 启动题库管理系统..."

# 检查是否安装了 pnpm
if ! command -v pnpm &> /dev/null; then
    echo "❌ 未找到 pnpm，正在安装..."
    npm install -g pnpm
fi

# 检查 MongoDB 是否运行
if ! pgrep -x "mongod" > /dev/null; then
    echo "⚠️  MongoDB 未运行，请先启动 MongoDB:"
    echo "   sudo systemctl start mongod"
    echo "   或使用 Docker: docker run -d --name mongodb -p 27017:27017 mongo:6.0"
    echo ""
    read -p "是否继续启动应用？(y/n): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# 启动后端服务
echo "📦 安装后端依赖..."
cd server
pnpm install

echo "🔧 配置环境变量..."
if [ ! -f .env ]; then
    cp env.example .env
    echo "✅ 已创建 .env 文件，请根据需要修改配置"
fi

echo "🚀 启动后端服务..."
pnpm dev &
SERVER_PID=$!

# 等待后端启动
echo "⏳ 等待后端服务启动..."
sleep 5

# 启动前端服务
echo "📦 安装前端依赖..."
cd ../client
pnpm install

echo "🚀 启动前端服务..."
pnpm dev &
CLIENT_PID=$!

echo ""
echo "✅ 服务启动完成！"
echo "📍 前端地址: http://localhost:3000"
echo "📍 后端地址: http://localhost:5000"
echo "📍 健康检查: http://localhost:5000/health"
echo ""
echo "按 Ctrl+C 停止所有服务"

# 等待用户中断
trap "echo ''; echo '🛑 正在停止服务...'; kill $SERVER_PID $CLIENT_PID 2>/dev/null; exit 0" INT

# 保持脚本运行
wait 