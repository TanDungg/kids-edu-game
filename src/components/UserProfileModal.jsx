import React from 'react';
import { X, LogOut, Cloud, Star, Coins, ShieldCheck, RefreshCw, Settings, Shield } from 'lucide-react';
import { sounds } from '../utils/sound';

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
  onManualSync 
}) {
  if (!isOpen || !user) return null;

  const displayName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'Bé Thám Hiểm';
  const avatarUrl = user.user_metadata?.avatar_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(user.email || 'kid')}`;

  const handleLogoutClick = () => {
    sounds.playClick();
    if (window.confirm('Bé và ba mẹ có chắc muốn đăng xuất không? Dữ liệu đã được lưu trên đám mây!')) {
      onLogout();
      onClose();
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(15, 23, 42, 0.65)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px'
    }}>
      <div 
        className="kid-card animate-pop-in"
        style={{
          background: '#ffffff',
          borderRadius: '28px',
          width: '100%',
          maxWidth: '440px',
          padding: '28px 24px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Top Accent */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '8px',
          background: 'linear-gradient(90deg, #10b981, #06b6d4, #6366f1)'
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

        {/* Avatar & Info */}
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: '#f8fafc',
            border: '4px solid #38bdf8',
            overflow: 'hidden',
            margin: '0 auto 12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 8px 16px rgba(56, 189, 248, 0.2)'
          }}>
            <img 
              src={avatarUrl} 
              alt={displayName} 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              onError={(e) => {
                e.target.style.display = 'none';
              }} 
            />
          </div>

          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: '22px',
            fontWeight: 800,
            color: '#1e293b',
            margin: '0 0 4px'
          }}>
            {displayName}
          </h2>

          <div style={{ fontSize: '13px', color: '#64748b', fontWeight: 600, marginBottom: '8px' }}>
            {user.email}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: '#ecfdf5',
              color: '#059669',
              border: '1.5px solid #a7f3d0',
              padding: '4px 12px',
              borderRadius: '999px',
              fontSize: '12px',
              fontWeight: 800
            }}>
              <Cloud size={14} />
              <span>Đồng bộ Supabase Cloud 🟢</span>
            </div>

            {isAdmin ? (
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                background: '#fef3c7',
                color: '#b45309',
                border: '1.5px solid #fde68a',
                padding: '4px 12px',
                borderRadius: '999px',
                fontSize: '12px',
                fontWeight: 800
              }}>
                <Shield size={14} />
                <span>Quản Trị Viên (Admin) 🛡️</span>
              </div>
            ) : (
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                background: '#f0f9ff',
                color: '#0284c7',
                border: '1.5px solid #bae6fd',
                padding: '4px 12px',
                borderRadius: '999px',
                fontSize: '12px',
                fontWeight: 800
              }}>
                <span>🧒 Người Dùng Thường</span>
              </div>
            )}
          </div>
        </div>

        {/* Progress Overview Card */}
        <div style={{
          background: '#f8fafc',
          borderRadius: '20px',
          padding: '16px',
          border: '2px solid #e2e8f0',
          marginBottom: '20px'
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '10px',
            textAlign: 'center'
          }}>
            <div style={{ background: '#ffffff', padding: '10px 6px', borderRadius: '14px', border: '1.5px solid #cbd5e1' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', marginBottom: '2px' }}>CẤP ĐỘ</div>
              <div style={{ fontSize: '18px', fontWeight: 800, color: '#0284c7' }}>Cấp {level}</div>
            </div>

            <div style={{ background: '#ffffff', padding: '10px 6px', borderRadius: '14px', border: '1.5px solid #cbd5e1' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', marginBottom: '2px' }}>SAO VÀNG</div>
              <div style={{ fontSize: '18px', fontWeight: 800, color: '#eab308', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                <Star size={16} fill="#facc15" color="#eab308" />
                <span>{stars}</span>
              </div>
            </div>

            <div style={{ background: '#ffffff', padding: '10px 6px', borderRadius: '14px', border: '1.5px solid #cbd5e1' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', marginBottom: '2px' }}>XU VÀNG</div>
              <div style={{ fontSize: '18px', fontWeight: 800, color: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                <Coins size={16} fill="#fbbf24" color="#d97706" />
                <span>{coins}</span>
              </div>
            </div>
          </div>

          {pet && (
            <div style={{
              marginTop: '12px',
              padding: '10px 14px',
              background: '#ffffff',
              borderRadius: '14px',
              border: '1.5px solid #cbd5e1',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <span style={{ fontSize: '13px', fontWeight: 700, color: '#475569' }}>Bạn đồng hành:</span>
              <span style={{ fontSize: '14px', fontWeight: 800, color: '#78350f' }}>
                {pet.emoji} {pet.name}
              </span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
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
