import React, { useState } from 'react';
import './PropertyViewingForm.css';
import { createBooking } from './services/bookings';

const PropertyViewingForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    gender: '',
    age: '',
    viewingDate: '',
    viewingTime: '',
    propertyType: '',
    specialRequests: '',
  });

  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const propertyTypes = [
    '公寓',
    '透天別墅',
    '套房',
    '預售屋',
    '不確定'
  ];

  const ageRanges = [
    '25-35',
    '35-45',
    '45-55',
    '55以上'
  ];

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = '請輸入姓名';
    if (!formData.phone.trim()) newErrors.phone = '請輸入電話';
    if (!/^09\d{8}$/.test(formData.phone)) newErrors.phone = '請輸入有效的台灣電話號碼';
    if (!formData.email.trim()) newErrors.email = '請輸入電郵';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = '請輸入有效的電郵';
    if (!formData.gender) newErrors.gender = '請選擇性別';
    if (!formData.age) newErrors.age = '請選擇年齡段';
    if (!formData.viewingDate) newErrors.viewingDate = '請選擇看房日期';
    if (!formData.viewingTime) newErrors.viewingTime = '請選擇看房時間';
    if (!formData.propertyType) newErrors.propertyType = '請選擇房產類型偏好';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      await createBooking(formData);
      setSubmitted(true);
      setTimeout(() => {
        setFormData({
          name: '',
          phone: '',
          email: '',
          gender: '',
          age: '',
          viewingDate: '',
          viewingTime: '',
          propertyType: '',
          specialRequests: '',
        });
        setSubmitted(false);
      }, 3000);
    } catch (err) {
      console.error('預約寫入失敗:', err);
      setSubmitError(err.message || '無法送出預約，請稍後再試或聯絡我們。');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="form-container">
        <div className="success-message">
          <div className="success-icon">✓</div>
          <h2>預約成功</h2>
          <p>感謝您的預約，我們將在24小時內與您聯繫。</p>
          <div className="success-details">
            <p><strong>姓名：</strong>{formData.name}</p>
            <p><strong>日期：</strong>{formData.viewingDate} {formData.viewingTime}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="form-container">
      <div className="form-wrapper">
        {/* Header */}
        <div className="form-header">
          <h1>桃園高端房產</h1>
          <p>預約私人看屋服務</p>
          <div className="header-accent"></div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="elegant-form">
          
          {/* Basic Information Section */}
          <div className="form-section">
            <h3 className="section-title">基本資訊</h3>
            
            <div className="form-group">
              <label htmlFor="name">姓名 *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="請輸入您的姓名"
                className={errors.name ? 'error' : ''}
              />
              {errors.name && <span className="error-message">{errors.name}</span>}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="phone">電話 *</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="09xxxxxxxx"
                  className={errors.phone ? 'error' : ''}
                />
                {errors.phone && <span className="error-message">{errors.phone}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="email">電郵 *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className={errors.email ? 'error' : ''}
                />
                {errors.email && <span className="error-message">{errors.email}</span>}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="gender">性別 *</label>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className={errors.gender ? 'error' : ''}
                >
                  <option value="">請選擇</option>
                  <option value="male">男</option>
                  <option value="female">女</option>
                  <option value="other">其他</option>
                </select>
                {errors.gender && <span className="error-message">{errors.gender}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="age">年齡段 *</label>
                <select
                  id="age"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  className={errors.age ? 'error' : ''}
                >
                  <option value="">請選擇</option>
                  {ageRanges.map(range => (
                    <option key={range} value={range}>{range}</option>
                  ))}
                </select>
                {errors.age && <span className="error-message">{errors.age}</span>}
              </div>
            </div>
          </div>

          {/* Viewing Details Section */}
          <div className="form-section">
            <h3 className="section-title">看房詳情</h3>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="viewingDate">看房日期 *</label>
                <input
                  type="date"
                  id="viewingDate"
                  name="viewingDate"
                  value={formData.viewingDate}
                  onChange={handleChange}
                  className={errors.viewingDate ? 'error' : ''}
                />
                {errors.viewingDate && <span className="error-message">{errors.viewingDate}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="viewingTime">看房時間 *</label>
                <select
                  id="viewingTime"
                  name="viewingTime"
                  value={formData.viewingTime}
                  onChange={handleChange}
                  className={errors.viewingTime ? 'error' : ''}
                >
                  <option value="">請選擇</option>
                  <option value="09:00">09:00 - 10:00</option>
                  <option value="10:00">10:00 - 11:00</option>
                  <option value="11:00">11:00 - 12:00</option>
                  <option value="13:00">13:00 - 14:00</option>
                  <option value="14:00">14:00 - 15:00</option>
                  <option value="15:00">15:00 - 16:00</option>
                  <option value="16:00">16:00 - 17:00</option>
                </select>
                {errors.viewingTime && <span className="error-message">{errors.viewingTime}</span>}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="propertyType">房產類型偏好 *</label>
              <select
                id="propertyType"
                name="propertyType"
                value={formData.propertyType}
                onChange={handleChange}
                className={errors.propertyType ? 'error' : ''}
              >
                <option value="">請選擇</option>
                {propertyTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
              {errors.propertyType && <span className="error-message">{errors.propertyType}</span>}
            </div>
          </div>

          {/* Special Requests Section */}
          <div className="form-section">
            <h3 className="section-title">其他需求</h3>
            
            <div className="form-group">
              <label htmlFor="specialRequests">特殊需求或備註</label>
              <textarea
                id="specialRequests"
                name="specialRequests"
                value={formData.specialRequests}
                onChange={handleChange}
                placeholder="如：有特定樓層偏好、想了解特定設施等..."
                rows="4"
              ></textarea>
            </div>
          </div>

          {submitError && (
            <div className="form-section" style={{ color: '#c62828' }}>
              {submitError}
            </div>
          )}

          {/* Submit Button */}
          <div className="form-actions">
            <button
              type="submit"
              className="submit-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? '處理中...' : '確認預約'}
            </button>
            <p className="form-note">* 為必填項目</p>
          </div>
        </form>

        {/* Footer */}
        <div className="form-footer">
          <p>我們重視您的隱私。您的資訊將被安全保管且不會與第三方共享。</p>
        </div>
      </div>
    </div>
  );
};

export default PropertyViewingForm;
