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
      background: 'rgba(255, 255, 255, 0.94)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.06)',
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      width: '100%',
      maxWidth: '100vw',
      zIndex: 100,
      borderBottom: '2px solid #e2e8f0',
      paddingTop: 'calc(env(safe-area-inset-top, 0px) + 6px)',
      paddingBottom: '6px',
      paddingLeft: 'clamp(8px, 2vw, 16px)',
      paddingRight: 'clamp(8px, 2vw, 16px)',
      boxSizing: 'border-box'
    }}>
      {/* Top Primary Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '6px',
        maxWidth: '1200px',
        margin: '0 auto',
        width: '100%',
        boxSizing: 'border-box'
      }}>
        {/* Left: Home / App Brand */}
        <div 
          onClick={onGoHome}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            cursor: 'pointer',
            flexShrink: 0,
            userSelect: 'none'
          }}
          title="Về Trang Chủ"
        >
          <span style={{ fontSize: 'clamp(20px, 5.5vw, 26px)', lineHeight: 1 }} className="animate-bounce-slow">🚀</span>
          <div>
            <h1 style={{ 
              fontFamily: 'var(--font-display)', 
              fontSize: 'clamp(13px, 3.8vw, 18px)', 
              fontWeight: 800,
              background: 'linear-gradient(45deg, #0284c7, #9333ea)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              lineHeight: 1.1,
              whiteSpace: 'nowrap',
              margin: 0
            }}>
              Vương Quốc Tí Hon
            </h1>
            <span className="hide-on-mobile" style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', display: 'block' }}>
              Học Vui &middot; Luyện Trí Tuệ
            </span>
          </div>
        </div>

        {/* Middle Desktop Player Stats (Hidden on mobile < 641px) */}
        {currentUser ? (
          <div className="hide-on-mobile" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
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
          <div className="hide-on-mobile" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: '#f8fafc',
              border: '1.5px solid #e2e8f0',
              color: '#64748b',
              padding: '3px 10px',
              borderRadius: '999px',
              fontSize: '11px',
              fontWeight: 700
            }}>
              <span>🔒</span>
              <span>Đăng nhập để lưu tiến độ</span>
            </div>
          </div>
        )}

        {/* Compact Mobile Stats (Inline on phone < 641px) */}
        {currentUser ? (
          <div className="show-on-mobile stat-pill" style={{
            padding: '2px 6px',
            fontSize: '10.5px',
            color: '#b45309',
            borderColor: '#fcd34d',
            gap: '3px',
            flexShrink: 0
          }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '2px', fontWeight: 800 }}>
              ⭐ {stars}
            </span>
            <span style={{ color: '#cbd5e1' }}>&middot;</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '2px', fontWeight: 800 }}>
              🪙 {coins}
            </span>
          </div>
        ) : null}

        {/* Right Controls: User Auth, Sound & Parent/Admin Gate */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0 }}>
          {currentUser ? (
            <>
              <button 
                onClick={onOpenProfile}
                className="btn-kid"
                style={{
                  padding: '3px 6px',
                  fontSize: '11px',
                  background: '#f0fdf4',
                  border: '1.5px solid #86efac',
                  color: '#15803d',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  minHeight: '28px'
                }}
                title="Xem hồ sơ và chỉnh sửa thông tin"
              >
                <div style={{
                  width: '20px',
                  height: '20px',
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
                <span className="hide-on-mobile" style={{ maxWidth: '70px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontWeight: 800 }}>
                  {currentUser.user_metadata?.full_name || currentUser.email?.split('@')[0] || 'Bé'}
                </span>
              </button>

              {/* Quản lý Phụ Huynh */}
              {!isAdmin && (
                <button 
                  onClick={onOpenParent}
                  className="btn-kid btn-purple"
                  style={{
                    padding: '0 7px',
                    height: '28px',
                    minWidth: '28px',
                    fontSize: '11px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '4px'
                  }}
                  title="Báo cáo tiến độ học tập dành cho phụ huynh"
                >
                  <ShieldCheck size={14} />
                  <span className="hide-on-mobile">Phụ Huynh</span>
                </button>
              )}

              {/* Quản trị Admin */}
              {isAdmin && (
                <button 
                  onClick={onOpenAdmin}
                  className="btn-kid btn-yellow"
                  style={{
                    padding: '0 7px',
                    height: '28px',
                    minWidth: '28px',
                    fontSize: '11px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '4px'
                  }}
                  title="Quản trị hệ thống (Admin)"
                >
                  <Settings size={14} />
                  <span className="hide-on-mobile">Admin</span>
                </button>
              )}
            </>
          ) : (
            <button 
              onClick={onOpenAuth}
              className="btn-kid btn-green"
              style={{
                padding: '4px 8px',
                fontSize: '11px',
                height: '28px',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
              title="Đăng ký hoặc đăng nhập tài khoản"
            >
              <User size={13} />
              <span>Đăng Nhập</span>
            </button>
          )}

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
              justifyContent: 'center'
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
