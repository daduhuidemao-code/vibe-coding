# RSS 订阅机器人 - 架构方案

## 一、核心需求总结

| 类别 | 需求 |
|------|------|
| **项目定位** | 完全公开的 RSS 内容聚合器，所有访问者看到相同内容 |
| **核心功能** | 新文章通知、内容聚合阅读、自动化处理 |
| **通知方式** | 邮件通知、Webhook |
| **用户管理** | 公开访问，无需认证，无个性化功能 |
| **管理方式** | 订阅源和系统设置通过配置文件管理，无管理界面和管理 API |
| **技术栈** | Python (FastAPI) + React + Tailwind CSS |
| **数据库** | PostgreSQL |
| **部署方式** | Docker 容器 |

## 二、系统架构

```
┌─────────────────────────────────────────────────────────────────┐
│                        Web 前端 (React)                         │
│   ┌─────────────┐ ┌─────────────┐ ┌─────────┐                  │
│   │ 文章列表页   │ │ 订阅源列表   │ │ 搜索页  │                  │
│   └─────────────┘ └─────────────┘ └─────────┘                  │
└───────────────────────────┬─────────────────────────────────────┘
                            │ REST API (只读)
┌───────────────────────────▼─────────────────────────────────────┐
│                      FastAPI 后端                               │
│   ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────┐  │
│   │ RSS 解析器   │ │ 通知服务     │ │ 搜索服务     │ │ API路由 │  │
│   └─────────────┘ └─────────────┘ └─────────────┘ └─────────┘  │
└───────────────────────────┬─────────────────────────────────────┘
                            │ PostgreSQL
┌───────────────────────────▼─────────────────────────────────────┐
│                      PostgreSQL 数据库                          │
│   ┌─────────────┐ ┌─────────────┐ ┌─────────────┐              │
│   │ subscriptions│ │  articles   │ │  groups     │              │
│   └─────────────┘ └─────────────┘ └─────────────┘              │
└─────────────────────────────────────────────────────────────────┘
                            │
┌───────────────────────────▼─────────────────────────────────────┐
│                      配置文件 (YAML)                            │
│   ┌─────────────────────┐ ┌───────────────────────────────────┐ │
│   │ feeds.yaml          │ │ config.yaml                       │ │
│   │ - 订阅源配置         │ │ - 邮件配置                        │ │
│   │ - 分组配置           │ │ - Webhook 配置                    │ │
│   │ - 检查频率           │ │ - 其他系统设置                    │ │
│   └─────────────────────┘ └───────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

## 三、数据库 Schema 设计

### 1. `groups` - 订阅分组表

| 字段 | 类型 | 说明 |
|------|------|------|
| id | VARCHAR(50) | 主键（与配置文件中的 ID 一致） |
| name | VARCHAR(100) | 分组名称 |
| color | VARCHAR(7) | 分组颜色标识 |
| created_at | TIMESTAMP | 创建时间 |

### 2. `subscriptions` - 订阅源表

| 字段 | 类型 | 说明 |
|------|------|------|
| id | VARCHAR(50) | 主键（与配置文件中的 ID 一致） |
| feed_url | VARCHAR(500) | RSS 订阅地址 |
| title | VARCHAR(200) | 订阅源标题 |
| description | TEXT | 订阅源描述 |
| group_id | VARCHAR(50) | 所属分组 ID (外键) |
| polling_interval | INTEGER | 检查间隔（分钟） |
| last_checked_at | TIMESTAMP | 上次检查时间 |
| enabled | BOOLEAN | 是否启用 |
| created_at | TIMESTAMP | 创建时间 |

### 3. `articles` - 文章表

| 字段 | 类型 | 说明 |
|------|------|------|
| id | SERIAL | 主键 |
| subscription_id | VARCHAR(50) | 所属订阅源 ID (外键) |
| title | VARCHAR(500) | 文章标题 |
| link | VARCHAR(1000) | 文章链接 |
| content | TEXT | 文章内容 |
| summary | TEXT | 文章摘要 |
| published_at | TIMESTAMP | 发布时间 |
| created_at | TIMESTAMP | 创建时间 |

## 四、功能优先级分阶段

### 🟢 Phase 1 - MVP（核心功能）

1. **配置文件加载** - 从 YAML 配置文件加载订阅源和分组
2. **文章抓取** - 定时抓取 RSS 内容，支持可配置频率
3. **文章去重** - 基于 URL 和标题去重
4. **文章列表** - 展示聚合文章列表，支持按时间排序
5. **订阅源列表** - 展示所有订阅源及其分组
6. **全文搜索** - 搜索文章标题和内容
7. **基础通知** - 邮件通知新文章

### 🟡 Phase 2 - 进阶功能

8. **Webhook 通知** - 调用自定义接口
9. **文章摘要** - 自动生成文章摘要

### 🔴 Phase 3 - 高级功能

10. **文章全文渲染** - 在界面中直接阅读文章
11. **数据统计** - 订阅活跃度、阅读统计
12. **多订阅源聚合视图** - 按分组/订阅源筛选
13. **Dark Mode** - 深色主题支持

## 五、技术选型详细说明

| 组件 | 技术 | 理由 |
|------|------|------|
| 后端框架 | FastAPI | 高性能、自动生成 API 文档、类型提示 |
| 前端框架 | React + TypeScript | 类型安全、组件化开发、生态成熟 |
| 样式方案 | Tailwind CSS | 快速开发、响应式设计、主题配置 |
| 数据库 | PostgreSQL | 全文搜索支持、JSON 字段、生产级稳定性 |
| ORM | SQLAlchemy | Python 生态成熟 ORM |
| RSS 解析 | feedparser | 强大的 RSS/Atom 解析库 |
| 定时任务 | APScheduler | 轻量级定时任务调度 |
| 邮件发送 | smtplib | Python 标准库，支持 SMTP |
| 容器化 | Docker Compose | 一键部署，环境隔离 |

## 六、项目目录结构

```
rssRobbot/
├── backend/                    # 后端代码
│   ├── app/                    # 应用主目录
│   │   ├── __init__.py
│   │   ├── main.py             # FastAPI 入口
│   │   ├── database.py         # 数据库连接配置
│   │   ├── models.py           # SQLAlchemy 模型
│   │   ├── schemas.py          # Pydantic 数据模型
│   │   ├── crud.py             # 数据库 CRUD 操作
│   │   ├── config.py           # 配置文件加载
│   │   ├── api/                # API 路由（只读）
│   │   │   ├── __init__.py
│   │   │   ├── subscriptions.py
│   │   │   ├── groups.py
│   │   │   └── articles.py
│   │   ├── services/           # 业务服务
│   │   │   ├── __init__.py
│   │   │   ├── rss_parser.py   # RSS 解析服务
│   │   │   ├── notification.py # 通知服务
│   │   │   └── search.py       # 搜索服务
│   │   ├── scheduler.py        # 定时任务调度
│   │   └── utils.py            # 工具函数
│   ├── requirements.txt        # Python 依赖
│   └── .env                    # 环境变量
├── config/                     # 配置文件目录
│   ├── feeds.yaml              # 订阅源配置
│   └── config.yaml             # 系统配置（邮件、Webhook 等）
├── frontend/                   # 前端代码
│   ├── src/
│   │   ├── components/         # 组件目录
│   │   ├── pages/              # 页面目录
│   │   ├── services/           # API 服务
│   │   ├── types/              # 类型定义
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.ts
├── docker-compose.yml          # Docker 配置
└── docs/                       # 文档目录
    └── architecture.md         # 架构文档
```

## 七、API 接口设计（只读）

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
| GET | /api/articles | 获取文章列表（支持分页、排序、筛选） |
| GET | /api/articles/{id} | 获取单篇文章 |

### 搜索 API

| 方法 | 路径 | 功能 |
|------|------|------|
| GET | /api/search?q={query} | 搜索文章标题和内容 |

## 八、配置文件格式

### feeds.yaml - 订阅源配置

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
  - id: news-001
    title: "新闻网站"
    feed_url: "https://news.example.com/rss"
    group_id: news
    polling_interval: 30
    enabled: true
```

### config.yaml - 系统配置

```yaml
database:
  url: postgresql://user:pass@db:5432/rss

notification:
  email:
    enabled: true
    smtp_host: smtp.example.com
    smtp_port: 587
    smtp_user: user@example.com
    smtp_password: password
    smtp_from: rss-robot@example.com
    smtp_tls: true
  webhook:
    enabled: false
    url: https://webhook.example.com/callback
    method: POST

app:
  cors_origins:
    - http://localhost:3000
    - https://your-domain.com
```

## 九、部署方案

### Docker Compose 配置

使用 Docker Compose 管理三个服务：
1. **PostgreSQL** - 数据库服务
2. **FastAPI** - 后端 API 服务（使用 uvicorn 运行）
3. **Nginx** - 前端静态服务，同时反向代理 API 请求

### Docker 网络架构

```
┌─────────────────────────────────────────────────────┐
│                    Nginx                            │
│   ┌───────────────────┐ ┌───────────────────────┐  │
│   │ 静态文件服务 (3000)│ │ API 反向代理 (/api)   │  │
│   └───────────────────┘ └───────────────────────┘  │
└───────────────────────────┬───────────────────────┘
                            │
            ┌───────────────┼───────────────┐
            ▼               ▼               ▼
    ┌─────────────┐  ┌─────────────┐  ┌─────────────┐
    │   React     │  │  FastAPI    │  │ PostgreSQL  │
    │ (build)     │  │ (uvicorn)   │  │             │
    └─────────────┘  └─────────────┘  └─────────────┘
```

### 环境变量

| 变量名 | 说明 | 默认值 |
|--------|------|--------|
| DATABASE_URL | PostgreSQL 连接地址 | postgresql://user:pass@db:5432/rss |
| CONFIG_PATH | 配置文件目录路径 | /app/config |

## 十、配置同步策略

### 配置变更检测

- **当前方案**：配置文件变更需要重启服务才能生效
- **未来优化**：可添加文件监听，自动检测配置变更并同步

### 同步逻辑

1. **分组同步**
   - 新增分组：在数据库中创建新分组记录
   - 修改分组：更新数据库中对应分组的名称和颜色
   - 删除分组：将分组标记为禁用，保留关联的订阅源和文章

2. **订阅源同步**
   - 新增订阅源：在数据库中创建新订阅源记录，立即触发一次抓取
   - 修改订阅源：更新数据库中对应订阅源的配置（标题、URL、频率等）
   - 删除订阅源：将订阅源标记为禁用，停止定时抓取，保留已抓取的文章

3. **文章保留策略**
   - 订阅源被禁用后，已抓取的文章仍然保留
   - 可通过配置设置文章保留天数，超过期限自动清理

## 十一、开发流程

1. **环境准备** - 安装 Docker、Docker Compose
2. **配置订阅源** - 修改 `config/feeds.yaml` 添加订阅源
3. **配置系统设置** - 修改 `config/config.yaml` 配置邮件等
4. **启动服务** - `docker-compose up -d`
5. **访问应用** - http://localhost:3000
6. **API 文档** - http://localhost:8000/docs

## 十二、技术实现细节

### 1. 数据库迁移

使用 Alembic 进行数据库迁移管理：
- 首次启动自动创建数据库表
- 后续 Schema 变更通过 Alembic 迁移脚本管理

### 2. 定时任务集成

APScheduler 通过 FastAPI 生命周期事件集成：
- `startup` 事件：启动定时任务调度器
- `shutdown` 事件：关闭定时任务调度器
- 支持按订阅源配置的频率进行抓取

### 3. CORS 配置

根据 `config.yaml` 中的 `app.cors_origins` 配置 CORS 允许的源：
- 开发环境：`http://localhost:3000`
- 生产环境：配置实际域名

### 4. 前端服务策略

- **开发环境**：Vite 开发服务器，代理 API 请求到后端
- **生产环境**：React 构建产物由 Nginx 提供静态服务，API 请求通过 Nginx 反向代理

## 十三、注意事项

1. **配置文件热更新** - 修改配置文件后需要重启服务生效
2. **邮件配置** - 需要正确配置 SMTP 参数才能发送邮件通知
3. **全文搜索** - 使用 PostgreSQL 的全文搜索功能，需要创建索引
4. **数据备份** - 定期备份 PostgreSQL 数据目录
5. **首次启动** - 首次启动会自动从配置文件同步订阅源到数据库
