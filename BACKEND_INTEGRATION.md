# 🚀 Taoyuan Property Viewing System - 完整后端集成指南

## 📁 项目结构

```
Taoyuan/
├── src/
│   ├── PropertyViewingForm.jsx          ← 前端表单组件
│   ├── PropertyViewingForm.css          ← 表单样式
│   ├── firebase.js                     ← Firebase 初始化
│   └── App.jsx
├── backend-firestore.js                ← Firestore 监听服务
├── backend-express.js                  ← Express API 服务器
├── FIREBASE_SETUP.md                   ← Firebase 配置指南
├── .env.example                        ← 环境变量模板
└── package.json
```

---

## 🔄 系统架构

```
┌─────────────────┐
│  前端 (React)   │ ← PropertyViewingForm.jsx
│  + Vite + CSS   │
└────────┬────────┘
         │ 提交表单数据
         ▼
┌─────────────────────────┐
│ Firebase Firestore      │ ← 数据存储
│ (property_viewings)     │
└────────┬────────────────┘
         │ 实时监听
         ▼
┌────────────────────────────────┐
│ 后端服务 (3 个选项)            │
├────────────────────────────────┤
│ 1. Firestore Listener          │
│    (backend-firestore.js)      │
│ 2. Express API Server          │
│    (backend-express.js)        │
│ 3. Firebase Cloud Functions    │
│    (可选 - 无服务器)           │
└────────────────────────────────┘
         │
         ▼
┌─────────────────────┐
│  邮件通知           │
│  (Nodemailer)       │
│  管理员 + 客户      │
└─────────────────────┘
```

---

## 🔧 后端选项

### 选项 1: Firestore 实时监听服务（推荐简单项目）

**文件**: `backend-firestore.js`

**功能**:
- ✅ 实时监听新预约
- ✅ 自动发送邮件通知
- ✅ 更新预约状态
- ✅ 生成统计报告

**安装依赖**:
```bash
npm install firebase-admin nodemailer dotenv
```

**环境变量** (`.env`):
```
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
ADMIN_EMAIL=admin@example.com
```

**启动服务**:
```bash
node backend-firestore.js
```

**优点**:
- 部署简单
- 成本低
- 适合小规模项目

**缺点**:
- 需要持续运行的服务器
- 不适合大规模

---

### 选项 2: Express.js API 服务器（推荐中大型项目）

**文件**: `backend-express.js`

**功能**:
- ✅ RESTful API
- ✅ 完整 CRUD 操作
- ✅ 分页查询
- ✅ 统计信息
- ✅ 邮件通知

**API 端点**:

```bash
# 创建预约
POST /api/viewings
{
  "name": "张三",
  "phone": "0912345678",
  "email": "zhang@example.com",
  ...
}

# 获取所有预约 (分页)
GET /api/viewings?page=1&limit=10&status=pending

# 获取单个预约
GET /api/viewings/{id}

# 更新预约状态
PATCH /api/viewings/{id}
{
  "status": "confirmed",
  "notes": "已确认看房时间"
}

# 获取统计信息
GET /api/stats

# 删除预约
DELETE /api/viewings/{id}

# 健康检查
GET /api/health
```

**安装依赖**:
```bash
npm install express cors firebase-admin nodemailer dotenv
```

**启动服务**:
```bash
node backend-express.js
```

**数据库状态值**:
- `pending` - 等待处理
- `processed` - 已处理
- `confirmed` - 已确认
- `completed` - 已完成
- `cancelled` - 已取消

---

### 选项 3: Firebase Cloud Functions（无服务器）

**优点**:
- 无需自己管理服务器
- 自动扩展
- 按使用量付费

**示例函数** (Firebase Console 创建):

```javascript
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');

admin.initializeApp();
const db = admin.firestore();

// 监听新预约
exports.onNewViewing = functions.firestore
  .document('property_viewings/{docId}')
  .onCreate(async (snap, context) => {
    const data = snap.data();
    
    // 发送邮件
    // ... 邮件逻辑
    
    return null;
  });
```

---

## 📧 邮件配置指南

### 使用 Gmail 的步骤

1. **开启 2 次验证**
   - 访问 https://myaccount.google.com
   - Security → 2-Step Verification

2. **生成应用密码**
   - 访问 https://myaccount.google.com/apppasswords
   - 选择 Mail 和 Windows Computer
   - 复制生成的 16 位密码

3. **配置环境变量**
   ```
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASSWORD=xxxx xxxx xxxx xxxx
   ```

### 邮件模板

系统会自动发送：

#### 客户确认邮件
- 预约详情
- 预约 ID
- 联系方式

#### 管理员通知邮件
- 客户信息
- 预约时间
- 特殊需求
- Firebase 控制台链接

---

## 🔐 安全配置

### Firestore Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // 允许任何人创建预约
    match /property_viewings/{document=**} {
      allow create: if request.auth == null 
        && has(['name', 'phone', 'email']);
      
      // 仅管理员可读
      allow read: if request.auth != null 
        && request.auth.token.admin == true;
      
      // 禁止更新和删除（通过 API 处理）
      allow update, delete: if false;
    }
  }
}
```

---

## 📊 数据库结构

### Firestore 集合: `property_viewings`

```
{
  id: "auto-generated",
  name: "张三",
  phone: "0912345678",
  email: "zhang@example.com",
  gender: "male/female/other",
  age: "25-35/35-45/45-55/55+",
  viewingDate: "2026-03-15",
  viewingTime: "14:00",
  propertyType: "公寓/透天別墅/套房/預售屋",
  specialRequests: "文字备注",
  submittedAt: Timestamp(2026-03-07),
  status: "pending/processed/confirmed/completed/cancelled",
  processedAt: Timestamp (可选),
  notes: "管理员备注" (可选)
}
```

---

## 🚀 部署选项

### 部署 Express 后端

#### 选项 A: Heroku
```bash
# 1. 安装 Heroku CLI
brew tap heroku/brew && brew install heroku

# 2. 登录
heroku login

# 3. 创建应用
heroku create taoyuan-backend

# 4. 设置环境变量
heroku config:set EMAIL_USER=xxx
heroku config:set EMAIL_PASSWORD=xxx

# 5. 部署
git push heroku main
```

#### 选项 B: Google Cloud Run
```bash
gcloud run deploy taoyuan-backend \
  --source . \
  --platform managed \
  --region asia-east1
```

#### 选项 C: AWS Lambda + API Gateway
使用 AWS Serverless Application Model (SAM)

---

## 📈 监控和日志

### 查看 Firebase 日志
```bash
firebase functions:log --follow
```

### Express 中的日志
```javascript
console.log('预约:', viewingData);
console.error('错误:', error);
```

---

## ✅ 测试清单

- [ ] Firebase 配置正确
- [ ] 前端表单能提交
- [ ] 数据出现在 Firestore
- [ ] 邮件能正常发送
- [ ] 后端服务正在运行
- [ ] API 端点响应正常
- [ ] 统计数据准确

---

## 🆘 常见问题

**Q: 表单提交后没有数据？**
A: 检查 Firestore Security Rules 是否允许创建

**Q: 邮件没有发送？**
A: 确认 Gmail 应用密码配置正确

**Q: CORS 错误？**
A: 确保后端启用了 CORS 中间件

---

## 📞 支持

需要帮助？
- 检查 Firebase Console 日志
- 查看 Express 服务器控制台输出
- 确认环境变量设置无误
