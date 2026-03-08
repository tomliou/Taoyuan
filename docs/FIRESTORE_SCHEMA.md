# Firestore 資料庫結構（依專案產生）

專案為**桃園高端房產 - 預約看屋**表單，資料庫依表單欄位自動對應如下。

## 集合：`viewingBookings`

每筆預約為一則文件，由 Firestore 自動產生文件 ID。

| 欄位 | 類型 | 說明 |
|------|------|------|
| `name` | string | 姓名 |
| `phone` | string | 電話（台灣手機） |
| `email` | string | 電郵 |
| `gender` | string | 性別：`male` / `female` / `other` |
| `age` | string | 年齡段：`25-35` / `35-45` / `45-55` / `55以上` |
| `viewingDate` | string | 看房日期，格式 `YYYY-MM-DD` |
| `viewingTime` | string | 時段，如 `09:00`、`10:00` … |
| `propertyType` | string | 房產類型：公寓 / 透天別墅 / 套房 / 預售屋 / 不確定 |
| `specialRequests` | string | 特殊需求或備註（選填） |
| `createdAt` | Timestamp | 建立時間（伺服器時間） |

## 如何產生資料

1. **從表單寫入**：使用者在前端送出「預約私人看屋」表單後，會自動在 `viewingBookings` 建立一筆文件。
2. **Firebase 控制台**：在 Firestore「資料」頁籤可手動點「+ 啟動集合」，集合 ID 填 `viewingBookings`，再新增文件與上述欄位（僅手動測試用，正式請用表單）。

## 安全規則

已提供 `firestore.rules`：僅允許**新增**預約，不開放讀取/更新/刪除，避免前端列出或改動他人預約。後台需用 Firebase Admin 或登入後台身份讀取。

## 環境變數

複製 `.env.example` 為 `.env`，填入 Firebase 專案設定中的 API Key、projectId 等，專案才能連到 Firestore 並寫入。
