# 📦 后端依赖安装指南

## 前端依赖（已安装）

```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "firebase": "^10.7.0"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.2.1",
    "vite": "^5.0.8"
  }
}
```

**安装**:
```bash
npm install
```

---

## 后端选项 1: Firestore 监听服务

**依赖**:
```bash
npm install firebase-admin nodemailer dotenv
```

**文件**: `backend-firestore.js`

**运行**:
```bash
cp .env.example .env
# 编辑 .env 填入配置
node backend-firestore.js
```

---

## 后端选项 2: Express API 服务器

**依赖**:
```bash
npm install express cors firebase-admin nodemailer dotenv
```

**文件**: `backend-express.js`

**运行**:
```bash
cp .env.example .env
# 编辑 .env 填入配置
node backend-express.js
```

**验证 API**:
```bash
# 健康检查
curl http://localhost:3001/api/health

# 获取统计信息
curl http://localhost:3001/api/stats
```

---

## 完整的 package.json (后端)

```json
{
  "name": "taoyuan-backend",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "node backend-express.js",
    "start": "node backend-express.js",
    "listen": "node backend-firestore.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "firebase-admin": "^12.0.0",
    "nodemailer": "^6.9.7",
    "dotenv": "^16.3.1"
  },
  "devDependencies": {
    "nodemon": "^3.0.2"
  }
}
```

---

## 🔑 必需的凭证

### 1. Firebase Service Account Key

```bash
# 在 Firebase Console 获取
# Project Settings → Service Accounts → Generate new private key

# 保存为: serviceAccountKey.json
# ⚠️ 重要: 永远不要提交到 Git
```

### 2. Gmail 应用密码

```bash
# 1. 访问: https://myaccount.google.com/security
# 2. 启用 2-Step Verification
# 3. 生成应用密码
# 4. 在 .env 中配置
```

---

## 📝 创建 .env 文件

```bash
# 复制模板
cp .env.example .env

# 编辑 .env
# 填入你的配置信息
```

**.env 样本**:
```
# Firebase
FIREBASE_API_KEY=AIzaSyxxxxxxx
FIREBASE_PROJECT_ID=taoyuan-dd167
FIREBASE_APP_ID=1:1079472383479:web:xxx

# 邮件
EMAIL_USER=your@gmail.com
EMAIL_PASSWORD=xxxx xxxx xxxx xxxx
ADMIN_EMAIL=admin@company.com

# 服务器
PORT=3001
NODE_ENV=development
```

---

## ✅ 安装步骤

### 完整安装流程

```bash
# 1. 进入项目目录
cd /Users/liuxianlong/Desktop/Tom_VibeCoding/Taoyuan

# 2. 前端依赖（已完成）
npm install

# 3. 选择后端选项

# 选项 A: 只用 Firestore (推荐简单项目)
npm install firebase-admin nodemailer dotenv

# 或

# 选项 B: 完整的 Express API (推荐中大型项目)
npm install express cors firebase-admin nodemailer dotenv

# 4. 配置环境变量
cp .env.example .env
# 编辑 .env 填入配置

# 5. 获取 Firebase Service Account Key
# Firebase Console → Project Settings → Service Accounts → Generate Key
# 保存为 serviceAccountKey.json

# 6. 启动服务
node backend-express.js      # Express API
# 或
node backend-firestore.js    # Firestore 监听
```

---

## 🧪 测试后端

### 使用 cURL 测试 Express API

```bash
# 健康检查
curl http://localhost:3001/api/health

# 获取所有预约
curl http://localhost:3001/api/viewings

# 创建新预约
curl -X POST http://localhost:3001/api/viewings \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "phone": "0912345678",
    "email": "test@example.com",
    "gender": "male",
    "age": "25-35",
    "viewingDate": "2026-03-15",
    "viewingTime": "14:00",
    "propertyType": "公寓",
    "specialRequests": "Test"
  }'

# 获取统计信息
curl http://localhost:3001/api/stats
```

### 使用 Postman 测试

1. [下载 Postman](https://www.postman.com/downloads/)
2. 导入以下请求集合

**Collections**:
- `POST /api/viewings` - 创建预约
- `GET /api/viewings` - 获取列表
- `GET /api/stats` - 统计信息
- `PATCH /api/viewings/:id` - 更新状态

---

## 🚀 部署检查表

- [ ] `serviceAccountKey.json` 已获取
- [ ] `.env` 已正确配置
- [ ] 所有依赖已安装
- [ ] 后端服务能启动
- [ ] API 端点可访问
- [ ] 邮件能正常发送
- [ ] 前端能连接后端

---

## 📚 参考链接

- [Express.js 文档](https://expressjs.com/)
- [Firebase Admin SDK](https://firebase.google.com/docs/admin/setup)
- [Nodemailer 文档](https://nodemailer.com/)
- [Firebase Firestore](https://firebase.google.com/docs/firestore)
