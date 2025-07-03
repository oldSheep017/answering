#!/bin/bash

# 题库管理系统部署脚本
# 包含缓存刷新功能

set -e

echo "🚀 开始部署题库管理系统..."

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 日志函数
log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 检查Docker是否运行
check_docker() {
    if ! docker info > /dev/null 2>&1; then
        log_error "Docker 未运行，请先启动 Docker"
        exit 1
    fi
    log_info "Docker 检查通过"
}

# 构建前端
build_frontend() {
    log_info "构建前端应用..."
    cd client
    
    # 清理旧的构建文件
    rm -rf dist
    
    # 安装依赖
    log_info "安装前端依赖..."
    pnpm install
    
    # 构建应用
    log_info "构建前端应用..."
    pnpm build
    
    # 生成构建信息文件
    echo "构建时间: $(date)" > dist/build-info.txt
    echo "版本: $(cat package.json | grep '"version"' | cut -d'"' -f4)" >> dist/build-info.txt
    echo "Git提交: $(git rev-parse HEAD 2>/dev/null || echo 'unknown')" >> dist/build-info.txt
    
    cd ..
    log_info "前端构建完成"
}

# 构建后端
build_backend() {
    log_info "构建后端应用..."
    cd server
    
    # 安装依赖
    log_info "安装后端依赖..."
    pnpm install
    
    cd ..
    log_info "后端依赖安装完成"
}

# 构建Docker镜像
build_docker() {
    log_info "构建 Docker 镜像..."
    
    # 停止并删除旧容器
    log_info "清理旧容器..."
    docker-compose down --remove-orphans || true
    
    # 删除旧镜像
    log_info "清理旧镜像..."
    docker rmi answering-client answering-server 2>/dev/null || true
    
    # 构建新镜像
    log_info "构建新镜像..."
    docker-compose build --no-cache
    
    log_info "Docker 镜像构建完成"
}

# 启动服务
start_services() {
    log_info "启动服务..."
    docker-compose up -d
    
    # 等待服务启动
    log_info "等待服务启动..."
    sleep 10
    
    # 检查服务状态
    if docker-compose ps | grep -q "Up"; then
        log_info "服务启动成功"
    else
        log_error "服务启动失败"
        docker-compose logs
        exit 1
    fi
}

# 清理缓存
clear_cache() {
    log_info "清理缓存..."
    
    # 清理浏览器缓存（通过HTTP头）
    # 这个在nginx.conf中已经配置
    
    # 清理Docker缓存
    docker system prune -f
    
    log_info "缓存清理完成"
}

# 健康检查
health_check() {
    log_info "执行健康检查..."
    
    # 检查前端
    if curl -f http://localhost:3000 > /dev/null 2>&1; then
        log_info "前端服务正常"
    else
        log_warn "前端服务可能未完全启动"
    fi
    
    # 检查后端
    if curl -f http://localhost:5000/health > /dev/null 2>&1; then
        log_info "后端服务正常"
    else
        log_warn "后端服务可能未完全启动"
    fi
    
    log_info "健康检查完成"
}

# 显示部署信息
show_deploy_info() {
    log_info "部署完成！"
    echo ""
    echo "📋 部署信息："
    echo "   前端地址: http://localhost:3000"
    echo "   后端API: http://localhost:5000"
    echo "   健康检查: http://localhost:5000/health"
    echo ""
    echo "🔧 常用命令："
    echo "   查看日志: docker-compose logs -f"
    echo "   停止服务: docker-compose down"
    echo "   重启服务: docker-compose restart"
    echo ""
    echo "💡 缓存刷新提示："
    echo "   1. 强制刷新浏览器: Ctrl+F5 (Windows) 或 Cmd+Shift+R (Mac)"
    echo "   2. 清除浏览器缓存"
    echo "   3. 使用无痕模式访问"
}

# 主函数
main() {
    log_info "开始部署流程..."
    
    check_docker
    build_frontend
    build_backend
    build_docker
    clear_cache
    start_services
    health_check
    show_deploy_info
    
    log_info "部署完成！"
}

# 执行主函数
main "$@" 