# My Portfolio

基于 `Vue + Vite + Node.js + Express` 的个人网站项目。

## 开发

在项目根目录执行：

```powershell
npm.cmd run dev
```

这会同时启动：

- 前端开发服务器：`http://localhost:5173`
- 后端接口服务：`http://localhost:3001`

## 生产构建

在项目根目录执行：

```powershell
npm.cmd run build
```

该命令会生成前端构建产物到 `frontend/dist`。

## 生产启动

在项目根目录执行：

```powershell
npm.cmd run start
```

后端会启动在 `PORT` 指定端口，默认是 `3001`，并直接托管 `frontend/dist` 中的前端页面。

## 接口

- `GET /api/health`
- `GET /api/stats`
