import React, { useState, useEffect } from 'react';
import { X, LogOut, Star, Coins, Settings, User, Calendar, MapPin, Phone, Heart, Camera, Check, Edit3, Save, Sparkles } from 'lucide-react';
import { sounds } from '../utils/sound';
import { supabaseService } from '../services/supabase';

// Preset avatar options suitable for kids & parents
const PRESET_AVATARS = [
  { id: 'boy', name: 'Bé Trai', url: 'https://api.dicebear.com/7.x/bottts/svg?seed=Felix&backgroundColor=b6e3f4' },
  { id: 'girl', name: 'Bé Gái', url: 'https://api.dicebear.com/7.x/bottts/svg?seed=Daisy&backgroundColor=ffd5dc' },
  { id: 'astro', name: 'Phi Hành Gia', url: 'https://api.dicebear.com/7.x/bottts/svg?seed=Cosmo&backgroundColor=c0aede' },
  { id: 'cat', name: 'Miu Miu', url: 'https://api.dicebear.com/7.x/bottts/svg?seed=Mimi&backgroundColor=ffdfbf' },
  { id: 'bear', name: 'Gấu Nâu', url: 'https://api.dicebear.com/7.x/bottts/svg?seed=Teddy&backgroundColor=d1d4f9' },
  { id: 'robot', name: 'Robot Tí Hon', url: 'https://api.dicebear.com/7.x/bottts/svg?seed=Sparky&backgroundColor=b6e3f4' }
];

export default function UserProfileModal({ 
  isOpen, 
  onClose, 
  user, 
  stars, 
  coins, 
  level, 
  pet, 
  isAdmin,
  onOpenAdmin,
  onLogout,
  onUpdateUser
}) {
  if (!isOpen || !user) return null;

  const metadata = user.user_metadata || {};
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Form states
  const [fullName, setFullName] = useState(metadata.full_name || '');
  const [avatarUrl, setAvatarUrl] = useState(
    metadata.avatar_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(user.email || 'user')}`
  );
  const [birthDate, setBirthDate] = useState(metadata.birth_date || '');
  const [address, setAddress] = useState(metadata.address || '');
  const [phone, setPhone] = useState(metadata.phone || '');
  const [hobby, setHobby] = useState(metadata.hobby || '');
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);

  // Lock body scroll when modal is open to prevent dual scrolling
  useEffect(() => {
    if (isOpen) {
      const prevOverflow = document.body.style.overflow;
      const prevTouchAction = document.body.style.touchAction;
      document.body.style.overflow = 'hidden';
      document.body.style.touchAction = 'none';
      return () => {
        document.body.style.overflow = prevOverflow;
        document.body.style.touchAction = prevTouchAction;
      };
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      setFullName(metadata.full_name || '');
      setAvatarUrl(metadata.avatar_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(user.email || 'user')}`);
      setBirthDate(metadata.birth_date || '');
      setAddress(metadata.address || '');
      setPhone(metadata.phone || '');
      setHobby(metadata.hobby || '');
      setIsEditing(false);
      setShowAvatarPicker(false);
      setSaveSuccess('');
      setErrorMessage('');
    }
  }, [isOpen, user]);

  // Calculate age if birthDate is set
  const calculateAge = (bDate) => {
    if (!bDate) return null;
    const diff = Date.now() - new Date(bDate).getTime();
    const ageDate = new Date(diff);
    const calculated = Math.abs(ageDate.getUTCFullYear() - 1970);
    return isNaN(calculated) || calculated <= 0 ? null : calculated;
  };

  const currentAge = calculateAge(birthDate);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    sounds.playClick();
    setIsSaving(true);
    setErrorMessage('');
    setSaveSuccess('');

    try {
      const payload = {
        full_name: fullName.trim() || 'Bé Thám Hiểm',
        avatar_url: avatarUrl,
        birth_date: birthDate,
        address: address.trim(),
        phone: phone.trim(),
        hobby: hobby.trim()
      };

      const result = await supabaseService.updateUserProfile(payload);
      if (result?.user) {
        sounds.playSuccess();
        setSaveSuccess('🎉 Đã cập nhật hồ sơ thành công!');
        if (onUpdateUser) {
          onUpdateUser(result.user);
        }
        setTimeout(() => {
          setIsEditing(false);
          setSaveSuccess('');
        }, 1000);
      }
    } catch (err) {
      sounds.playError();
      setErrorMessage('Không thể cập nhật hồ sơ. Vui lòng thử lại!');
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogoutClick = () => {
    sounds.playClick();
    if (window.confirm('Bé và ba mẹ có chắc muốn đăng xuất không? Dữ liệu đã được lưu an toàn trên đám mây!')) {
      onLogout();
      onClose();
    }
  };

  return (
    <div 
      className="modal-overlay"
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '16px',
        overscrollBehavior: 'contain'
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget && !isEditing) {
          onClose();
        }
      }}
    >
      <div 
        className="kid-card animate-pop-in modal-sheet"
        style={{
          background: '#ffffff',
          borderRadius: 'clamp(20px, 4vw, 28px)',
          width: '100%',
          maxWidth: '480px',
          padding: 'clamp(14px, 3.5vw, 22px)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          position: 'relative',
          maxHeight: 'calc(100dvh - 32px)',
          overflowY: 'auto',
          overscrollBehavior: 'contain',
          boxSizing: 'border-box'
        }}
      >
        {/* Top Accent */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '6px',
          background: 'linear-gradient(90deg, #10b981, #06b6d4, #6366f1, #ec4899)'
        }} />

        {/* Close Button */}
        <button
          onClick={() => {
            sounds.playClick();
            onClose();
          }}
          style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            background: '#f1f5f9',
            border: 'none',
            borderRadius: '50%',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: '#64748b'
          }}
          title="Đóng"
        >
          <X size={17} />
        </button>

        {/* Header Title */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', paddingRight: '36px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '22px' }}>🌟</span>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(16px, 4vw, 19px)', fontWeight: 800, color: '#1e293b', margin: 0 }}>
              {isEditing ? 'Cập Nhật Thông Tin' : 'Hồ Sơ Của Bé & Ba Mẹ'}
            </h3>
          </div>
          {!isEditing && (
            <button
              onClick={() => { sounds.playClick(); setIsEditing(true); }}
              className="btn-kid btn-blue"
              style={{ padding: '5px 10px', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px' }}
            >
              <Edit3 size={13} />
              <span>Chỉnh sửa</span>
            </button>
          )}
        </div>

        {/* Avatar Section */}
        <div style={{ textAlign: 'center', marginBottom: isEditing ? '12px' : '16px' }}>
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <div style={{
              width: isEditing ? '76px' : '84px',
              height: isEditing ? '76px' : '84px',
              borderRadius: '50%',
              background: '#f0fdf4',
              border: '3.5px solid #10b981',
              overflow: 'hidden',
              margin: '0 auto',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 6px 14px rgba(16, 185, 129, 0.2)'
            }}>
              <img 
                src={avatarUrl} 
                alt="Avatar" 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onError={(e) => { e.target.src = `https://api.dicebear.com/7.x/bottts/svg?seed=user`; }} 
              />
            </div>
            {isEditing && (
              <button
                type="button"
                onClick={() => { sounds.playClick(); setShowAvatarPicker(!showAvatarPicker); }}
                style={{
                  position: 'absolute',
                  bottom: '-2px',
                  right: '-2px',
                  background: '#0284c7',
                  border: '2px solid #ffffff',
                  borderRadius: '50%',
                  width: '30px',
                  height: '30px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: '#ffffff',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.2)'
                }}
                title="Chọn ảnh đại diện"
              >
                <Camera size={15} />
              </button>
            )}
          </div>

          {!isEditing ? (
            <div style={{ marginTop: '8px' }}>
              <h2 style={{
                fontFamily: 'var(--font-display)',
                fontSize: '20px',
                fontWeight: 800,
                color: '#1e293b',
                margin: '0 0 2px'
              }}>
                {fullName || 'Bé Thám Hiểm'}
              </h2>
              <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 600 }}>
                {user.email}
              </div>
            </div>
          ) : (
            <div style={{ marginTop: '6px', fontSize: '11.5px', color: '#0284c7', fontWeight: 700 }}>
              {showAvatarPicker ? 'Bấm vào hình bên dưới để đổi avatar:' : 'Bấm 📷 góc avatar để chọn hình đại diện dễ thương'}
            </div>
          )}

          {/* Quick Avatar Picker in Editing Mode */}
          {isEditing && showAvatarPicker && (
            <div className="animate-pop-in" style={{
              background: '#f8fafc',
              border: '2px dashed #cbd5e1',
              borderRadius: '14px',
              padding: '10px',
              marginTop: '10px'
            }}>
              <div style={{ fontSize: '11.5px', fontWeight: 800, color: '#334155', marginBottom: '6px' }}>
                Chọn nhân vật bé yêu thích:
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '6px' }}>
                {PRESET_AVATARS.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => {
                      sounds.playClick();
                      setAvatarUrl(p.url);
                    }}
                    style={{
                      border: avatarUrl === p.url ? '3px solid #10b981' : '1.5px solid #e2e8f0',
                      borderRadius: '50%',
                      padding: 0,
                      background: '#ffffff',
                      cursor: 'pointer',
                      overflow: 'hidden',
                      width: '38px',
                      height: '38px',
                      transform: avatarUrl === p.url ? 'scale(1.1)' : 'none',
                      transition: 'all 0.15s ease'
                    }}
                    title={p.name}
                  >
                    <img src={p.url} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Feedback Messages */}
        {saveSuccess && (
          <div className="animate-pop-in" style={{
            background: '#ecfdf5',
            border: '2px solid #a7f3d0',
            color: '#065f46',
            padding: '8px',
            borderRadius: '10px',
            fontSize: '12px',
            fontWeight: 700,
            textAlign: 'center',
            marginBottom: '12px'
          }}>
            {saveSuccess}
          </div>
        )}

        {errorMessage && (
          <div className="animate-shake" style={{
            background: '#fef2f2',
            border: '2px solid #fecaca',
            color: '#b91c1c',
            padding: '8px',
            borderRadius: '10px',
            fontSize: '12px',
            fontWeight: 700,
            textAlign: 'center',
            marginBottom: '12px'
          }}>
            {errorMessage}
          </div>
        )}

        {/* EDITING FORM */}
        {isEditing ? (
          <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '11px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 800, color: '#334155', marginBottom: '4px' }}>
                Tên Của Bé hoặc Ba Mẹ:
              </label>
              <div style={{ position: 'relative' }}>
                <User size={15} color="#94a3b8" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                <input
                  type="text"
                  className="kid-input"
                  style={{ paddingLeft: '34px', fontSize: '13px', height: '38px' }}
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Vd: Bé Bắp, Minh Anh..."
                  required
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '8px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 800, color: '#334155', marginBottom: '4px' }}>
                  Ngày Sinh Của Bé:
                </label>
                <div style={{ position: 'relative' }}>
                  <Calendar size={15} color="#94a3b8" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                  <input
                    type="date"
                    className="kid-input"
                    style={{ paddingLeft: '34px', fontSize: '13px', height: '38px' }}
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 800, color: '#334155', marginBottom: '4px' }}>
                  Số Điện Thoại Phụ Huynh:
                </label>
                <div style={{ position: 'relative' }}>
                  <Phone size={15} color="#94a3b8" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                  <input
                    type="tel"
                    className="kid-input"
                    style={{ paddingLeft: '34px', fontSize: '13px', height: '38px' }}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Vd: 0912..."
                  />
                </div>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 800, color: '#334155', marginBottom: '4px' }}>
                Địa Chỉ / Tỉnh Thành:
              </label>
              <div style={{ position: 'relative' }}>
                <MapPin size={15} color="#94a3b8" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                <input
                  type="text"
                  className="kid-input"
                  style={{ paddingLeft: '34px', fontSize: '13px', height: '38px' }}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Vd: Hà Nội, TP. Đà Nẵng, TP. HCM..."
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 800, color: '#334155', marginBottom: '4px' }}>
                Sở Thích / Ước Mơ Của Bé:
              </label>
              <div style={{ position: 'relative' }}>
                <Heart size={15} color="#ec4899" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                <input
                  type="text"
                  className="kid-input"
                  style={{ paddingLeft: '34px', fontSize: '13px', height: '38px' }}
                  value={hobby}
                  onChange={(e) => setHobby(e.target.value)}
                  placeholder="Vd: Khám phá vũ trụ, vẽ tranh, học toán..."
                />
              </div>
            </div>

            {/* UNIFIED ACTION BUTTONS: SAVE & CANCEL (Clean & isolated during editing) */}
            <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
              <button
                type="submit"
                disabled={isSaving}
                className="btn-kid btn-green"
                style={{ flex: 1, padding: '10px 14px', fontSize: '13px', fontWeight: 800 }}
              >
                <Save size={15} />
                <span>{isSaving ? 'Đang lưu...' : 'Lưu Thay Đổi'}</span>
              </button>
              <button
                type="button"
                onClick={() => { sounds.playClick(); setIsEditing(false); }}
                className="btn-kid btn-gray"
                style={{ minWidth: '90px', padding: '10px 16px', fontSize: '13px', fontWeight: 800 }}
              >
                Hủy
              </button>
            </div>
          </form>
        ) : (
          /* READ-ONLY VIEW (Stats + Progress Overview + Actions) */
          <>
            {/* Info Card */}
            <div style={{
              background: '#f8fafc',
              borderRadius: '14px',
              padding: '12px 14px',
              border: '1.5px solid #e2e8f0',
              marginBottom: '14px',
              display: 'flex',
              flexDirection: 'column',
              gap: '7px',
              fontSize: '12.5px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#475569' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700 }}>
                  <Calendar size={14} color="#0284c7" />
                  <span>Ngày sinh:</span>
                </span>
                <span style={{ fontWeight: 800, color: '#1e293b' }}>
                  {birthDate ? `${birthDate} ${currentAge ? `(Bé ${currentAge} tuổi)` : ''}` : 'Chưa cập nhật'}
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#475569' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700 }}>
                  <MapPin size={14} color="#10b981" />
                  <span>Địa chỉ:</span>
                </span>
                <span style={{ fontWeight: 800, color: '#1e293b' }}>
                  {address || 'Chưa cập nhật'}
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#475569' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700 }}>
                  <Phone size={14} color="#f59e0b" />
                  <span>Điện thoại:</span>
                </span>
                <span style={{ fontWeight: 800, color: '#1e293b' }}>
                  {phone || 'Chưa cập nhật'}
                </span>
              </div>

              {hobby && (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#475569', paddingTop: '4px', borderTop: '1px dashed #e2e8f0' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700 }}>
                    <Heart size={14} color="#ec4899" />
                    <span>Sở thích:</span>
                  </span>
                  <span style={{ fontWeight: 800, color: '#db2777' }}>
                    {hobby}
                  </span>
                </div>
              )}
            </div>

            {/* Progress Overview Card */}
            <div style={{
              background: '#ffffff',
              borderRadius: '16px',
              padding: '12px',
              border: '2px solid #e2e8f0',
              marginBottom: '14px'
            }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '6px',
                textAlign: 'center'
              }}>
                <div style={{ background: '#f0f9ff', padding: '6px 4px', borderRadius: '10px', border: '1.5px solid #bae6fd' }}>
                  <div style={{ fontSize: '10px', fontWeight: 700, color: '#0369a1', marginBottom: '2px' }}>CẤP ĐỘ</div>
                  <div style={{ fontSize: '16px', fontWeight: 800, color: '#0284c7' }}>Cấp {level}</div>
                </div>

                <div style={{ background: '#fefce8', padding: '6px 4px', borderRadius: '10px', border: '1.5px solid #fef08a' }}>
                  <div style={{ fontSize: '10px', fontWeight: 700, color: '#a16207', marginBottom: '2px' }}>SAO VÀNG</div>
                  <div style={{ fontSize: '16px', fontWeight: 800, color: '#eab308', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '3px' }}>
                    <Star size={14} fill="#facc15" color="#eab308" />
                    <span>{stars}</span>
                  </div>
                </div>

                <div style={{ background: '#fffbeb', padding: '6px 4px', borderRadius: '10px', border: '1.5px solid #fde68a' }}>
                  <div style={{ fontSize: '10px', fontWeight: 700, color: '#b45309', marginBottom: '2px' }}>XU VÀNG</div>
                  <div style={{ fontSize: '16px', fontWeight: 800, color: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '3px' }}>
                    <Coins size={14} fill="#fbbf24" color="#d97706" />
                    <span>{coins}</span>
                  </div>
                </div>
              </div>

              {pet && (
                <div style={{
                  marginTop: '8px',
                  padding: '6px 10px',
                  background: '#f8fafc',
                  borderRadius: '10px',
                  border: '1px solid #cbd5e1',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#475569' }}>Bạn đồng hành:</span>
                  <span style={{ fontSize: '12.5px', fontWeight: 800, color: '#78350f' }}>
                    {pet.emoji} {pet.name}
                  </span>
                </div>
              )}
            </div>

            {/* Action Buttons (Only in Read-only Mode) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
              {isAdmin && onOpenAdmin && (
                <button
                  onClick={() => {
                    sounds.playClick();
                    onOpenAdmin();
                  }}
                  className="btn-kid btn-yellow"
                  style={{
                    padding: '8px',
                    fontSize: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                  }}
                >
                  <Settings size={14} />
                  <span>Trang Quản Trị Hệ Thống (Admin)</span>
                </button>
              )}

              <button
                onClick={handleLogoutClick}
                className="btn-kid btn-red"
                style={{
                  padding: '8px',
                  fontSize: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                <LogOut size={14} />
                <span>Đăng Xuất Tài Khoản</span>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
