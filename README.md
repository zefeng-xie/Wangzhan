# My Portfolio

基于 `Vue + Vite + Node.js + Express` 的个人网站项目。

当前仓库已经支持两种运行方式：

- 本地开发：前后端同时启动
- 部署上线：推荐前后端分离部署

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
- 前后端分离部署时，填写后端线上地址，例如：`https://your-backend.onrender.com`

### 后端

参考文件：`backend/.env.example`

```env
PORT=3001
CORS_ORIGIN=http://localhost:5173
```

说明：

- `PORT`：后端监听端口
- `CORS_ORIGIN`：允许访问后端接口的前端域名
- 如果有多个前端地址，可以用英文逗号分隔

示例：

```env
CORS_ORIGIN=http://localhost:5173,https://your-frontend.vercel.app
```

## 前后端分离部署

推荐思路：

- 前端部署到静态平台：`Vercel / Netlify / Cloudflare Pages`
- 后端部署到 Node 平台：`Render / Railway`

部署时你需要准备的外部信息只有两项：

1. 前端平台生成的线上域名
2. 后端平台生成的线上域名

然后做两步配置：

1. 在前端平台设置 `VITE_API_BASE_URL`
2. 在后端平台设置 `CORS_ORIGIN`

## 单服务部署

仓库仍然保留了单服务部署能力：

```powershell
npm.cmd run build
npm.cmd run start
```

这会让 Express 在生产环境直接托管 `frontend/dist`。

## 接口

- `GET /api/health`
- `GET /api/stats`
