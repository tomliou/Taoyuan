/**
 * Firebase Firestore Backend Service
 * 用于处理 Taoyuan Property Viewing 预约系统
 * 
 * 功能：
 * - 监听新预约
 * - 发送邮件通知
 * - 管理预约状态
 * - 生成报告
 */

const admin = require('firebase-admin');
const nodemailer = require('nodemailer');
require('dotenv').config();

// ========== Firebase 初始化 ==========
// 下载 serviceAccountKey.json 从 Firebase Console
// Project Settings → Service Accounts → Generate new private key
admin.initializeApp({
  credential: admin.credential.cert('./serviceAccountKey.json'),
  projectId: 'taoyuan-dd167'
});

const db = admin.firestore();

// ========== 邮件配置 ==========
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,      // 你的 Gmail
    pass: process.env.EMAIL_PASSWORD   // Gmail 应用密码
  }
});

// ========== 1. 监听新预约 ==========
/**
 * 实时监听新提交的预约并发送确认邮件
 */
function setupPropertyViewingListener() {
  console.log('🔍 启动预约监听...');
  
  db.collection('property_viewings')
    .where('status', '==', 'pending')
    .onSnapshot(snapshot => {
      snapshot.forEach(doc => {
        const viewingData = doc.data();
        const docId = doc.id;
        
        console.log('\n✅ 新预约提交:');
        console.log(viewingData);
        
        // 发送确认邮件给客户
        sendCustomerConfirmationEmail(viewingData, docId);
        
        // 发送通知邮件给管理员
        sendAdminNotificationEmail(viewingData, docId);
        
        // 更新状态为 'processed'
        updateViewingStatus(docId, 'processed');
      });
    }, error => {
      console.error('监听错误:', error);
    });
}

// ========== 2. 发送客户确认邮件 ==========
async function sendCustomerConfirmationEmail(viewingData, docId) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: viewingData.email,
    subject: '✅ 桃園高端房產 - 預約確認',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #0f1419;">預約確認</h2>
        
        <p>尊敬的 ${viewingData.name},</p>
        
        <p>感謝您的預約！我們已成功收到您的看房申請。</p>
        
        <div style="background-color: #f5f3f0; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #d4af37;">預約詳情</h3>
          <p><strong>日期：</strong> ${viewingData.viewingDate}</p>
          <p><strong>時間：</strong> ${viewingData.viewingTime}</p>
          <p><strong>房產類型：</strong> ${viewingData.propertyType}</p>
          <p><strong>預約 ID：</strong> ${docId}</p>
        </div>
        
        <p>我們將在 <strong>24 小時內</strong> 通過電話 <strong>${viewingData.phone}</strong> 與您聯繫，確認最終的看房安排。</p>
        
        <p>如有任何特殊需求，我們會優先考慮：</p>
        <p style="color: #6b6b6b; font-style: italic;">"${viewingData.specialRequests || '無'}"</p>
        
        <hr style="border: none; border-top: 1px solid #e0ddd8; margin: 20px 0;">
        
        <p style="color: #6b6b6b; font-size: 12px;">
          此郵件由自動系統發送，請勿直接回覆。<br>
          如有問題，請致電我們的客服熱線。
        </p>
      </div>
    `
  };
  
  try {
    await transporter.sendMail(mailOptions);
    console.log('✉️ 客户确认邮件已发送:', viewingData.email);
  } catch (error) {
    console.error('❌ 邮件发送失败:', error);
  }
}

// ========== 3. 发送管理员通知邮件 ==========
async function sendAdminNotificationEmail(viewingData, docId) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.ADMIN_EMAIL,
    subject: `🔔 新預約 - ${viewingData.name} (${viewingData.viewingDate})`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #0f1419;">🔔 新预约通知</h2>
        
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <tr>
            <td style="padding: 10px; background-color: #f5f3f0; font-weight: bold; width: 30%;">預約 ID</td>
            <td style="padding: 10px;">${docId}</td>
          </tr>
          <tr>
            <td style="padding: 10px; background-color: #f5f3f0; font-weight: bold;">姓名</td>
            <td style="padding: 10px;">${viewingData.name}</td>
          </tr>
          <tr>
            <td style="padding: 10px; background-color: #f5f3f0; font-weight: bold;">電話</td>
            <td style="padding: 10px;">${viewingData.phone}</td>
          </tr>
          <tr>
            <td style="padding: 10px; background-color: #f5f3f0; font-weight: bold;">郵箱</td>
            <td style="padding: 10px;">${viewingData.email}</td>
          </tr>
          <tr>
            <td style="padding: 10px; background-color: #f5f3f0; font-weight: bold;">日期</td>
            <td style="padding: 10px;">${viewingData.viewingDate}</td>
          </tr>
          <tr>
            <td style="padding: 10px; background-color: #f5f3f0; font-weight: bold;">時間</td>
            <td style="padding: 10px;">${viewingData.viewingTime}</td>
          </tr>
          <tr>
            <td style="padding: 10px; background-color: #f5f3f0; font-weight: bold;">房產類型</td>
            <td style="padding: 10px;">${viewingData.propertyType}</td>
          </tr>
          <tr>
            <td style="padding: 10px; background-color: #f5f3f0; font-weight: bold;">客戶年齡</td>
            <td style="padding: 10px;">${viewingData.age}</td>
          </tr>
          <tr>
            <td style="padding: 10px; background-color: #f5f3f0; font-weight: bold;">特殊需求</td>
            <td style="padding: 10px;">${viewingData.specialRequests || '無'}</td>
          </tr>
        </table>
        
        <p><a href="https://console.firebase.google.com/project/taoyuan-dd167/firestore" 
              style="background-color: #0f1419; color: white; padding: 10px 20px; text-decoration: none; border-radius: 6px; display: inline-block;">
          查看完整記錄
        </a></p>
      </div>
    `
  };
  
  try {
    await transporter.sendMail(mailOptions);
    console.log('✉️ 管理员通知邮件已发送');
  } catch (error) {
    console.error('❌ 邮件发送失败:', error);
  }
}

// ========== 4. 更新预约状态 ==========
async function updateViewingStatus(docId, status) {
  try {
    await db.collection('property_viewings').doc(docId).update({
      status: status,
      processedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    console.log(`📝 预约状态已更新为: ${status}`);
  } catch (error) {
    console.error('❌ 更新失败:', error);
  }
}

// ========== 5. 获取统计数据 ==========
async function getViewingStatistics() {
  try {
    const snapshot = await db.collection('property_viewings').get();
    const total = snapshot.size;
    
    let pending = 0, processed = 0, confirmed = 0;
    let propertyTypes = {};
    let ageDistribution = {};
    
    snapshot.forEach(doc => {
      const data = doc.data();
      if (data.status === 'pending') pending++;
      if (data.status === 'processed') processed++;
      if (data.status === 'confirmed') confirmed++;
      
      propertyTypes[data.propertyType] = (propertyTypes[data.propertyType] || 0) + 1;
      ageDistribution[data.age] = (ageDistribution[data.age] || 0) + 1;
    });
    
    return {
      total,
      pending,
      processed,
      confirmed,
      propertyTypes,
      ageDistribution
    };
  } catch (error) {
    console.error('❌ 获取统计数据失败:', error);
  }
}

// ========== 6. 导出报告 ==========
async function exportViewingsReport() {
  try {
    const snapshot = await db.collection('property_viewings').get();
    const viewings = [];
    
    snapshot.forEach(doc => {
      viewings.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return viewings;
  } catch (error) {
    console.error('❌ 导出报告失败:', error);
  }
}

// ========== 启动服务 ==========
async function start() {
  console.log('🚀 启动 Taoyuan Property Viewing Backend Service...\n');
  
  // 设置监听器
  setupPropertyViewingListener();
  
  // 每分钟显示统计信息
  setInterval(async () => {
    const stats = await getViewingStatistics();
    console.log('\n📊 当前统计:');
    console.log(`   总预约: ${stats.total}`);
    console.log(`   待处理: ${stats.pending}`);
    console.log(`   已处理: ${stats.processed}`);
    console.log(`   已确认: ${stats.confirmed}`);
  }, 60000);
}

// ========== 导出函数供 API 使用 ==========
module.exports = {
  setupPropertyViewingListener,
  sendCustomerConfirmationEmail,
  sendAdminNotificationEmail,
  updateViewingStatus,
  getViewingStatistics,
  exportViewingsReport,
  start
};

// 如果直接运行此文件
if (require.main === module) {
  start();
}
