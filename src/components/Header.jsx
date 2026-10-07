import React from 'react';
import { Volume2, VolumeX, ShieldCheck, Star, Coins, Settings, User } from 'lucide-react';
import { sounds } from '../utils/sound';

export default function Header({ 
  stars, 
  coins, 
  level, 
  isMuted, 
  onToggleMute, 
  onOpenParent, 
  onOpenAdmin, 
  onGoHome, 
  currentScreen, 
  currentUser, 
  isAdmin, 
  onOpenAuth, 
  onOpenProfile 
}) {
  return (
    <header className="app-header" style={{
      background: 'rgba(255, 255, 255, 0.96)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.06)',
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      width: '100%',
      zIndex: 100,
      borderBottom: '2px solid rgba(226, 232, 240, 0.9)',
      paddingTop: 'calc(env(safe-area-inset-top, 0px) + 6px)',
      paddingBottom: '6px',
      paddingLeft: 'clamp(6px, 2vw, 16px)',
      paddingRight: 'clamp(6px, 2vw, 16px)',
      boxSizing: 'border-box',
      overflow: 'hidden'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '4px',
        maxWidth: '1200px',
        margin: '0 auto',
        width: '100%',
        boxSizing: 'border-box'
      }}>
        {/* Left: Brand Logo & Title */}
        <div 
          onClick={() => {
            sounds.playClick();
            onGoHome();
          }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            cursor: 'pointer',
            flexShrink: 1,
            minWidth: 0,
            userSelect: 'none'
          }}
          title="Về Bản Đồ Trang Chủ"
        >
          <span style={{ fontSize: 'clamp(18px, 4.5vw, 24px)', lineHeight: 1 }} className="animate-bounce-slow">🚀</span>
          <div style={{ minWidth: 0, overflow: 'hidden' }}>
            <h1 style={{ 
              fontFamily: 'var(--font-display)', 
              fontSize: 'clamp(12px, 3.4vw, 18px)', 
              fontWeight: 900,
              background: 'linear-gradient(45deg, #0284c7, #9333ea)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              lineHeight: 1.15,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              margin: 0,
              letterSpacing: '-0.3px'
            }}>
              Vương Quốc Tí Hon
            </h1>
            <span className="hide-on-mobile" style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', display: 'block' }}>
              Học Vui &middot; Luyện Trí Tuệ Song Ngữ
            </span>
          </div>
        </div>

        {/* Middle Stats for Desktop (Hidden on mobile < 641px) */}
        {currentUser ? (
          <div className="hide-on-mobile" style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
            <div className="stat-pill" style={{ background: '#fef08a', color: '#854d0e', borderColor: '#facc15' }}>
              <span style={{ fontSize: '12px' }}>Cấp {level}</span>
            </div>
            <div className="stat-pill" style={{ color: '#d97706', borderColor: '#fde047' }}>
              <Star size={15} fill="#facc15" color="#ca8a04" />
              <span style={{ fontSize: '13px' }}>{stars}</span>
            </div>
            <div className="stat-pill" style={{ color: '#b45309', borderColor: '#fcd34d' }}>
              <Coins size={15} fill="#fbbf24" color="#d97706" />
              <span style={{ fontSize: '13px' }}>{coins}</span>
            </div>
          </div>
        ) : (
          <div className="hide-on-mobile" style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: '#f8fafc',
              border: '1.5px solid #e2e8f0',
              color: '#64748b',
              padding: '4px 12px',
              borderRadius: '999px',
              fontSize: '12px',
              fontWeight: 700
            }}>
              <span>🔒</span>
              <span>Đăng nhập để lưu tiến độ</span>
            </div>
          </div>
        )}

        {/* Right Controls: Currency Badge, Profile Avatar, Sound */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0 }}>
          {/* Mobile Currency Badge (< 641px) */}
          {currentUser && (
            <div 
              className="show-on-mobile stat-pill" 
              onClick={() => {
                sounds.playClick();
                onOpenProfile();
              }}
              style={{
                padding: '3px 6px',
                fontSize: '11px',
                color: '#b45309',
                borderColor: '#fcd34d',
                gap: '3px',
                flexShrink: 0,
                cursor: 'pointer'
              }}
              title="Điểm sao và xu vàng của bé"
            >
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '2px', fontWeight: 900 }}>
                ⭐ {stars}
              </span>
              <span style={{ color: '#cbd5e1' }}>&middot;</span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '2px', fontWeight: 900 }}>
                🪙 {coins}
              </span>
            </div>
          )}

          {currentUser ? (
            <>
              {/* Profile Avatar Button */}
              <button 
                onClick={() => {
                  sounds.playClick();
                  onOpenProfile();
                }}
                className="btn-kid"
                style={{
                  padding: '2px',
                  background: '#f0fdf4',
                  border: '1.5px solid #86efac',
                  color: '#15803d',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  height: '28px',
                  minWidth: '28px',
                  borderRadius: '999px'
                }}
                title="Hồ sơ tài khoản & Cài đặt"
              >
                <div style={{
                  width: '22px',
                  height: '22px',
                  borderRadius: '50%',
                  overflow: 'hidden',
                  background: '#e0f2fe',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid #38bdf8',
                  flexShrink: 0
                }}>
                  <img 
                    src={currentUser.user_metadata?.avatar_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(currentUser.email || 'user')}`} 
                    alt="Avatar" 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                </div>
                <span className="hide-on-mobile" style={{ maxWidth: '80px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontWeight: 800, fontSize: '12px', paddingRight: '4px' }}>
                  {currentUser.user_metadata?.full_name || currentUser.email?.split('@')[0] || 'Bé'}
                </span>
              </button>

              {/* Phụ Huynh (Desktop only) */}
              {!isAdmin && (
                <button 
                  onClick={() => {
                    sounds.playClick();
                    onOpenParent();
                  }}
                  className="btn-kid btn-purple hide-on-mobile"
                  style={{
                    padding: '0 10px',
                    height: '28px',
                    fontSize: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px'
                  }}
                  title="Báo cáo tiến độ học tập dành cho phụ huynh"
                >
                  <ShieldCheck size={14} />
                  <span>Phụ Huynh</span>
                </button>
              )}

              {/* Admin (Desktop only) */}
              {isAdmin && (
                <button 
                  onClick={() => {
                    sounds.playClick();
                    onOpenAdmin();
                  }}
                  className="btn-kid btn-yellow hide-on-mobile"
                  style={{
                    padding: '0 10px',
                    height: '28px',
                    fontSize: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px'
                  }}
                  title="Quản trị hệ thống (Admin)"
                >
                  <Settings size={14} />
                  <span>Admin</span>
                </button>
              )}
            </>
          ) : (
            <button 
              type="button"
              onClick={() => {
                sounds.playClick();
                onOpenAuth();
              }}
              style={{
                padding: '4px 10px',
                fontSize: '11.5px',
                fontWeight: 800,
                height: '28px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                color: '#ffffff',
                border: 'none',
                borderRadius: '999px',
                boxShadow: '0 2px 8px rgba(16, 185, 129, 0.35)',
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
              title="Đăng ký hoặc đăng nhập tài khoản"
            >
              <User size={13} />
              <span>Đăng Nhập</span>
            </button>
          )}

          {/* Sound Mute/Unmute Toggle */}
          <button 
            onClick={onToggleMute}
            className="btn-kid btn-blue"
            style={{
              width: '28px',
              height: '28px',
              minWidth: '28px',
              padding: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '50%'
            }}
            title={isMuted ? 'Bật âm thanh' : 'Tắt âm thanh'}
          >
            {isMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
          </button>
        </div>
      </div>
    </header>
  );
}
