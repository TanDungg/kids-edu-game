import React, { useState, useEffect } from 'react';
import { X, LogOut, Star, Coins, RefreshCw, Settings, User, Calendar, MapPin, Phone, Heart, Camera, Check, Edit3, ArrowLeft, Sparkles } from 'lucide-react';
import { sounds } from '../utils/sound';
import { supabaseService } from '../services/supabase';

const PRESET_AVATARS = [
  { id: 'robot', label: 'Robot Vui Nhộn', url: 'https://api.dicebear.com/7.x/bottts/svg?seed=RobotJoy' },
  { id: 'cat', label: 'Mèo Miu Miu', url: 'https://api.dicebear.com/7.x/bottts/svg?seed=KittyMiu' },
  { id: 'dog', label: 'Cún Thông Thái', url: 'https://api.dicebear.com/7.x/bottts/svg?seed=PuppySmart' },
  { id: 'astro', label: 'Phi Hành Gia', url: 'https://api.dicebear.com/7.x/bottts/svg?seed=AstroKid' },
  { id: 'royal', label: 'Vương Giả Tí Hon', url: 'https://api.dicebear.com/7.x/bottts/svg?seed=RoyalStar' },
  { id: 'lion', label: 'Sư Tử Dũng Cảm', url: 'https://api.dicebear.com/7.x/bottts/svg?seed=BraveLion' },
  { id: 'panda', label: 'Gấu Trúc Nhỏ', url: 'https://api.dicebear.com/7.x/bottts/svg?seed=PandaCute' },
  { id: 'unicorn', label: 'Kỳ Lân Phép Thuật', url: 'https://api.dicebear.com/7.x/bottts/svg?seed=MagicUnicorn' }
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
  onManualSync,
  onUpdateUser
}) {
  if (!isOpen || !user) return null;

  const metadata = user.user_metadata || {};
  const [isEditing, setIsEditing] = useState(false);
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);

  // Form states
  const [fullName, setFullName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Sync state whenever modal opens or user changes
  useEffect(() => {
    if (user) {
      const meta = user.user_metadata || {};
      const savedLocal = (() => {
        try {
          return JSON.parse(localStorage.getItem(`kids_user_profile_${user.id}`) || '{}');
        } catch {
          return {};
        }
      })();

      setFullName(meta.full_name || savedLocal.full_name || user.email?.split('@')[0] || 'Bé Thám Hiểm');
      setAvatarUrl(meta.avatar_url || savedLocal.avatar_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(user.email || 'kid')}`);
      setBirthDate(meta.birth_date || savedLocal.birth_date || '');
      setAddress(meta.address || savedLocal.address || '');
      setPhone(meta.phone || savedLocal.phone || '');
      setNotes(meta.notes || savedLocal.notes || '');
      setIsEditing(false);
      setShowAvatarPicker(false);
      setSuccessMsg('');
      setErrorMsg('');
    }
  }, [isOpen, user]);

  const handleLogoutClick = () => {
    sounds.playClick();
    if (window.confirm('Bé và ba mẹ có chắc muốn đăng xuất không? Dữ liệu đã được lưu an toàn trên đám mây!')) {
      onLogout();
      onClose();
    }
  };

  const handleSelectPresetAvatar = (url) => {
    sounds.playClick();
    setAvatarUrl(url);
    setShowAvatarPicker(false);
  };

  const handleSaveProfile = async (e) => {
    e?.preventDefault();
    sounds.playClick();
    setIsLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const payload = {
        fullName: fullName.trim() || 'Bé Thám Hiểm',
        avatarUrl,
        birthDate,
        address: address.trim(),
        phone: phone.trim(),
        notes: notes.trim()
      };

      // 1. Save to Supabase Auth & DB
      const updatedUser = await supabaseService.updateUserProfile(payload);

      // 2. Save locally for instant persistence
      localStorage.setItem(`kids_user_profile_${user.id}`, JSON.stringify(payload));

      // 3. Update React parent state
      if (onUpdateUser && updatedUser) {
        onUpdateUser(updatedUser);
      }

      sounds.playSuccess();
      setSuccessMsg('🎉 Đã cập nhật thông tin hồ sơ thành công!');
      setTimeout(() => {
        setIsEditing(false);
        setSuccessMsg('');
      }, 1000);
    } catch (err) {
      sounds.playError();
      setErrorMsg(err.message || 'Không thể lưu hồ sơ, vui lòng thử lại!');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(15, 23, 42, 0.65)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '16px'
    }}>
      <div 
        className="kid-card animate-pop-in"
        style={{
          background: '#ffffff',
          borderRadius: '28px',
          width: '100%',
          maxWidth: '480px',
          padding: '24px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          position: 'relative',
          maxHeight: '92vh',
          overflowY: 'auto'
        }}
      >
        {/* Top Accent Gradient */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '8px',
          background: 'linear-gradient(90deg, #10b981, #06b6d4, #8b5cf6, #ec4899)'
        }} />

        {/* Close Button */}
        <button
          onClick={() => {
            sounds.playClick();
            onClose();
          }}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: '#f1f5f9',
            border: 'none',
            borderRadius: '50%',
            width: '36px',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: '#64748b'
          }}
        >
          <X size={18} />
        </button>

        {/* Feedback Alerts */}
        {successMsg && (
          <div className="animate-pop-in" style={{
            background: '#f0fdf4',
            border: '2px solid #bbf7d0',
            color: '#15803d',
            padding: '10px 14px',
            borderRadius: '12px',
            fontSize: '13px',
            fontWeight: 700,
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <Sparkles size={16} />
            <span>{successMsg}</span>
          </div>
        )}

        {errorMsg && (
          <div className="animate-shake" style={{
            background: '#fef2f2',
            border: '2px solid #fecaca',
            color: '#b91c1c',
            padding: '10px 14px',
            borderRadius: '12px',
            fontSize: '13px',
            fontWeight: 700,
            marginBottom: '16px'
          }}>
            {errorMsg}
          </div>
        )}

        {/* Avatar & Main Identity */}
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <div style={{ position: 'relative', width: '90px', height: '90px', margin: '0 auto 12px' }}>
            <div style={{
              width: '90px',
              height: '90px',
              borderRadius: '50%',
              background: '#f8fafc',
              border: '4px solid #38bdf8',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 16px rgba(56, 189, 248, 0.2)'
            }}>
              <img 
                src={avatarUrl} 
                alt={fullName} 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onError={(e) => {
                  e.target.style.display = 'none';
                }} 
              />
            </div>

            {/* Change Avatar Button */}
            <button
              type="button"
              onClick={() => {
                sounds.playClick();
                setShowAvatarPicker(!showAvatarPicker);
              }}
              title="Đổi hình đại diện"
              style={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                background: '#0284c7',
                color: '#ffffff',
                border: '2px solid #ffffff',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 2px 6px rgba(0,0,0,0.2)'
              }}
            >
              <Camera size={16} />
            </button>
          </div>

          {/* Quick Avatar Picker Dialog */}
          {showAvatarPicker && (
            <div className="animate-pop-in" style={{
              background: '#f8fafc',
              border: '2px solid #cbd5e1',
              borderRadius: '18px',
              padding: '12px',
              marginBottom: '14px',
              textAlign: 'left'
            }}>
              <div style={{ fontSize: '12px', fontWeight: 800, color: '#334155', marginBottom: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>Chọn hình đại diện dễ thương:</span>
                <button
                  type="button"
                  onClick={() => setShowAvatarPicker(false)}
                  style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: '11px', fontWeight: 700 }}
                >
                  Đóng ✕
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
                {PRESET_AVATARS.map((av) => (
                  <button
                    key={av.id}
                    type="button"
                    onClick={() => handleSelectPresetAvatar(av.url)}
                    style={{
                      background: avatarUrl === av.url ? '#e0f2fe' : '#ffffff',
                      border: avatarUrl === av.url ? '2px solid #0284c7' : '1.5px solid #e2e8f0',
                      borderRadius: '14px',
                      padding: '6px',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '4px',
                      transition: 'transform 0.15s'
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.05)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
                  >
                    <img src={av.url} alt={av.label} style={{ width: '40px', height: '40px', borderRadius: '50%' }} />
                    <span style={{ fontSize: '9px', fontWeight: 800, color: '#475569', textAlign: 'center', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '60px' }}>
                      {av.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: '22px',
            fontWeight: 800,
            color: '#1e293b',
            margin: '0 0 2px'
          }}>
            {fullName || 'Bé Thám Hiểm'}
          </h2>

          <div style={{ fontSize: '13px', color: '#64748b', fontWeight: 600 }}>
            {user.email}
          </div>
        </div>

        {/* PROFILE INFO & EDIT SECTION */}
        {!isEditing ? (
          /* VIEW MODE */
          <div style={{
            background: '#f8fafc',
            borderRadius: '20px',
            padding: '16px',
            border: '2px solid #e2e8f0',
            marginBottom: '16px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div style={{ fontSize: '13px', fontWeight: 800, color: '#1e293b', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <User size={16} color="#0284c7" />
                <span>Thông Tin Cá Nhân</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  sounds.playClick();
                  setIsEditing(true);
                }}
                className="btn-kid btn-blue"
                style={{ padding: '6px 14px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <Edit3 size={13} />
                <span>Chỉnh Sửa</span>
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#475569' }}>
                <Calendar size={15} color="#8b5cf6" style={{ flexShrink: 0 }} />
                <span><strong>Ngày sinh:</strong> {birthDate ? new Date(birthDate).toLocaleDateString('vi-VN') : 'Chưa cập nhật'}</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#475569' }}>
                <MapPin size={15} color="#ec4899" style={{ flexShrink: 0 }} />
                <span><strong>Địa chỉ:</strong> {address || 'Chưa cập nhật'}</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#475569' }}>
                <Phone size={15} color="#10b981" style={{ flexShrink: 0 }} />
                <span><strong>SĐT Ba Mẹ:</strong> {phone || 'Chưa cập nhật'}</span>
              </div>

              {notes && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#475569' }}>
                  <Heart size={15} color="#f59e0b" style={{ flexShrink: 0 }} />
                  <span><strong>Sở thích của bé:</strong> {notes}</span>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* EDIT MODE FORM */
          <form onSubmit={handleSaveProfile} style={{
            background: '#f8fafc',
            borderRadius: '20px',
            padding: '16px',
            border: '2px solid #bfdbfe',
            marginBottom: '16px'
          }}>
            <div style={{ fontSize: '14px', fontWeight: 800, color: '#1e293b', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Edit3 size={16} color="#0284c7" />
              <span>Chỉnh Sửa Hồ Sơ Tài Khoản</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {/* Name */}
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 800, color: '#475569', marginBottom: '4px' }}>
                  Họ và tên của bé hoặc Ba Mẹ:
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Ví dụ: Bé Bắp, Dũng..."
                  required
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '10px',
                    border: '1.5px solid #cbd5e1',
                    fontSize: '13px',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              {/* Birth Date */}
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 800, color: '#475569', marginBottom: '4px' }}>
                  Ngày sinh của bé:
                </label>
                <input
                  type="date"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '10px',
                    border: '1.5px solid #cbd5e1',
                    fontSize: '13px',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              {/* Address */}
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 800, color: '#475569', marginBottom: '4px' }}>
                  Địa chỉ / Tỉnh thành:
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Ví dụ: Cầu Giấy, Hà Nội hoặc TP.HCM"
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '10px',
                    border: '1.5px solid #cbd5e1',
                    fontSize: '13px',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              {/* Phone */}
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 800, color: '#475569', marginBottom: '4px' }}>
                  Số điện thoại liên hệ của Ba Mẹ:
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Ví dụ: 0912 345 678"
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '10px',
                    border: '1.5px solid #cbd5e1',
                    fontSize: '13px',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              {/* Hobbies / Notes */}
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 800, color: '#475569', marginBottom: '4px' }}>
                  Sở thích / Ghi chú của bé:
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Ví dụ: Thích học toán, xem phim hoạt hình, yêu mèo..."
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '10px',
                    border: '1.5px solid #cbd5e1',
                    fontSize: '13px',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              {/* Form Buttons */}
              <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn-kid btn-green"
                  style={{ flex: 1, padding: '10px', fontSize: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                >
                  <Check size={16} />
                  <span>{isLoading ? 'Đang lưu...' : 'Lưu Thay Đổi'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  style={{
                    padding: '10px 16px',
                    borderRadius: '12px',
                    border: '1.5px solid #cbd5e1',
                    background: '#ffffff',
                    color: '#64748b',
                    fontSize: '13px',
                    fontWeight: 800,
                    cursor: 'pointer'
                  }}
                >
                  Hủy
                </button>
              </div>
            </div>
          </form>
        )}

        {/* Progress Overview Card */}
        <div style={{
          background: '#f8fafc',
          borderRadius: '20px',
          padding: '14px',
          border: '2px solid #e2e8f0',
          marginBottom: '16px'
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '8px',
            textAlign: 'center'
          }}>
            <div style={{ background: '#ffffff', padding: '8px 4px', borderRadius: '12px', border: '1.5px solid #cbd5e1' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', marginBottom: '2px' }}>CẤP ĐỘ</div>
              <div style={{ fontSize: '16px', fontWeight: 800, color: '#0284c7' }}>Cấp {level}</div>
            </div>

            <div style={{ background: '#ffffff', padding: '8px 4px', borderRadius: '12px', border: '1.5px solid #cbd5e1' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', marginBottom: '2px' }}>SAO VÀNG</div>
              <div style={{ fontSize: '16px', fontWeight: 800, color: '#eab308', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                <Star size={15} fill="#facc15" color="#eab308" />
                <span>{stars}</span>
              </div>
            </div>

            <div style={{ background: '#ffffff', padding: '8px 4px', borderRadius: '12px', border: '1.5px solid #cbd5e1' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', marginBottom: '2px' }}>XU VÀNG</div>
              <div style={{ fontSize: '16px', fontWeight: 800, color: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                <Coins size={15} fill="#fbbf24" color="#d97706" />
                <span>{coins}</span>
              </div>
            </div>
          </div>

          {pet && (
            <div style={{
              marginTop: '10px',
              padding: '8px 12px',
              background: '#ffffff',
              borderRadius: '12px',
              border: '1.5px solid #cbd5e1',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <span style={{ fontSize: '12px', fontWeight: 700, color: '#475569' }}>Bạn đồng hành:</span>
              <span style={{ fontSize: '13px', fontWeight: 800, color: '#78350f' }}>
                {pet.emoji} {pet.name}
              </span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {isAdmin && onOpenAdmin && (
            <button
              onClick={() => {
                sounds.playClick();
                onOpenAdmin();
              }}
              className="btn-kid btn-yellow"
              style={{
                padding: '10px',
                fontSize: '13px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              <Settings size={15} />
              <span>Truy Cập Trang Quản Trị Hệ Thống (Admin)</span>
            </button>
          )}

          {onManualSync && (
            <button
              onClick={() => {
                sounds.playSuccess();
                onManualSync();
              }}
              className="btn-kid btn-green"
              style={{
                padding: '10px',
                fontSize: '13px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              <RefreshCw size={15} />
              <span>Đồng bộ tiến độ lên Cloud ngay</span>
            </button>
          )}

          <button
            onClick={handleLogoutClick}
            className="btn-kid btn-red"
            style={{
              padding: '10px',
              fontSize: '13px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            <LogOut size={15} />
            <span>Đăng Xuất Tài Khoản</span>
          </button>
        </div>
      </div>
    </div>
  );
}
