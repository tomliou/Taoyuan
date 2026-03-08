/**
 * Express.js Backend API for Taoyuan Property Viewing System
 * 
 * API 端点:
 * POST /api/viewings - 创建新预约
 * GET /api/viewings - 获取所有预约
 * GET /api/viewings/:id - 获取单个预约
 * PATCH /api/viewings/:id - 更新预约状态
 * GET /api/stats - 获取统计信息
 */

const express = require('express');
const admin = require('firebase-admin');
const cors = require('cors');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();

// ========== 中间件 ==========
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// ========== Firebase 初始化 ==========
admin.initializeApp({
  credential: admin.credential.cert('./serviceAccountKey.json'),
  projectId: 'taoyuan-dd167'
});

const db = admin.firestore();

// ========== 邮件配置 ==========
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

// ========== API 端点 ==========

/**
 * POST /api/viewings
 * 创建新预约（从前端表单调用）
 */
app.post('/api/viewings', async (req, res) => {
  try {
    const viewingData = req.body;
    
    // 验证必填字段
    if (!viewingData.name || !viewingData.phone || !viewingData.email) {
      return res.status(400).json({ error: '缺少必填字段' });
    }
    
    // 添加到 Firestore
    const docRef = await db.collection('property_viewings').add({
      ...viewingData,
      submittedAt: admin.firestore.FieldValue.serverTimestamp(),
      status: 'pending'
    });
    
    // 发送确认邮件
    await sendConfirmationEmail(viewingData);
    
    res.json({
      success: true,
      message: '预约已提交',
      id: docRef.id
    });
  } catch (error) {
    console.error('错误:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/viewings
 * 获取所有预约（带分页）
 */
app.get('/api/viewings', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const status = req.query.status; // 可选：按状态筛选
    
    let query = db.collection('property_viewings');
    
    // 按状态筛选
    if (status) {
      query = query.where('status', '==', status);
    }
    
    // 按提交时间排序
    query = query.orderBy('submittedAt', 'desc');
    
    // 获取总数
    const totalSnapshot = await query.get();
    const total = totalSnapshot.size;
    
    // 分页查询
    const snapshot = await query
      .limit(limit)
      .offset((page - 1) * limit)
      .get();
    
    const viewings = [];
    snapshot.forEach(doc => {
      viewings.push({
        id: doc.id,
        ...doc.data(),
        submittedAt: doc.data().submittedAt?.toDate?.() || new Date()
      });
    });
    
    res.json({
      success: true,
      data: viewings,
      pagination: {
        current: page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('错误:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/viewings/:id
 * 获取单个预约详情
 */
app.get('/api/viewings/:id', async (req, res) => {
  try {
    const doc = await db.collection('property_viewings').doc(req.params.id).get();
    
    if (!doc.exists) {
      return res.status(404).json({ error: '预约不存在' });
    }
    
    res.json({
      success: true,
      data: {
        id: doc.id,
        ...doc.data(),
        submittedAt: doc.data().submittedAt?.toDate?.() || new Date()
      }
    });
  } catch (error) {
    console.error('错误:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * PATCH /api/viewings/:id
 * 更新预约状态
 */
app.patch('/api/viewings/:id', async (req, res) => {
  try {
    const { status, notes } = req.body;
    
    // 验证状态值
    const validStatuses = ['pending', 'processed', 'confirmed', 'completed', 'cancelled'];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({ error: '无效的状态值' });
    }
    
    const updateData = {
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    };
    
    if (status) updateData.status = status;
    if (notes) updateData.notes = notes;
    
    await db.collection('property_viewings').doc(req.params.id).update(updateData);
    
    res.json({
      success: true,
      message: '预约已更新'
    });
  } catch (error) {
    console.error('错误:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/stats
 * 获取统计信息
 */
app.get('/api/stats', async (req, res) => {
  try {
    const snapshot = await db.collection('property_viewings').get();
    
    let stats = {
      total: snapshot.size,
      byStatus: {},
      byPropertyType: {},
      byAge: {}
    };
    
    snapshot.forEach(doc => {
      const data = doc.data();
      
      // 按状态统计
      stats.byStatus[data.status] = (stats.byStatus[data.status] || 0) + 1;
      
      // 按房产类型统计
      stats.byPropertyType[data.propertyType] = (stats.byPropertyType[data.propertyType] || 0) + 1;
      
      // 按年龄段统计
      stats.byAge[data.age] = (stats.byAge[data.age] || 0) + 1;
    });
    
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('错误:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * DELETE /api/viewings/:id
 * 删除预约（仅管理员）
 */
app.delete('/api/viewings/:id', async (req, res) => {
  try {
    // 这里应该添加身份验证检查
    await db.collection('property_viewings').doc(req.params.id).delete();
    
    res.json({
      success: true,
      message: '预约已删除'
    });
  } catch (error) {
    console.error('错误:', error);
    res.status(500).json({ error: error.message });
  }
});

// ========== 辅助函数 ==========

/**
 * 发送确认邮件给客户
 */
async function sendConfirmationEmail(viewingData) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: viewingData.email,
    subject: '✅ 桃園高端房產 - 預約確認',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #0f1419;">預約確認</h2>
        <p>尊敬的 ${viewingData.name},</p>
        <p>感謝您的預約！</p>
        <div style="background-color: #f5f3f0; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>日期：</strong> ${viewingData.viewingDate}</p>
          <p><strong>時間：</strong> ${viewingData.viewingTime}</p>
          <p><strong>房產類型：</strong> ${viewingData.propertyType}</p>
        </div>
        <p>我們將在 24 小時內與您聯繫。</p>
      </div>
    `
  };
  
  return transporter.sendMail(mailOptions);
}

// ========== 错误处理 ==========
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: '服务器错误' });
});

// ========== 健康检查 ==========
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ========== 启动服务器 ==========
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 API 服务器运行在 http://localhost:${PORT}`);
  console.log(`📝 API 文档:`);
  console.log(`   POST   /api/viewings - 创建预约`);
  console.log(`   GET    /api/viewings - 获取所有预约`);
  console.log(`   GET    /api/viewings/:id - 获取单个预约`);
  console.log(`   PATCH  /api/viewings/:id - 更新预约`);
  console.log(`   GET    /api/stats - 获取统计信息`);
});

module.exports = app;
