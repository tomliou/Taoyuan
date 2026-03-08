import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';

function checkConfig() {
  if (!db) {
    throw new Error('請先設定 Firebase：複製 .env.example 為 .env 並填入 Taoyuan 專案的設定。');
  }
}

/**
 * Firestore 結構（依專案表單產生）：
 *
 * Collection: viewingBookings
 * Document 欄位：
 *   - name: string
 *   - phone: string
 *   - email: string
 *   - gender: string (male|female|other)
 *   - age: string (25-35|35-45|45-55|55以上)
 *   - viewingDate: string (YYYY-MM-DD)
 *   - viewingTime: string (09:00|10:00|...)
 *   - propertyType: string (公寓|透天別墅|套房|預售屋|不確定)
 *   - specialRequests: string (選填)
 *   - createdAt: Timestamp (伺服器時間)
 */
const COLLECTION = 'viewingBookings';

export async function createBooking(data) {
  checkConfig();
  const docRef = await addDoc(collection(db, COLLECTION), {
    name: data.name.trim(),
    phone: data.phone.trim(),
    email: data.email.trim(),
    gender: data.gender,
    age: data.age,
    viewingDate: data.viewingDate,
    viewingTime: data.viewingTime,
    propertyType: data.propertyType,
    specialRequests: (data.specialRequests || '').trim(),
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}
