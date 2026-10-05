import React from 'react';
import { BookOpen, Calculator, Puzzle, Heart, Sparkles, ArrowRight, Lock } from 'lucide-react';
import { sounds } from '../utils/sound';

export default function WorldMap({ onSelectRealm, pet, currentUser, onOpenAuth }) {
  const realms = [
    {
      id: 'language',
      title: 'Thung Lũng Ngôn Ngữ',
      subVN: 'Tiếng Việt & Tiếng Anh Song Ngữ',
      desc: 'Học từ vựng, nghe phát âm chuẩn và ghép chữ cái kỳ diệu!',
      icon: <BookOpen size={36} color="#ffffff" />,
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
      icon: <Calculator size={36} color="#ffffff" />,
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
      icon: <Puzzle size={36} color="#ffffff" />,
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
      icon: <Heart size={36} color="#ffffff" />,
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
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '24px 16px' }}>
      {/* Banner: Hiển thị trạng thái theo người dùng */}
      {!currentUser ? (
        <div 
          className="kid-card"
          style={{
            padding: '24px',
            marginBottom: '32px',
            background: 'linear-gradient(135deg, #ffffff 0%, #eff6ff 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '16px',
            border: '4px solid #bfdbfe'
          }}
        >
          <div style={{ flex: 1, minWidth: '260px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#dbeafe', color: '#1d4ed8', padding: '4px 12px', borderRadius: '999px', fontSize: '13px', fontWeight: 800, marginBottom: '8px' }}>
              <Lock size={14} /> Khu Vực Yêu Cầu Đăng Nhập
            </div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '24px', color: '#1e293b', fontWeight: 800, margin: '4px 0 8px' }}>
              Chào mừng bạn đến với Vương Quốc Tí Hon!
            </h2>
            <p style={{ color: '#475569', fontSize: '14px', fontWeight: 600, margin: 0, maxWidth: '600px', lineHeight: 1.5 }}>
              Bé và ba mẹ vui lòng <strong>Đăng Nhập</strong> hoặc <strong>Tạo Tài Khoản</strong> để bắt đầu các thử thách, nhận Sao Vàng ⭐, tích Xu Vàng 🪙 và lưu giữ tiến độ an toàn trên đám mây nhé!
            </p>
          </div>

          <button
            onClick={() => { sounds.playClick(); if (onOpenAuth) onOpenAuth(); }}
            className="btn-kid btn-green"
            style={{ padding: '12px 24px', fontSize: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <Sparkles size={18} />
            <span>Đăng Nhập Để Chơi Ngay 🚀</span>
          </button>
        </div>
      ) : (
        <div 
          className="kid-card"
          style={{
            padding: '24px',
            marginBottom: '32px',
            background: 'linear-gradient(135deg, #ffffff 0%, #f0fdf4 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '16px',
            border: '4px solid #bbf7d0'
          }}
        >
          <div style={{ flex: 1, minWidth: '260px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#dcfce7', color: '#15803d', padding: '4px 12px', borderRadius: '999px', fontSize: '13px', fontWeight: 800, marginBottom: '8px' }}>
              <Sparkles size={14} /> Chào mừng {currentUser.user_metadata?.full_name || 'Bé Thám Hiểm'}!
            </div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '26px', color: '#1e293b', fontWeight: 800 }}>
              Hôm nay bé muốn khám phá vùng đất nào?
            </h2>
            <p style={{ color: '#475569', fontSize: '15px', fontWeight: 600, marginTop: '4px' }}>
              Mỗi câu trả lời đúng sẽ mang về Sao Vàng 🌟 và Tiền Xu 🪙 để chăm sóc thú cưng nhé!
            </p>
          </div>

          {/* Pet Peek */}
          {pet && (
            <div 
              onClick={() => handleSelect('pet')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                background: '#fffbeb',
                padding: '12px 20px',
                borderRadius: '20px',
                border: '3px solid #fde68a',
                cursor: 'pointer'
              }}
              className="animate-wiggle"
            >
              <span style={{ fontSize: '36px' }}>{pet.emoji}</span>
              <div>
                <div style={{ fontSize: '12px', fontWeight: 700, color: '#b45309' }}>Bạn đồng hành</div>
                <div style={{ fontSize: '16px', fontWeight: 800, color: '#78350f' }}>{pet.name}</div>
                <div style={{ fontSize: '12px', color: '#16a34a', fontWeight: 700 }}>Độ vui: {pet.happiness}% ❤️</div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Grid 4 Vùng Đất */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '24px'
      }}>
        {realms.map((realm) => (
          <div
            key={realm.id}
            onClick={() => handleSelect(realm.id)}
            style={{
              background: '#ffffff',
              borderRadius: '28px',
              padding: '24px',
              cursor: 'pointer',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: `0 8px 0 ${realm.shadowColor}, 0 20px 25px rgba(0, 0, 0, 0.1)`,
              border: '4px solid #ffffff',
              transition: 'all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              minHeight: '220px',
              opacity: currentUser ? 1 : 0.95
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-6px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            {/* Top Row: Icon + Mascot + Badge */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '20px',
                background: realm.gradient,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 6px 12px rgba(0,0,0,0.15)'
              }}>
                {realm.icon}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px' }}>
                <span style={{ fontSize: '36px' }} className="animate-bounce-slow">
                  {realm.mascotEmoji}
                </span>
                <span style={{
                  fontSize: '11px',
                  fontWeight: 800,
                  padding: '3px 10px',
                  borderRadius: '999px',
                  background: currentUser ? '#f1f5f9' : '#fee2e2',
                  color: currentUser ? '#475569' : '#dc2626'
                }}>
                  {currentUser ? realm.badge : '🔒 Cần đăng nhập'}
                </span>
              </div>
            </div>

            {/* Content */}
            <div style={{ marginTop: '16px' }}>
              <h3 style={{
                fontFamily: 'var(--font-display)',
                fontSize: '22px',
                fontWeight: 800,
                color: '#1e293b',
                lineHeight: 1.2
              }}>
                {realm.title}
              </h3>
              <div style={{ fontSize: '13px', fontWeight: 700, color: realm.themeColor, marginTop: '2px' }}>
                {realm.subVN}
              </div>
              <p style={{ fontSize: '13px', color: '#64748b', marginTop: '6px', fontWeight: 600 }}>
                {realm.desc}
              </p>
            </div>

            {/* Bottom Action */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: '16px',
              paddingTop: '12px',
              borderTop: '2px dashed #f1f5f9'
            }}>
              <span style={{
                fontSize: '14px',
                fontWeight: 800,
                color: currentUser ? realm.themeColor : '#64748b',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                {currentUser ? (
                  <span>Khám phá ngay</span>
                ) : (
                  <>
                    <Lock size={15} />
                    <span>Đăng nhập để mở khóa</span>
                  </>
                )}
              </span>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: currentUser ? realm.gradient : '#e2e8f0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: currentUser ? '#ffffff' : '#64748b'
              }}>
                {currentUser ? <ArrowRight size={16} /> : <Lock size={15} />}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

