# Firebase 集成指南

## 项目信息
- **Project ID**: taoyuan-dd167
- **Project Number**: 1079472383479
- **Database**: Firestore

---

## 📋 步骤 1：获取 Firebase 配置信息

1. 访问 [Firebase Console](https://console.firebase.google.com/)
2. 选择你的项目：**taoyuan-dd167**
3. 点击左侧菜单 **⚙️ Project Settings（项目设置）**
4. 滚动到 **Your apps** 部分
5. 点击 **Web (< / >)** 注册一个 Web 应用

### 你需要的信息：
```javascript
// 在弹出窗口中，你会看到这样的配置：
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",           // 复制这个
  authDomain: "taoyuan-dd167.firebaseapp.com",
  projectId: "taoyuan-dd167",
  storageBucket: "taoyuan-dd167.appspot.com",
  messagingSenderId: "1079472383479",
  appId: "YOUR_APP_ID"              // 复制这个
};
```

---

## 🔧 步骤 2：更新 Firebase 配置

编辑文件 `src/firebase.js`，用你获取的 `apiKey` 和 `appId` 替换：

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyCabc123xyz...",     // ← 从 Firebase Console 复制
  authDomain: "taoyuan-dd167.firebaseapp.com",
  projectId: "taoyuan-dd167",
  storageBucket: "taoyuan-dd167.appspot.com",
  messagingSenderId: "1079472383479",
  appId: "1:1079472383479:web:abc123xyz..."  // ← 从 Firebase Console 复制
};
```

---

## 🔐 步骤 3：配置 Firestore Security Rules

1. 在 Firebase Console 中，打开 **Firestore Database**
2. 点击 **Rules** 选项卡
3. 用以下规则替换现有规则（允许任何人提交表单，但不能读取）：

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // 允许任何人创建预约
    match /property_viewings/{document=**} {
      allow create: if request.auth == null;
      allow read: if request.auth != null;
      allow update, delete: if false;
    }
  }
}
```

4. 点击 **Publish** 发布规则

---

## 📝 步骤 4：验证安装

启动开发服务器：
```bash
npm run dev
```

访问 http://localhost:5173/ 并尝试提交表单。

在 Firebase Console 的 **Firestore Database** 中，你应该会看到新的集合 `property_viewings`，其中包含提交的数据。

---

## 🗂️ Firestore 数据结构

表单提交的数据存储在 Firestore 中的结构如下：

```
集合: property_viewings
├── {文档 ID}
│   ├── name: "张三"
│   ├── phone: "0912345678"
│   ├── email: "zhang@example.com"
│   ├── gender: "male"
│   ├── age: "35-45"
│   ├── viewingDate: "2026-03-15"
│   ├── viewingTime: "14:00"
│   ├── propertyType: "公寓"
│   ├── specialRequests: "希望看19楼的房型"
│   ├── submittedAt: 2026-03-07T15:30:00Z
│   └── status: "pending"
```

---

## 🚀 后端 API 端点（可选）

如果你想用 Express.js 或 Node.js 创建后端来处理这些数据，可以使用 Firebase Admin SDK：

### 安装 Firebase Admin SDK：
```bash
npm install firebase-admin
```

### Node.js 后端示例：
```javascript
const admin = require('firebase-admin');

admin.initializeApp({
  credential: admin.credential.cert('path/to/serviceAccountKey.json'),
  databaseURL: 'https://taoyuan-dd167.firebaseio.com'
});

const db = admin.firestore();

// 订阅新的预约
db.collection('property_viewings')
  .where('status', '==', 'pending')
  .onSnapshot(snapshot => {
    snapshot.forEach(doc => {
      console.log('新预约:', doc.data());
      // 这里可以发送邮件、短信通知等
    });
  });
```

---

## 📧 集成后续步骤

1. **邮件通知**：当新预约提交时，发送确认邮件给客户
2. **SMS 通知**：用 Twilio 发送短信通知
3. **后台管理面板**：创建仪表盘查看所有预约
4. **自动回复**：设置自动回复邮件

需要帮助吗？

---

## ⚠️ 重要安全提示

- 不要在客户端代码中暴露 `serviceAccountKey.json`
- 使用 Firebase Security Rules 保护你的数据
- 定期查看 Firebase 使用情况，防止超支
