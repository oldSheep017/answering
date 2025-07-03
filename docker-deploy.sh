#!/bin/bash

# Docker 部署脚本 - 题库管理系统
# 专门用于Docker环境，包含缓存刷新功能

set -e

echo "🐳 开始Docker部署题库管理系统..."

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
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

log_step() {
    echo -e "${BLUE}[STEP]${NC} $1"
}

# 检查Docker是否运行
check_docker() {
    if ! docker info > /dev/null 2>&1; then
        log_error "Docker 未运行，请先启动 Docker"
        exit 1
    fi
    log_info "Docker 检查通过"
}

# 检查Docker Compose是否可用
check_docker_compose() {
    if ! docker-compose version > /dev/null 2>&1; then
        log_error "Docker Compose 不可用"
        exit 1
    fi
    log_info "Docker Compose 检查通过"
}

# 生成构建参数
generate_build_args() {
    export BUILD_TIME=$(date -u +'%Y-%m-%dT%H:%M:%SZ')
    export VERSION=$(git describe --tags --always 2>/dev/null || echo "1.0.0")
    
    log_info "构建参数:"
    log_info "  构建时间: $BUILD_TIME"
    log_info "  版本: $VERSION"
}

# 清理旧容器和镜像
cleanup_old_containers() {
    log_step "清理旧容器和镜像..."
    
    # 停止并删除旧容器
    log_info "停止旧容器..."
    docker-compose -f docker/docker-compose.yml down --remove-orphans || true
    
    # 删除旧镜像（可选）
    if [[ "$1" == "--clean-images" ]]; then
        log_info "删除旧镜像..."
        docker rmi question-bank-client question-bank-server 2>/dev/null || true
        docker system prune -f
    fi
    
    log_info "清理完成"
}

# 构建新镜像
build_images() {
    log_step "构建Docker镜像..."
    
    # 切换到docker目录
    cd docker
    
    # 构建镜像
    log_info "构建镜像中..."
    docker-compose build --no-cache
    
    cd ..
    log_info "镜像构建完成"
}

# 启动服务
start_services() {
    log_step "启动服务..."
    
    cd docker
    
    # 启动服务
    log_info "启动服务中..."
    docker-compose up -d
    
    # 等待服务启动
    log_info "等待服务启动..."
    sleep 15
    
    cd ..
    log_info "服务启动完成"
}

# 健康检查
health_check() {
    log_step "执行健康检查..."
    
    # 检查容器状态
    cd docker
    if docker-compose ps | grep -q "Up"; then
        log_info "所有容器运行正常"
    else
        log_error "部分容器启动失败"
        docker-compose logs
        exit 1
    fi
    cd ..
    
    # 检查服务响应
    log_info "检查服务响应..."
    
    # 检查后端API
    if curl -f http://localhost:5000/health > /dev/null 2>&1; then
        log_info "✅ 后端API正常"
    else
        log_warn "⚠️  后端API可能未完全启动"
    fi
    
    # 检查前端
    if curl -f http://localhost:3000 > /dev/null 2>&1; then
        log_info "✅ 前端服务正常"
    else
        log_warn "⚠️  前端服务可能未完全启动"
    fi
    
    log_info "健康检查完成"
}

# 显示部署信息
show_deploy_info() {
    log_info "🎉 部署完成！"
    echo ""
    echo "📋 服务信息："
    echo "   前端地址: http://localhost:3000"
    echo "   后端API: http://localhost:5000"
    echo "   健康检查: http://localhost:5000/health"
    echo ""
    echo "🔧 常用命令："
    echo "   查看日志: docker-compose -f docker/docker-compose.yml logs -f"
    echo "   停止服务: docker-compose -f docker/docker-compose.yml down"
    echo "   重启服务: docker-compose -f docker/docker-compose.yml restart"
    echo "   查看状态: docker-compose -f docker/docker-compose.yml ps"
    echo ""
    echo "💡 缓存刷新说明："
    echo "   1. 本次部署已自动生成新的构建时间戳"
    echo "   2. 静态资源文件名包含hash，会自动刷新"
    echo "   3. 如果仍有缓存问题，请："
    echo "      - 强制刷新浏览器: Ctrl+F5 (Windows) 或 Cmd+Shift+R (Mac)"
    echo "      - 清除浏览器缓存"
    echo "      - 使用无痕模式访问"
    echo ""
    echo "📊 构建信息："
    echo "   构建时间: $BUILD_TIME"
    echo "   版本: $VERSION"
}

# 显示帮助信息
show_help() {
    echo "🐳 Docker 部署脚本"
    echo ""
    echo "用法: $0 [选项]"
    echo ""
    echo "选项:"
    echo "  --clean-images    删除旧镜像（完全重新构建）"
    echo "  --help           显示此帮助信息"
    echo ""
    echo "示例:"
    echo "  $0                # 普通部署"
    echo "  $0 --clean-images # 完全重新构建"
}

# 主函数
main() {
    # 解析命令行参数
    CLEAN_IMAGES=false
    
    while [[ $# -gt 0 ]]; do
        case $1 in
            --clean-images)
                CLEAN_IMAGES=true
                shift
                ;;
            --help)
                show_help
                exit 0
                ;;
            *)
                log_error "未知参数: $1"
                show_help
                exit 1
                ;;
        esac
    done
    
    log_info "开始Docker部署流程..."
    
    check_docker
    check_docker_compose
    generate_build_args
    cleanup_old_containers $([ "$CLEAN_IMAGES" = true ] && echo "--clean-images")
    build_images
    start_services
    health_check
    show_deploy_info
    
    log_info "Docker部署完成！"
}

# 执行主函数
main "$@" 