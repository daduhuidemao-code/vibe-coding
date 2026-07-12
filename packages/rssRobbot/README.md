# RSS 订阅机器人

一个完全公开的 RSS 内容聚合器，支持定时抓取、全文搜索、文章摘要和多端通知。

## ✨ 功能特性

- **内容聚合** - 从多个 RSS 订阅源聚合文章
- **定时抓取** - 可配置的抓取频率
- **全文搜索** - 搜索文章标题和内容
- **文章摘要** - 自动生成文章摘要
- **通知功能** - 邮件通知和 Webhook 通知
- **分组管理** - 订阅源按分组管理
- **文章详情** - 支持阅读完整文章内容
- **数据统计** - 订阅活跃度和文章统计
- **深色主题** - 支持 Dark Mode
- **Docker 部署** - 一键容器化部署

## 🛠 技术栈

| 组件 | 技术 |
|------|------|
| 后端 | Python 3.10+ / FastAPI |
| 前端 | React 18 / TypeScript / Tailwind CSS |
| 数据库 | PostgreSQL 15+ |
| RSS 解析 | feedparser |
| 定时任务 | APScheduler |
| 容器化 | Docker / Docker Compose |

## 📁 项目结构

```
packages/rssRobbot/
├── backend/                      # 后端代码
│   ├── app/                      # FastAPI 应用
│   │   ├── api/                  # API 路由
│   │   ├── services/             # 业务服务
│   │   ├── main.py               # 应用入口
│   │   ├── database.py           # 数据库配置
│   │   ├── models.py             # SQLAlchemy 模型
│   │   ├── schemas.py            # Pydantic 模型
│   │   ├── crud.py               # CRUD 操作
│   │   ├── config.py             # 配置加载
│   │   └── scheduler.py          # 定时任务
│   ├── Dockerfile
│   └── requirements.txt
├── frontend/                     # 前端代码
│   ├── src/
│   │   ├── components/           # UI 组件
│   │   ├── pages/                # 页面组件
│   │   ├── services/             # API 服务
│   │   ├── types/                # 类型定义
│   │   ├── context/              # React Context
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── Dockerfile
│   └── nginx.conf
├── config/                       # 配置文件
│   ├── feeds.yaml                # 订阅源配置
│   └── config.yaml               # 系统配置
├── docs/                         # 文档
│   ├── architecture.md           # 架构文档
│   ├── phase1-summary.md         # Phase 1 总结
│   ├── phase2-summary.md         # Phase 2 总结
│   └── phase3-summary.md         # Phase 3 总结
└── docker-compose.yml            # Docker Compose 配置
```

## 🚀 快速开始

### 环境要求

- Docker 20.10+
- Docker Compose 2.0+

### 启动服务

```bash
cd packages/rssRobbot
docker-compose up -d
```

### 访问地址

- **前端应用**: http://localhost:3000
- **后端 API**: http://localhost:8000
- **API 文档**: http://localhost:8000/docs

### 停止服务

```bash
docker-compose down
```

## ⚙️ 配置说明

### 订阅源配置 (`config/feeds.yaml`)

```yaml
groups:
  - id: tech
    name: 技术
    color: "#3B82F6"
  - id: news
    name: 新闻
    color: "#EF4444"

subscriptions:
  - id: tech-001
    title: "技术博客"
    feed_url: "https://example.com/rss"
    group_id: tech
    polling_interval: 60
    enabled: true
```

### 系统配置 (`config/config.yaml`)

```yaml
database:
  url: postgresql://rss_user:rss_password@db:5432/rss_db

notification:
  email:
    enabled: false
    smtp_host: smtp.example.com
    smtp_port: 587
    smtp_user: user@example.com
    smtp_password: password
    smtp_from: rss-robot@example.com
    smtp_tls: true
  webhook:
    enabled: false
    url: https://webhook.example.com/callback
    headers:
      Content-Type: application/json
    timeout: 10
    max_retries: 3
    retry_delay: 5

summary:
  enabled: true
  max_length: 200

app:
  cors_origins:
    - http://localhost:3000
```

## 🔌 API 接口

### 订阅源 API

| 方法 | 路径 | 功能 |
|------|------|------|
| GET | /api/subscriptions | 获取所有订阅源 |
| GET | /api/subscriptions/{id} | 获取单个订阅源 |

### 分组 API

| 方法 | 路径 | 功能 |
|------|------|------|
| GET | /api/groups | 获取所有分组 |
| GET | /api/groups/{id} | 获取单个分组 |

### 文章 API

| 方法 | 路径 | 功能 |
|------|------|------|
| GET | /api/articles | 获取文章列表（分页、筛选） |
| GET | /api/articles/{id} | 获取单篇文章 |

### 搜索 API

| 方法 | 路径 | 功能 |
|------|------|------|
| GET | /api/search?q={query} | 搜索文章 |

### 统计 API

| 方法 | 路径 | 功能 |
|------|------|------|
| GET | /api/statistics | 获取统计数据 |

## 📝 开发模式

### 后端开发

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
python app/main.py
```

### 前端开发

```bash
cd frontend
npm install
npm run dev
```

## 📊 功能阶段

| Phase | 状态 | 功能 |
|-------|------|------|
| Phase 1 | ✅ | 配置加载、文章抓取、去重、列表展示、搜索、邮件通知 |
| Phase 2 | ✅ | Webhook 通知、文章摘要生成 |
| Phase 3 | ✅ | 文章详情、数据统计、分组筛选、深色主题 |

## 📄 许可证

MIT License