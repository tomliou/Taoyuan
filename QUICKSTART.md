# 🚀 快速开始指南

## 📊 整个系统已为你设置好！

```
✅ 前端表单             (React + Vite)          - 已完成
✅ 样式和动画           (Luxury Design)         - 已完成
✅ Firebase 初始化      (firestore.js)          - 已完成
✅ 两种后端选项         (Firestore + Express)   - 已完成
```

---

## ⚡ 5 分钟快速启动

### 步骤 1: 获取 Firebase 配置

1. 访问 [Firebase Console](https://console.firebase.google.com/project/taoyuan-dd167)
2. 点击 **⚙️ Project Settings**
3. 向下滚动到 **Your apps** 部分
4. 点击 **Web (< / >)** 查看配置

**复制这些信息**:
```javascript
apiKey: "..."          ← 需要
appId: "..."           ← 需要
```

### 步骤 2: 下载 Service Account Key（后端用）

1. 在 Firebase Console，点击 **Project Settings**
2. 点击 **Service Accounts** 标签
3. 点击 **Generate new private key**
4. 保存为 `serviceAccountKey.json`（放在项目根目录）

### 步骤 3: 更新 Firebase 配置

编辑 `src/firebase.js`：

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyxxxxxxx",        // ← 粘贴这里
  authDomain: "taoyuan-dd167.firebaseapp.com",
  projectId: "taoyuan-dd167",
  storageBucket: "taoyuan-dd167.appspot.com",
  messagingSenderId: "1079472383479",
  appId: "1:1079472383479:web:xxxxx"  // ← 粘贴这里
};
```

### 步骤 4: 启动前端

```bash
# 已经在运行
npm run dev
# 访问 http://localhost:5173
```

---

## 📧 可选：启用邮件通知

### A. Gmail 配置

1. 访问 https://myaccount.google.com
2. 左侧菜单 → **Security**
3. 启用 **2-Step Verification**
4. 然后访问 https://myaccount.google.com/apppasswords
5. 生成新的应用密码（复制 16 位密码）

### B. 创建 `.env` 文件

```bash
cp .env.example .env
```

编辑 `.env`：
```
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=xxxx xxxx xxxx xxxx
ADMIN_EMAIL=admin@company.com
```

---

## 🔧 选择你的后端

### 选项 A: 简单 - Firestore 监听服务（推荐新手）

```bash
# 1. 安装依赖
npm install firebase-admin nodemailer dotenv

# 2. 运行服务
node backend-firestore.js
```

**功能**:
- ✅ 실시간 监听预约
- ✅ 自动发送邮件
- ✅ 更新状态

### 选项 B: 完整 - Express API 服务器（推荐专业）

```bash
# 1. 安装依赖
npm install express cors firebase-admin nodemailer dotenv

# 2. 运行服务
node backend-express.js
```

**功能**:
- ✅ RESTful API
- ✅ 完整 CRUD
- ✅ 分页查询
- ✅ 统计报告

**测试 API**:
```bash
# 健康检查
curl http://localhost:3001/api/health

# 查看统计
curl http://localhost:3001/api/stats
```

---

## ✅ 验证一切工作正常

### 前端测试

1. 打开 http://localhost:5173
2. 填写表单
3. 点击 "確認預約"
4. 应该看到成功消息

### Firebase 验证

1. 访问 [Firebase Console](https://console.firebase.google.com/)
2. 选择 **taoyuan-dd167**
3. 点击 **Firestore Database**
4. 你应该看到 `property_viewings` 集合
5. 其中有你刚提交的数据

### 邮件验证

1. 检查你的邮箱（和 ADMIN_EMAIL）
2. 应该收到 2 封邮件：
   - ✅ 客户确认邮件（发给表单提交者）
   - ✅ 管理员通知邮件（发给 ADMIN_EMAIL）

---

## 📁 重要文件

| 文件 | 用途 |
|------|------|
| `src/firebase.js` | Firebase 初始化 |
| `src/PropertyViewingForm.jsx` | 前端表单 |
| `backend-firestore.js` | Firestore 监听服务 |
| `backend-express.js` | Express API 服务器 |
| `.env` | 环境变量（机密） |
| `serviceAccountKey.json` | Firebase Service Account |

---

## 🔐 安全检查

```bash
# ⚠️ 不要提交这些文件到 Git
echo "serviceAccountKey.json" >> .gitignore
echo ".env" >> .gitignore
```

---

## 📞 完整命令参考

```bash
# 启动前端 (已在运行)
npm run dev

# 安装后端依赖
npm install express cors firebase-admin nodemailer dotenv

# 启动 Express 后端
node backend-express.js

# 或启动 Firestore 监听
node backend-firestore.js

# 测试 API
curl http://localhost:3001/api/health
curl http://localhost:3001/api/stats
curl http://localhost:3001/api/viewings

# 查看日志
# 在 Firebase Console → Functions
```

---

## 🎯 接下来做什么

1. **添加数据库连接** ✅ 完成
2. **配置邮件通知** - 按照上面的步骤
3. **部署到云端** - 使用 Heroku/Vercel/AWS
4. **创建管理后台** - 查看和管理预约
5. **添加支付功能** - Stripe/PayPal（可选）

---

## 📚 详细文档

- [Firebase 配置指南](./FIREBASE_SETUP.md)
- [后端集成指南](./BACKEND_INTEGRATION.md)
- [依赖安装指南](./DEPENDENCIES.md)

---

## 🚨 常见问题

**Q: 表单提交后没有数据出现在 Firebase？**
```
A: 检查 Firestore Security Rules
   或查看浏览器控制台是否有错误
```

**Q: 邮件没有发送？**
```
A: 1. 检查 Gmail 应用密码是否正确
   2. 检查 .env 文件是否存在
   3. 后端服务是否在运行
   4. 查看后端控制台输出
```

**Q: API 返回 CORS 错误？**
```
A: 确保 backend-express.js 中已启用 CORS
   app.use(cors());
```

**Q: 如何停止开发服务器？**
```bash
Ctrl + C
```

---

🎉 **准备就绪！现在可以处理真实的预约了！**

需要帮助？查看详细文档或检查 Firebase Console 日志。
