import React from 'react';
import { BookOpen, Calculator, Puzzle, Heart, Sparkles, ArrowRight, Lock, Trophy, Award } from 'lucide-react';
import { sounds } from '../utils/sound';

export default function WorldMap({ onSelectRealm, pet, currentUser, onOpenAuth }) {
  const realms = [
    {
      id: 'language',
      title: 'Thung Lũng Ngôn Ngữ',
      subVN: 'Tiếng Việt & Tiếng Anh Song Ngữ',
      desc: 'Học từ vựng, nghe phát âm chuẩn và ghép chữ cái kỳ diệu!',
      icon: <BookOpen size={30} color="#ffffff" />,
      themeColor: '#ec4899',
      gradient: 'linear-gradient(135deg, #f472b6 0%, #db2777 100%)',
      shadowColor: '#be185d',
      mascotEmoji: '🦜',
      badge: 'Song Ngữ'
    },
    {
      id: 'math',
      title: 'Nông Trại Số Học',
      subVN: 'Toán Tư Duy & Đếm Số',
      desc: 'Đếm quả chín, phép cộng kẹo ngọt và so sánh lớn nhỏ!',
      icon: <Calculator size={30} color="#ffffff" />,
      themeColor: '#10b981',
      gradient: 'linear-gradient(135deg, #34d399 0%, #059669 100%)',
      shadowColor: '#047857',
      mascotEmoji: '🍎',
      badge: 'Toán Vui'
    },
    {
      id: 'logic',
      title: 'Tháp Bí Ẩn Logic',
      subVN: 'Tư Duy & Giải Đố',
      desc: 'Khám phá quy luật chuỗi hình, tìm điểm khác biệt và thử thách trí tuệ!',
      icon: <Puzzle size={30} color="#ffffff" />,
      themeColor: '#8b5cf6',
      gradient: 'linear-gradient(135deg, #a78bfa 0%, #7c3aed 100%)',
      shadowColor: '#6d28d9',
      mascotEmoji: '🔮',
      badge: 'Siêu Trí Tuệ'
    },
    {
      id: 'pet',
      title: 'Góc Thú Cưng',
      subVN: 'Nuôi Thú & Cửa Hàng Xu',
      desc: `Chăm sóc ${pet ? pet.name : 'thú cưng'}, cho ăn kem ngon và mua mũ đẹp!`,
      icon: <Heart size={30} color="#ffffff" />,
      themeColor: '#f59e0b',
      gradient: 'linear-gradient(135deg, #fbbf24 0%, #d97706 100%)',
      shadowColor: '#b45309',
      mascotEmoji: pet ? pet.emoji : '🐱',
      badge: 'Thưởng Xu'
    }
  ];

  const handleSelect = (id) => {
    sounds.playClick();
    if (!currentUser) {
      if (onOpenAuth) onOpenAuth();
      return;
    }
    onSelectRealm(id);
  };

  return (
    <div className="page-container" style={{ maxWidth: '850px', paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 24px)' }}>
      {/* Banner: Guest vs Logged-In User */}
      {!currentUser ? (
        <div 
          className="kid-card animate-pop-in"
          style={{
            padding: 'clamp(16px, 4vw, 22px)',
            marginBottom: '16px',
            background: 'linear-gradient(135deg, #ffffff 0%, #f0f9ff 60%, #fdf2f8 100%)',
            borderRadius: '24px',
            border: '2.5px solid #bae6fd',
            boxShadow: '0 10px 25px -5px rgba(2, 132, 199, 0.12)',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          {/* Top Decorative Sparkle Tag */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px', flexWrap: 'wrap', gap: '6px' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
              background: '#e0f2fe',
              color: '#0284c7',
              padding: '4px 12px',
              borderRadius: '999px',
              fontSize: '11.5px',
              fontWeight: 800,
              border: '1px solid #bae6fd'
            }}>
              <span>🚀</span> <span>Vương Quốc Học Vui Dành Cho Bé</span>
            </div>

            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              background: '#fef3c7',
              color: '#b45309',
              padding: '3px 10px',
              borderRadius: '999px',
              fontSize: '11px',
              fontWeight: 800,
              border: '1px solid #fde68a'
            }}>
              <span>☁️</span> <span>Lưu Trữ Đám Mây</span>
            </div>
          </div>

          {/* Hero Content with Mascot */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: '220px' }}>
              <h2 style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(17px, 4.5vw, 22px)',
                color: '#0f172a',
                fontWeight: 900,
                margin: '0 0 6px',
                lineHeight: 1.25
              }}>
                Chào Mừng Bé Đến Thế Giới Học Vui! 🌟
              </h2>
              <p style={{ color: '#475569', fontSize: '12.5px', fontWeight: 600, margin: '0 0 10px', lineHeight: 1.45 }}>
                Ghép chữ song ngữ Anh - Việt, rèn tư duy toán học và nuôi thú cưng diệu kỳ cùng ba mẹ!
              </p>

              {/* 3 Quick Benefit Chips */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '14px' }}>
                <span style={{ fontSize: '11px', fontWeight: 800, color: '#ca8a04', background: '#fefce8', border: '1px solid #fef08a', padding: '2px 8px', borderRadius: '8px', display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                  ⭐ Tích Sao Vàng
                </span>
                <span style={{ fontSize: '11px', fontWeight: 800, color: '#ea580c', background: '#fff7ed', border: '1px solid #fed7aa', padding: '2px 8px', borderRadius: '8px', display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                  🪙 Tích Xu Đổi Quà
                </span>
                <span style={{ fontSize: '11px', fontWeight: 800, color: '#059669', background: '#ecfdf5', border: '1px solid #a7f3d0', padding: '2px 8px', borderRadius: '8px', display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                  ☁️ Tự Động Lưu Dữ Liệu
                </span>
              </div>
            </div>

            {/* Mascot Visual */}
            <div style={{
              fontSize: 'clamp(44px, 10vw, 56px)',
              lineHeight: 1,
              flexShrink: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }} className="animate-bounce-slow">
              🧸
            </div>
          </div>

          {/* Prominent Single-Line CTA Button */}
          <button
            type="button"
            onClick={() => { sounds.playClick(); if (onOpenAuth) onOpenAuth(); }}
            style={{
              width: '100%',
              padding: '12px 18px',
              fontSize: 'clamp(13.5px, 3.8vw, 15.5px)',
              fontWeight: 900,
              fontFamily: 'var(--font-display)',
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              color: '#ffffff',
              border: 'none',
              borderRadius: '16px',
              boxShadow: '0 4px 14px rgba(16, 185, 129, 0.35)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              whiteSpace: 'nowrap',
              boxSizing: 'border-box'
            }}
          >
            <Sparkles size={16} />
            <span>Đăng Nhập / Đăng Ký Để Chơi Ngay 🚀</span>
          </button>
        </div>
      ) : (
        <>
          {/* Greeting Banner */}
          <div 
            className="kid-card"
            style={{
              padding: 'clamp(12px, 3vw, 18px)',
              marginBottom: '14px',
              background: 'linear-gradient(135deg, #ffffff 0%, #f0fdf4 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '10px',
              border: '2.5px solid #bbf7d0'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '42px',
                height: '42px',
                borderRadius: '50%',
                background: '#dcfce7',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '22px',
                flexShrink: 0,
                border: '2px solid #86efac'
              }}>
                ✨
              </div>
              <div>
                <div style={{ fontSize: 'clamp(14px, 3.8vw, 17px)', fontWeight: 900, color: '#1e293b', lineHeight: 1.2 }}>
                  Chào {currentUser.user_metadata?.full_name || 'Bé Thám Hiểm'}!
                </div>
                <div style={{ fontSize: 'clamp(11.5px, 3vw, 13px)', color: '#16a34a', fontWeight: 700, marginTop: '2px' }}>
                  Hôm nay bé muốn khám phá vùng đất nào? 🌟
                </div>
              </div>
            </div>

            {pet && (
              <div 
                onClick={() => handleSelect('pet')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: '#fffbeb',
                  padding: '6px 12px',
                  borderRadius: '999px',
                  border: '2px solid #fde68a',
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: 900,
                  color: '#b45309',
                  flexShrink: 0,
                  boxShadow: '0 2px 6px rgba(245, 158, 11, 0.15)'
                }}
                title="Chăm sóc thú cưng"
              >
                <span style={{ fontSize: '18px' }} className="animate-wiggle">{pet.emoji}</span>
                <span className="hide-on-mobile">{pet.name}</span>
                <span style={{ color: '#ea580c' }}>{pet.happiness || 100}% ❤️</span>
              </div>
            )}
          </div>
        </>
      )}

      {/* Grid 4 Vùng Đất: 2x2 on Mobile, Well-proportioned */}
      <div className="world-grid">
        {realms.map((realm) => (
          <div
            key={realm.id}
            onClick={() => handleSelect(realm.id)}
            className="world-card kid-card"
            style={{
              background: '#ffffff',
              borderRadius: '24px',
              padding: 'clamp(14px, 3.5vw, 20px)',
              cursor: 'pointer',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: `0 6px 0 ${realm.shadowColor}, 0 16px 22px rgba(0, 0, 0, 0.08)`,
              border: '3.5px solid #ffffff',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              minHeight: 'clamp(160px, 24vh, 210px)',
              boxSizing: 'border-box'
            }}
          >
            {/* Top Row: Icon + Mascot + Badge */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div 
                className="world-card-icon"
                style={{
                  width: 'clamp(46px, 11vw, 56px)',
                  height: 'clamp(46px, 11vw, 56px)',
                  borderRadius: '16px',
                  background: realm.gradient,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 10px rgba(0,0,0,0.15)',
                  flexShrink: 0
                }}
              >
                {realm.icon}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '3px' }}>
                <span className="world-card-mascot animate-bounce-slow" style={{ fontSize: 'clamp(28px, 6.5vw, 36px)' }}>
                  {realm.mascotEmoji}
                </span>
                <span 
                  className="world-card-badge"
                  style={{
                    fontSize: '10.5px',
                    fontWeight: 900,
                    padding: '2px 8px',
                    borderRadius: '999px',
                    background: currentUser ? '#f1f5f9' : '#faf5ff',
                    color: currentUser ? '#475569' : '#7c3aed',
                    border: currentUser ? '1px solid #e2e8f0' : '1px solid #e9d5ff',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {currentUser ? realm.badge : '✨ Mở khóa'}
                </span>
              </div>
            </div>

            {/* Content */}
            <div style={{ marginTop: '10px' }}>
              <h3 
                className="world-card-title"
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(14.5px, 3.8vw, 18px)',
                  fontWeight: 900,
                  color: '#1e293b',
                  lineHeight: 1.25,
                  margin: 0
                }}
              >
                {realm.title}
              </h3>
              <div 
                className="world-card-sub"
                style={{ fontSize: 'clamp(11.5px, 2.8vw, 13px)', fontWeight: 800, color: realm.themeColor, marginTop: '3px' }}
              >
                {realm.subVN}
              </div>
              <p 
                className="world-card-desc hide-on-mobile"
                style={{ fontSize: '12.5px', color: '#64748b', marginTop: '6px', fontWeight: 600, lineHeight: 1.35 }}
              >
                {realm.desc}
              </p>
            </div>

            {/* Bottom Quick Tap Arrow on Mobile & Desktop */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: '10px',
              paddingTop: '8px',
              borderTop: '1.5px dashed #f1f5f9'
            }}>
              <span style={{
                fontSize: '12px',
                fontWeight: 800,
                color: realm.themeColor
              }}>
                {currentUser ? 'Chơi ngay' : 'Khám phá ngay'}
              </span>
              <div style={{
                width: '26px',
                height: '26px',
                borderRadius: '50%',
                background: realm.gradient,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff'
              }}>
                <ArrowRight size={14} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Daily Quests & Quick Play Hub */}
      <div 
        className="kid-card"
        style={{
          marginTop: '14px',
          padding: 'clamp(12px, 3vw, 18px)',
          background: 'linear-gradient(135deg, #ffffff 0%, #fefce8 100%)',
          border: '2.5px solid #fef08a'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '20px' }}>🎯</span>
            <span style={{ fontSize: 'clamp(13px, 3.6vw, 15px)', fontWeight: 900, color: '#854d0e' }}>
              Nhiệm Vụ Rèn Luyện Hôm Nay
            </span>
          </div>
          <span style={{ fontSize: '11.5px', fontWeight: 900, color: '#ca8a04', background: '#fef3c7', padding: '3px 10px', borderRadius: '999px', border: '1px solid #fde68a' }}>
            +30 Xu 🪙
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div 
            onClick={() => handleSelect('language')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '10px 12px',
              background: '#ffffff',
              borderRadius: '14px',
              border: '1.5px solid #fbcfe8',
              cursor: 'pointer',
              boxShadow: '0 2px 4px rgba(0,0,0,0.03)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '18px' }}>📚</span>
              <div>
                <div style={{ fontSize: '12.5px', fontWeight: 800, color: '#1e293b' }}>Thung Lũng Ngôn Ngữ</div>
                <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>Học từ vựng song ngữ & ghép chữ kỳ diệu</div>
              </div>
            </div>
            <span style={{ fontSize: '12px', fontWeight: 900, color: '#ec4899', flexShrink: 0 }}>Vào ➔</span>
          </div>

          <div 
            onClick={() => handleSelect('math')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '10px 12px',
              background: '#ffffff',
              borderRadius: '14px',
              border: '1.5px solid #bbf7d0',
              cursor: 'pointer',
              boxShadow: '0 2px 4px rgba(0,0,0,0.03)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '18px' }}>🔢</span>
              <div>
                <div style={{ fontSize: '12.5px', fontWeight: 800, color: '#1e293b' }}>Nông Trại Số Học</div>
                <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>Đếm số, làm phép tính & so sánh lớn nhỏ</div>
              </div>
            </div>
            <span style={{ fontSize: '12px', fontWeight: 900, color: '#16a34a', flexShrink: 0 }}>Vào ➔</span>
          </div>

          <div 
            onClick={() => handleSelect('logic')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '10px 12px',
              background: '#ffffff',
              borderRadius: '14px',
              border: '1.5px solid #ddd6fe',
              cursor: 'pointer',
              boxShadow: '0 2px 4px rgba(0,0,0,0.03)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '18px' }}>🧩</span>
              <div>
                <div style={{ fontSize: '12.5px', fontWeight: 800, color: '#1e293b' }}>Tháp Bí Ẩn Logic</div>
                <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>Tìm quy luật chuỗi hình & phát triển tư duy</div>
              </div>
            </div>
            <span style={{ fontSize: '12px', fontWeight: 900, color: '#8b5cf6', flexShrink: 0 }}>Vào ➔</span>
          </div>
        </div>
      </div>
    </div>
  );
}
