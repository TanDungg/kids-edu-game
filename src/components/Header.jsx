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
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '12px 20px',
      background: 'rgba(255, 255, 255, 0.85)',
      backdropFilter: 'blur(10px)',
      boxShadow: '0 4px 15px rgba(0, 0, 0, 0.08)',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      borderBottom: '3px solid #e2e8f0'
    }}>
      {/* Left: Home / App Brand */}
      <div 
        onClick={onGoHome}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          cursor: 'pointer'
        }}
      >
        <span style={{ fontSize: '32px' }} className="animate-bounce-slow">🚀</span>
        <div>
          <h1 style={{ 
            fontFamily: 'var(--font-display)', 
            fontSize: '20px', 
            fontWeight: 800,
            background: 'linear-gradient(45deg, #0284c7, #9333ea)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            lineHeight: 1.1
          }}>
            Vương Quốc Tí Hon
          </h1>
          <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748b' }}>
            Học Vui &middot; Luyện Trí Tuệ
          </span>
        </div>
      </div>

      {/* Middle: Player Stats (Only visible when user is logged in) */}
      {currentUser ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Level Badge */}
          <div className="stat-pill" style={{ background: '#fef08a', color: '#854d0e', borderColor: '#facc15' }}>
            <span style={{ fontSize: '13px' }}>Cấp {level}</span>
          </div>

          {/* Stars */}
          <div className="stat-pill" style={{ color: '#d97706', borderColor: '#fde047' }}>
            <Star size={18} fill="#facc15" color="#ca8a04" />
            <span style={{ fontSize: '15px' }}>{stars}</span>
          </div>

          {/* Coins */}
          <div className="stat-pill" style={{ color: '#b45309', borderColor: '#fcd34d' }}>
            <Coins size={18} fill="#fbbf24" color="#d97706" />
            <span style={{ fontSize: '15px' }}>{coins}</span>
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            background: '#f8fafc',
            border: '1.5px solid #e2e8f0',
            color: '#64748b',
            padding: '4px 14px',
            borderRadius: '999px',
            fontSize: '12px',
            fontWeight: 700
          }}>
            <span>🔒</span>
            <span>Chưa đăng nhập &middot; Đăng nhập để lưu tiến độ</span>
          </div>
        </div>
      )}

      {/* Right Controls: User Auth, Sound & Parent Gate */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {currentUser ? (
          <>
            <button 
              onClick={onOpenProfile}
              className="btn-kid"
              style={{
                padding: '6px 12px',
                fontSize: '13px',
                background: '#f0fdf4',
                border: '2px solid #86efac',
                color: '#15803d',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
              title="Xem hồ sơ và đồng bộ đám mây"
            >
              <div style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                overflow: 'hidden',
                background: '#e0f2fe',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1.5px solid #38bdf8'
              }}>
                <img 
                  src={currentUser.user_metadata?.avatar_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(currentUser.email || 'user')}`} 
                  alt="Avatar" 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              </div>
              <span style={{ maxWidth: '90px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontWeight: 800 }}>
                {currentUser.user_metadata?.full_name || currentUser.email?.split('@')[0] || 'Bé Thám Hiểm'}
              </span>
            </button>

            {/* Quản lý Phụ Huynh: Chỉ hiển thị khi ĐÃ ĐĂNG NHẬP (cho người dùng thường / phụ huynh) */}
            {!isAdmin && (
              <button 
                onClick={onOpenParent}
                className="btn-kid btn-purple"
                style={{ padding: '8px 14px', fontSize: '13px' }}
                title="Báo cáo tiến độ học tập của bé dành cho phụ huynh"
              >
                <ShieldCheck size={16} />
                <span>Phụ Huynh</span>
              </button>
            )}

            {/* Quản trị Admin: Chỉ hiển thị cho tài khoản Quản trị viên */}
            {isAdmin && (
              <button 
                onClick={onOpenAdmin}
                className="btn-kid btn-yellow"
                style={{ padding: '8px 14px', fontSize: '13px' }}
                title="Quản trị dữ liệu game (Chỉ dành cho Admin)"
              >
                <Settings size={16} />
                <span>Quản Trị</span>
              </button>
            )}
          </>
        ) : (
          <button 
            onClick={onOpenAuth}
            className="btn-kid btn-green"
            style={{ padding: '8px 16px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}
            title="Đăng ký hoặc đăng nhập tài khoản (Google / Email)"
          >
            <User size={16} />
            <span>Đăng Nhập / Đăng Ký</span>
          </button>
        )}

        <button 
          onClick={onToggleMute}
          className="btn-kid btn-blue"
          style={{ width: '40px', height: '40px', padding: 0 }}
          title={isMuted ? 'Bật âm thanh' : 'Tắt âm thanh'}
        >
          {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
        </button>
      </div>
    </header>
  );
}
