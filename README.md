# My Portfolio

基于 `Vue + Vite + Node.js + Express` 的个人网站项目。

当前仓库已经支持：

- 本地开发：前后端同时启动
- 前后端分离部署：推荐 `Vercel + Render`
- 单服务部署：Express 托管前端构建产物

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

## 推荐部署方案：Vercel + Render

这是当前最推荐的前后端分离方案：

- 前端部署到 `Vercel`
- 后端部署到 `Render`

### 你暂时不需要准备的东西

以下内容在第一轮部署时都不是必需的：

- 自定义域名
- 自己购买服务器
- 额外第三方 API

平台会先提供默认网址，你可以先完成部署，再决定是否绑定域名。

### 第一步：部署后端到 Render

仓库根目录已经提供了 `render.yaml`，用于帮助 Render 识别后端服务配置：

- 文件：`render.yaml`
- 后端目录：`backend`
- 健康检查：`/api/health`

Render 上需要你做的事情：

1. 登录 Render
2. 选择通过 GitHub 导入当前仓库
3. 让 Render 读取仓库根目录的 `render.yaml`
4. 在环境变量里填写 `CORS_ORIGIN`

这里先填写一个占位值也可以，后面拿到前端地址后再改。

你最终会得到一个后端地址，例如：

```text
https://your-backend.onrender.com
```

### 第二步：部署前端到 Vercel

前端目录里已经提供了 Vercel SPA 重写配置：

- 文件：`frontend/vercel.json`

它的作用是保证 Vue 单页应用在刷新深层路由时不报 404。

Vercel 上需要你做的事情：

1. 登录 Vercel
2. 导入当前 GitHub 仓库
3. 将项目 Root Directory 设置为 `frontend`
4. 在 Environment Variables 中设置 `VITE_API_BASE_URL`

示例：

```env
VITE_API_BASE_URL=https://your-backend.onrender.com
```

部署完成后，你会得到一个前端地址，例如：

```text
https://your-frontend.vercel.app
```

### 第三步：回到 Render 更新 CORS

拿到前端地址后，回 Render 将：

```env
CORS_ORIGIN=https://your-frontend.vercel.app
```

如果你既要保留本地开发，又要允许线上访问，可以写成：

```env
CORS_ORIGIN=http://localhost:5173,https://your-frontend.vercel.app
```

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
