# 题库管理系统

专为【亡羊 Nassas】构建的智能题库管理与自测平台

## 🎯 项目简介

这是一个基于 MERN 技术栈（MongoDB、Express、React、Node.js）开发的现代题库管理系统，支持选择题和填空题的管理，提供智能自测功能，帮助用户高效学习和知识巩固。

## ✨ 主要功能

### 📚 题库管理

- **题目录入**：支持选择题和填空题的添加、编辑、删除
- **动态选项**：选择题支持 2-8 个选项的动态增减
- **标签分类**：支持数学、英语、编程、前端、后端、算法、数据库、网络等标签
- **难度分级**：简单、中等、困难三个难度等级
- **批量操作**：支持 JSON 格式的批量导入导出
- **智能筛选**：按题型、难度、标签、关键词搜索

### 🧪 自测系统

- **随机出题**：根据配置智能生成个性化试卷
- **题型选择**：可选择选择题、填空题或混合题型
- **数量控制**：自定义题目数量（5-50 题）
- **即时反馈**：选择题答题后立即显示正确性
- **计时功能**：实时显示答题时间
- **成绩统计**：自动计算得分和正确率

### 📊 历史记录

- **时间轴展示**：清晰展示测试历史
- **详细分析**：查看每道题的答题情况
- **成绩趋势**：使用 Chart.js 展示学习进度
- **试卷回顾**：重新查看历史试卷内容

### 🎨 用户体验

- **现代 UI**：基于 Material-UI v5 的现代化界面
- **响应式设计**：完美适配桌面和移动设备
- **主题切换**：支持浅色/深色主题切换
- **动画效果**：流畅的交互动画
- **卡片布局**：直观的卡片式设计

## 🛠️ 技术栈

### 前端

- **React 18** + **TypeScript**：现代化的前端框架
- **Redux Toolkit**：状态管理
- **Material-UI v5**：UI 组件库
- **React Router**：路由管理
- **Chart.js**：数据可视化
- **Vite**：构建工具

### 后端

- **Node.js** + **Express**：服务器框架
- **MongoDB** + **Mongoose**：数据库
- **CORS**：跨域处理
- **Helmet**：安全中间件
- **PM2**：进程管理

### 部署

- **Docker**：容器化部署
- **Nginx**：反向代理
- **pnpm**：包管理器

## 🚀 快速开始

### 环境要求

- Node.js 18+
- MongoDB 6.0+
- pnpm（推荐）或 npm

### 1. 克隆项目

```bash
git clone <repository-url>
cd Answering
```

### 2. 安装依赖

```bash
# 安装后端依赖
cd server
npm install

# 安装前端依赖
cd ../client
npm install
```

### 3. 配置环境变量

```bash
# 后端配置
cd server
cp env.example .env
# 编辑 .env 文件配置数据库连接等
```

### 4. 启动开发服务器

```bash
# 启动后端服务（端口3000）
cd server
npm run dev

# 启动前端服务（端口5173）
cd client
npm run dev
```

### 5. 访问应用

- 前端：http://localhost:5173
- 后端 API：http://localhost:3000

## 📦 生产部署

### 使用 Docker Compose（推荐）

```bash
# 一键部署
docker-compose up -d

# 查看服务状态
docker-compose ps
```

### 手动部署

```bash
# 构建前端
cd client
npm run build

# 启动后端
cd server
npm start

# 配置Nginx反向代理
# 参考 docker/nginx.conf
```

## 📁 项目结构

```
Answering/
├── client/                 # 前端React应用
│   ├── src/
│   │   ├── components/     # 组件
│   │   ├── pages/         # 页面
│   │   ├── store/         # Redux状态管理
│   │   ├── services/      # API服务
│   │   ├── types/         # TypeScript类型定义
│   │   └── theme/         # 主题配置
│   ├── package.json
│   └── vite.config.ts
├── server/                # 后端Node.js应用
│   ├── src/
│   │   ├── controllers/   # 控制器
│   │   ├── models/        # 数据模型
│   │   ├── routes/        # 路由
│   │   ├── middleware/    # 中间件
│   │   └── config/        # 配置
│   ├── package.json
│   └── ecosystem.config.js
├── docker/                # Docker配置
│   ├── docker-compose.yml
│   └── nginx.conf
├── start.sh              # 启动脚本
└── README.md
```

## 🔧 开发指南

### 代码规范

- 使用 ESLint + Prettier 进行代码格式化
- 遵循 TypeScript 严格模式
- 使用中文注释
- 组件采用函数式编程

### 提交规范

```bash
git add .
git commit -m "feat: 添加新功能"
git push
```

### 测试

```bash
# 前端测试
cd client
npm run test

# 后端测试
cd server
npm run test
```

## 📝 API 文档

### 题目管理

- `GET /api/questions` - 获取题目列表
- `POST /api/questions` - 创建新题目
- `PUT /api/questions/:id` - 更新题目
- `DELETE /api/questions/:id` - 删除题目
- `POST /api/questions/import` - 批量导入
- `GET /api/questions/export` - 批量导出

### 自测系统

- `POST /api/test/generate` - 生成测试试卷
- `POST /api/test/submit` - 提交测试答案

### 历史记录

- `GET /api/history` - 获取测试历史
- `GET /api/history/:id` - 获取测试详情

## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 👨‍💻 开发者

**亡羊 Nassas** - 题库管理系统的开发者

---

⭐ 如果这个项目对你有帮助，请给它一个星标！
