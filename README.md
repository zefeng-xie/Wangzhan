# My Portfolio

基于 `Vue + Vite + Node.js + Express` 的个人网站项目。

当前仓库支持两种运行方式：

- 本地开发：前后端同时启动
- 自有服务器部署：`Nginx + Node.js + PM2 + HTTPS`

本项目后续推荐采用“前后端分离的自部署”思路：

- 前端：Vite 构建后输出静态文件
- 后端：Express 进程独立运行
- 入口：由 `Nginx` 统一接入
- 路由策略：
  - `/` 和前端静态资源交给 Nginx
  - `/api/*` 反向代理到 Node.js

这样既保留了前后端分离，又不需要前端额外处理跨域。

## 本地开发

在项目根目录执行：

```powershell
npm.cmd run dev
```

默认会启动：

- 前端开发服务器：`http://localhost:5173`
- 后端接口服务：`http://localhost:3001`

## 环境变量

### 前端

参考文件：`frontend/.env.example`

```env
VITE_API_BASE_URL=
```

说明：

- 本地开发时可以留空，Vite 会通过代理把 `/api` 转发到本地后端
- 自部署时如果采用“同域名 + Nginx 反代 /api”方案，也可以留空
- 只有当前后端使用不同域名时，才需要填写完整后端地址

### 后端

参考文件：`backend/.env.example`

```env
PORT=3001
CORS_ORIGIN=http://localhost:5173
```

说明：

- `PORT`：后端监听端口
- `CORS_ORIGIN`：允许访问后端接口的前端域名
- 如果你采用同域名部署，通常可以不设置该变量

## 自有服务器部署方案

推荐环境：

- Ubuntu 22.04 / 24.04
- Nginx
- Node.js 20+
- PM2
- 可选：Certbot / Let's Encrypt

仓库中已提供两类服务器配置模板：

- Nginx 配置：`deploy/nginx/wangzhan.conf`
- PM2 配置：`deploy/pm2/ecosystem.config.cjs`

### 推荐目录结构

建议把项目部署到类似下面的位置：

```text
/var/www/wangzhan/
  ├─ repo/                # Git 仓库
  ├─ frontend-dist/       # 前端构建产物
  └─ logs/                # 可选日志目录
```

### 生产部署思路

#### 1. 服务器安装运行环境

需要安装：

- Git
- Node.js
- npm
- PM2
- Nginx

#### 2. 拉取项目代码

在服务器上执行：

```bash
git clone https://github.com/zefeng-xie/Wangzhan.git /var/www/wangzhan/repo
cd /var/www/wangzhan/repo
```

#### 3. 安装依赖

```bash
cd /var/www/wangzhan/repo/frontend && npm install
cd /var/www/wangzhan/repo/backend && npm install
```

#### 4. 构建前端

```bash
cd /var/www/wangzhan/repo/frontend
npm run build
```

然后把构建产物部署到 Nginx 静态目录，例如：

```bash
mkdir -p /var/www/wangzhan/frontend-dist
cp -r dist/* /var/www/wangzhan/frontend-dist/
```

#### 5. 配置后端环境变量

在 `backend` 目录下创建 `.env`，例如：

```env
PORT=3001
```

如果你后面改成前后端不同域名，再加：

```env
CORS_ORIGIN=https://your-frontend-domain.com
```

#### 6. 用 PM2 启动后端

```bash
cd /var/www/wangzhan/repo
pm2 start deploy/pm2/ecosystem.config.cjs
pm2 save
pm2 startup
```

#### 7. 配置 Nginx

使用仓库中的模板文件：

- `deploy/nginx/wangzhan.conf`

你需要修改其中两个关键值：

- `server_name`
- `root`

修改完成后，把它链接到：

```bash
/etc/nginx/sites-available/wangzhan.conf
/etc/nginx/sites-enabled/wangzhan.conf
```

然后检查并重载：

```bash
nginx -t
systemctl reload nginx
```

#### 8. 配置 HTTPS

如果你有域名，推荐使用 Certbot：

```bash
certbot --nginx -d your-domain.com -d www.your-domain.com
```

## 当前这套自部署架构的特点

### 优点

- 完整保留 `Vue + Node.js` 技术栈
- 真正接触 Linux、Nginx、进程管理、反向代理、HTTPS
- 后续加动画、交互、API、后台都不会受平台限制
- 以后可以迁移到 Docker、CI/CD、容器平台

### 成本

- 需要你自己有一台服务器
- 需要自己维护系统、Nginx、Node、证书、日志
- 学习成本更高，但也更接近真实工程

## 接口

- `GET /api/health`
- `GET /api/stats`

## 说明

仓库曾临时加入过 Render / Vercel 的部署尝试，但当前推荐路线已经切回自有服务器部署。
