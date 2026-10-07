import React, { useState, useEffect } from 'react';
import { X, LogOut, Star, Coins, Settings, User, Calendar, MapPin, Phone, Heart, Camera, Check, Edit3, Save, Sparkles, ShieldCheck } from 'lucide-react';
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
  onOpenParent,
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

  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLogoutClick = () => {
    sounds.playClick();
    setShowLogoutConfirm(true);
  };

  const handleConfirmLogout = () => {
    sounds.playClick();
    setShowLogoutConfirm(false);
    onLogout();
    onClose();
  };

  return (
    <div 
      className="modal-overlay"
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(15, 23, 42, 0.72)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1100,
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
          borderRadius: '24px',
          width: '100%',
          maxWidth: '440px',
          padding: '20px 18px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.3)',
          position: 'relative',
          maxHeight: 'calc(100dvh - 32px)',
          overflowY: 'auto',
          overscrollBehavior: 'contain',
          boxSizing: 'border-box'
        }}
      >
        {/* Top Accent Gradient */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '6px',
          background: 'linear-gradient(90deg, #10b981, #06b6d4, #6366f1, #ec4899)'
        }} />

        {/* Clean Header Bar: Title, Edit Button, Close Button */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '14px',
          gap: '8px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
            <span style={{ fontSize: '22px', filter: 'drop-shadow(0 2px 4px rgba(234, 179, 8, 0.3))' }}>🌟</span>
            <div>
              <h3 style={{
                fontFamily: 'var(--font-display)',
                fontSize: '17px',
                fontWeight: 900,
                color: '#0f172a',
                margin: 0,
                whiteSpace: 'nowrap'
              }}>
                {isEditing ? 'Cập Nhật Hồ Sơ' : 'Hồ Sơ Của Bé'}
              </h3>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
            {!isEditing && (
              <button
                type="button"
                onClick={() => { sounds.playClick(); setIsEditing(true); }}
                className="btn-kid btn-blue"
                style={{ 
                  padding: '5px 12px', 
                  fontSize: '12px', 
                  height: '32px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  borderRadius: '10px'
                }}
              >
                <Edit3 size={13} />
                <span>Sửa</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                sounds.playClick();
                onClose();
              }}
              style={{
                background: '#f1f5f9',
                border: 'none',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#64748b',
                transition: 'all 0.15s ease'
              }}
              title="Đóng"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Avatar Section */}
        <div style={{ textAlign: 'center', marginBottom: isEditing ? '12px' : '16px' }}>
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <div style={{
              width: isEditing ? '72px' : '78px',
              height: isEditing ? '72px' : '78px',
              borderRadius: '50%',
              background: '#f0fdf4',
              border: '3px solid #10b981',
              overflow: 'hidden',
              margin: '0 auto',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(16, 185, 129, 0.2)'
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
                  width: '26px',
                  height: '26px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: '#ffffff',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.2)'
                }}
                title="Chọn ảnh đại diện"
              >
                <Camera size={13} />
              </button>
            )}
          </div>

          {!isEditing ? (
            <div style={{ marginTop: '8px' }}>
              <h2 style={{
                fontFamily: 'var(--font-display)',
                fontSize: '18px',
                fontWeight: 900,
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
                      width: '36px',
                      height: '36px',
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
          <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 800, color: '#334155', marginBottom: '3px' }}>
                Tên Của Bé hoặc Ba Mẹ:
              </label>
              <div style={{ position: 'relative' }}>
                <User size={14} color="#94a3b8" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                <input
                  type="text"
                  className="kid-input"
                  style={{ paddingLeft: '32px', fontSize: '13px', height: '36px' }}
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Vd: Bé Bắp, Minh Anh..."
                  required
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '8px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 800, color: '#334155', marginBottom: '3px' }}>
                  Ngày Sinh Của Bé:
                </label>
                <div style={{ position: 'relative' }}>
                  <Calendar size={14} color="#94a3b8" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                  <input
                    type="date"
                    className="kid-input"
                    style={{ paddingLeft: '32px', fontSize: '12.5px', height: '36px' }}
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 800, color: '#334155', marginBottom: '3px' }}>
                  Số Điện Thoại:
                </label>
                <div style={{ position: 'relative' }}>
                  <Phone size={14} color="#94a3b8" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                  <input
                    type="tel"
                    className="kid-input"
                    style={{ paddingLeft: '32px', fontSize: '12.5px', height: '36px' }}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Vd: 0912..."
                  />
                </div>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 800, color: '#334155', marginBottom: '3px' }}>
                Địa Chỉ / Tỉnh Thành:
              </label>
              <div style={{ position: 'relative' }}>
                <MapPin size={14} color="#94a3b8" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                <input
                  type="text"
                  className="kid-input"
                  style={{ paddingLeft: '32px', fontSize: '13px', height: '36px' }}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Vd: Hà Nội, TP. Đà Nẵng, TP. HCM..."
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 800, color: '#334155', marginBottom: '3px' }}>
                Sở Thích Của Bé:
              </label>
              <div style={{ position: 'relative' }}>
                <Heart size={14} color="#ec4899" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                <input
                  type="text"
                  className="kid-input"
                  style={{ paddingLeft: '32px', fontSize: '13px', height: '36px' }}
                  value={hobby}
                  onChange={(e) => setHobby(e.target.value)}
                  placeholder="Vd: Vẽ tranh, khám phá vũ trụ..."
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
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
                style={{ minWidth: '80px', padding: '10px 14px', fontSize: '13px', fontWeight: 800 }}
              >
                Hủy
              </button>
            </div>
          </form>
        ) : (
          /* READ-ONLY VIEW (Stats + Progress Overview + Actions) */
          <>
            {/* Modern Info Card with Colored Icon Badges */}
            <div style={{
              background: '#f8fafc',
              borderRadius: '18px',
              padding: '12px 14px',
              border: '1.5px solid #e2e8f0',
              marginBottom: '12px',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '26px', height: '26px', borderRadius: '8px', background: '#e0f2fe', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Calendar size={13} color="#0284c7" />
                  </div>
                  <span style={{ fontWeight: 700, color: '#64748b' }}>Ngày sinh:</span>
                </div>
                <div style={{ fontWeight: 800, color: '#1e293b' }}>
                  {birthDate ? (
                    <span>{birthDate} {currentAge ? <span style={{ color: '#0284c7', fontSize: '11px', background: '#e0f2fe', padding: '1px 6px', borderRadius: '6px', marginLeft: '4px' }}>Bé {currentAge} tuổi</span> : ''}</span>
                  ) : (
                    <span style={{ color: '#94a3b8', fontStyle: 'italic' }}>Chưa cập nhật</span>
                  )}
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '26px', height: '26px', borderRadius: '8px', background: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <MapPin size={13} color="#16a34a" />
                  </div>
                  <span style={{ fontWeight: 700, color: '#64748b' }}>Địa chỉ:</span>
                </div>
                <div style={{ fontWeight: 800, color: '#1e293b', maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {address || <span style={{ color: '#94a3b8', fontStyle: 'italic' }}>Chưa cập nhật</span>}
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '26px', height: '26px', borderRadius: '8px', background: '#ffedd5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Phone size={13} color="#ea580c" />
                  </div>
                  <span style={{ fontWeight: 700, color: '#64748b' }}>Điện thoại:</span>
                </div>
                <div style={{ fontWeight: 800, color: '#1e293b' }}>
                  {phone || <span style={{ color: '#94a3b8', fontStyle: 'italic' }}>Chưa cập nhật</span>}
                </div>
              </div>

              {hobby && (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '12px', paddingTop: '6px', borderTop: '1px dashed #e2e8f0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '26px', height: '26px', borderRadius: '8px', background: '#fce7f3', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Heart size={13} color="#db2777" />
                    </div>
                    <span style={{ fontWeight: 700, color: '#64748b' }}>Sở thích:</span>
                  </div>
                  <div style={{ fontWeight: 800, color: '#db2777' }}>
                    {hobby}
                  </div>
                </div>
              )}
            </div>

            {/* Progress & Companion Card */}
            <div style={{
              background: '#ffffff',
              borderRadius: '18px',
              padding: '10px 12px',
              border: '1.5px solid #e2e8f0',
              marginBottom: '14px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
            }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '8px',
                textAlign: 'center'
              }}>
                <div style={{ background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)', padding: '8px 4px', borderRadius: '12px', border: '1.5px solid #bae6fd' }}>
                  <div style={{ fontSize: '10px', fontWeight: 800, color: '#0369a1', letterSpacing: '0.5px' }}>CẤP ĐỘ</div>
                  <div style={{ fontSize: '15px', fontWeight: 900, color: '#0284c7', marginTop: '2px' }}>Cấp {level}</div>
                </div>

                <div style={{ background: 'linear-gradient(135deg, #fefce8 0%, #fef08a 100%)', padding: '8px 4px', borderRadius: '12px', border: '1.5px solid #fde047' }}>
                  <div style={{ fontSize: '10px', fontWeight: 800, color: '#a16207', letterSpacing: '0.5px' }}>SAO VÀNG</div>
                  <div style={{ fontSize: '15px', fontWeight: 900, color: '#ca8a04', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '3px', marginTop: '2px' }}>
                    <Star size={13} fill="#eab308" color="#ca8a04" />
                    <span>{stars}</span>
                  </div>
                </div>

                <div style={{ background: 'linear-gradient(135deg, #fffbeb 0%, #fed7aa 100%)', padding: '8px 4px', borderRadius: '12px', border: '1.5px solid #fdba74' }}>
                  <div style={{ fontSize: '10px', fontWeight: 800, color: '#c2410c', letterSpacing: '0.5px' }}>XU VÀNG</div>
                  <div style={{ fontSize: '15px', fontWeight: 900, color: '#ea580c', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '3px', marginTop: '2px' }}>
                    <Coins size={13} fill="#f97316" color="#c2410c" />
                    <span>{coins}</span>
                  </div>
                </div>
              </div>

              {pet && (
                <div style={{
                  marginTop: '8px',
                  padding: '6px 10px',
                  background: '#fdf4ff',
                  borderRadius: '12px',
                  border: '1px solid #f5d0fe',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#86198f' }}>Bạn đồng hành:</span>
                  <span style={{ fontSize: '12px', fontWeight: 900, color: '#a21caf', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <span>{pet.emoji}</span> <span>{pet.name}</span>
                  </span>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {onOpenParent && (
                <button
                  type="button"
                  onClick={() => {
                    sounds.playClick();
                    onClose();
                    onOpenParent();
                  }}
                  className="btn-kid btn-purple"
                  style={{
                    padding: '9px',
                    fontSize: '12.5px',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                  }}
                >
                  <ShieldCheck size={15} />
                  <span>Báo Cáo Tiến Độ Phụ Huynh</span>
                </button>
              )}

              {isAdmin && onOpenAdmin && (
                <button
                  type="button"
                  onClick={() => {
                    sounds.playClick();
                    onOpenAdmin();
                  }}
                  className="btn-kid btn-yellow"
                  style={{
                    padding: '9px',
                    fontSize: '12.5px',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                  }}
                >
                  <Settings size={15} />
                  <span>Trang Quản Trị Hệ Thống (Admin)</span>
                </button>
              )}

              <button
                type="button"
                onClick={handleLogoutClick}
                className="btn-kid btn-red"
                style={{
                  padding: '9px',
                  fontSize: '12.5px',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                <LogOut size={15} />
                <span>Đăng Xuất Tài Khoản</span>
              </button>
            </div>
          </>
        )}
      </div>

      {/* Custom Kid-Friendly Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div 
          className="modal-overlay"
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.8)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1200,
            padding: '16px'
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowLogoutConfirm(false);
          }}
        >
          <div 
            className="kid-card animate-pop-in"
            style={{
              background: '#ffffff',
              borderRadius: '24px',
              width: '100%',
              maxWidth: '360px',
              padding: '22px 18px',
              textAlign: 'center',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4)',
              border: '3px solid #fecaca'
            }}
          >
            <div style={{ fontSize: '48px', marginBottom: '8px' }}>☁️✨</div>
            <h3 style={{
              fontFamily: 'var(--font-display)',
              fontSize: '18px',
              fontWeight: 900,
              color: '#1e293b',
              margin: '0 0 8px'
            }}>
              Đăng Xuất Tài Khoản?
            </h3>
            <p style={{
              fontSize: '13px',
              color: '#475569',
              lineHeight: 1.5,
              margin: '0 0 16px',
              fontWeight: 600
            }}>
              Bé và ba mẹ yên tâm nhé! Toàn bộ <strong>sao vàng ⭐, xu 🪙, cấp độ và hồ sơ</strong> đã được lưu an toàn 100% trên <strong>Supabase Database</strong> đám mây rồi!
            </p>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                type="button"
                onClick={() => { sounds.playClick(); setShowLogoutConfirm(false); }}
                className="btn-kid btn-gray"
                style={{ flex: 1, padding: '10px 14px', fontSize: '13px', fontWeight: 800, borderRadius: '12px' }}
              >
                Ở Lại Chơi Tiếp
              </button>
              <button
                type="button"
                onClick={handleConfirmLogout}
                className="btn-kid btn-red"
                style={{ flex: 1, padding: '10px 14px', fontSize: '13px', fontWeight: 800, borderRadius: '12px' }}
              >
                Đăng Xuất
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
