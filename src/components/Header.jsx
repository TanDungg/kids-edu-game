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
    <header style={{
      background: 'rgba(255, 255, 255, 0.9)',
      backdropFilter: 'blur(12px)',
      boxShadow: '0 4px 15px rgba(0, 0, 0, 0.08)',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      borderBottom: '3px solid #e2e8f0',
      padding: '8px 12px'
    }}>
      {/* Top Primary Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '8px',
        maxWidth: '1200px',
        margin: '0 auto',
        width: '100%'
      }}>
        {/* Left: Home / App Brand */}
        <div 
          onClick={onGoHome}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            cursor: 'pointer',
            flexShrink: 0
          }}
        >
          <span style={{ fontSize: '28px' }} className="animate-bounce-slow">🚀</span>
          <div>
            <h1 style={{ 
              fontFamily: 'var(--font-display)', 
              fontSize: '18px', 
              fontWeight: 800,
              background: 'linear-gradient(45deg, #0284c7, #9333ea)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              lineHeight: 1.1,
              whiteSpace: 'nowrap'
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
          <div className="hide-on-mobile" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div className="stat-pill" style={{ background: '#fef08a', color: '#854d0e', borderColor: '#facc15' }}>
              <span style={{ fontSize: '13px' }}>Cấp {level}</span>
            </div>
            <div className="stat-pill" style={{ color: '#d97706', borderColor: '#fde047' }}>
              <Star size={16} fill="#facc15" color="#ca8a04" />
              <span style={{ fontSize: '14px' }}>{stars}</span>
            </div>
            <div className="stat-pill" style={{ color: '#b45309', borderColor: '#fcd34d' }}>
              <Coins size={16} fill="#fbbf24" color="#d97706" />
              <span style={{ fontSize: '14px' }}>{coins}</span>
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

        {/* Compact Mobile Stats (Inline on phone < 641px) */}
        {currentUser ? (
          <div className="show-on-mobile stat-pill" style={{
            padding: '3px 8px',
            fontSize: '11px',
            color: '#b45309',
            borderColor: '#fcd34d',
            gap: '5px',
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

        {/* Right Controls: User Auth, Sound & Parent Gate */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0 }}>
          {currentUser ? (
            <>
              <button 
                onClick={onOpenProfile}
                className="btn-kid"
                style={{
                  padding: '4px 8px',
                  fontSize: '11px',
                  background: '#f0fdf4',
                  border: '1.5px solid #86efac',
                  color: '#15803d',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
                title="Xem hồ sơ và đồng bộ đám mây"
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
                  border: '1px solid #38bdf8'
                }}>
                  <img 
                    src={currentUser.user_metadata?.avatar_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(currentUser.email || 'user')}`} 
                    alt="Avatar" 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                </div>
                <span className="hide-on-mobile" style={{ maxWidth: '75px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontWeight: 800 }}>
                  {currentUser.user_metadata?.full_name || currentUser.email?.split('@')[0] || 'Bé'}
                </span>
              </button>

              {/* Quản lý Phụ Huynh */}
              {!isAdmin && (
                <button 
                  onClick={onOpenParent}
                  className="btn-kid btn-purple"
                  style={{ padding: '6px 8px', fontSize: '12px' }}
                  title="Báo cáo tiến độ học tập của bé dành cho phụ huynh"
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
                  style={{ padding: '6px 8px', fontSize: '12px' }}
                  title="Quản trị dữ liệu game (Chỉ dành cho Admin)"
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
              style={{ padding: '5px 10px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}
              title="Đăng ký hoặc đăng nhập tài khoản"
            >
              <User size={14} />
              <span>Đăng Nhập</span>
            </button>
          )}

          <button 
            onClick={onToggleMute}
            className="btn-kid btn-blue"
            style={{ width: '32px', height: '32px', padding: 0 }}
            title={isMuted ? 'Bật âm thanh' : 'Tắt âm thanh'}
          >
            {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>
        </div>
      </div>
    </header>
  );
}
