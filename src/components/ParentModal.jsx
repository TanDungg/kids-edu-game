import React from 'react';
import { X, BarChart3, Star, Coins, Sparkles, RefreshCcw } from 'lucide-react';
import { sounds } from '../utils/sound';

export default function ParentModal({ 
  isOpen, 
  onClose, 
  stats, 
  stars = 5, 
  coins = 30, 
  level = 1, 
  pet, 
  onResetData 
}) {
  if (!isOpen) return null;

  const handleClose = () => {
    sounds.playClick();
    onClose();
  };

  // Calculations for analytics
  const langCompleted = stats?.language?.completed || 0;
  const langCorrect = stats?.language?.correct || 0;
  const langRate = langCompleted > 0 ? Math.round((langCorrect / langCompleted) * 100) : 0;

  const mathCompleted = stats?.math?.completed || 0;
  const mathCorrect = stats?.math?.correct || 0;
  const mathRate = mathCompleted > 0 ? Math.round((mathCorrect / mathCompleted) * 100) : 0;

  const logicCompleted = stats?.logic?.completed || 0;
  const logicCorrect = stats?.logic?.correct || 0;
  const logicRate = logicCompleted > 0 ? Math.round((logicCorrect / logicCompleted) * 100) : 0;

  const totalCompleted = langCompleted + mathCompleted + logicCompleted;
  const totalCorrect = langCorrect + mathCorrect + logicCorrect;
  const overallRate = totalCompleted > 0 ? Math.round((totalCorrect / totalCompleted) * 100) : 0;

  // Title rank based on level
  const getRankTitle = (lvl) => {
    if (lvl >= 10) return 'Đại Hiệp Sĩ Trí Tuệ 👑';
    if (lvl >= 7) return 'Nhà Thám Hiểm Tài Ba 🚀';
    if (lvl >= 4) return 'Ngôi Sao Sáng Tạo ⭐';
    return 'Bé Mầm Non Thám Hiểm 🌱';
  };

  const handleResetClick = () => {
    sounds.playClick();
    if (window.confirm('Ba mẹ có chắc muốn đặt lại toàn bộ tiến độ học tập và điểm số của bé về ban đầu không?')) {
      if (onResetData) {
        onResetData();
      }
      sounds.playSuccess();
      handleClose();
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
          width: '100%',
          maxWidth: '640px',
          background: '#ffffff',
          borderRadius: '28px',
          padding: 0,
          position: 'relative',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
        }}
      >
        {/* ================= FIXED HEADER ================= */}
        <div style={{
          padding: '22px 24px 18px',
          borderBottom: '1.5px solid #f1f5f9',
          background: '#ffffff',
          position: 'relative',
          flexShrink: 0
        }}>
          {/* Top Gradient Stripe */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '6px',
            background: 'linear-gradient(90deg, #ec4899, #8b5cf6, #3b82f6, #10b981)'
          }} />

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                background: '#f5f3ff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#7c3aed',
                flexShrink: 0
              }}>
                <BarChart3 size={24} />
              </div>
              <div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: 800, color: '#1e293b', margin: 0, lineHeight: 1.2 }}>
                  Báo Cáo Học Tập & Tiến Trình Của Bé
                </h3>
                <p style={{ color: '#64748b', fontSize: '13px', margin: '4px 0 0', fontWeight: 500 }}>
                  Theo dõi kết quả học tập, độ chính xác và định hướng phát triển
                </p>
              </div>
            </div>

            <button 
              type="button"
              onClick={handleClose}
              className="btn-kid btn-gray"
              style={{
                width: '38px',
                height: '38px',
                padding: 0,
                borderRadius: '50%',
                flexShrink: 0
              }}
              title="Đóng báo cáo"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* ================= SCROLLABLE BODY ================= */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '20px 24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '18px'
        }}>
          {/* Summary Overview Card */}
          <div style={{
            background: 'linear-gradient(135deg, #eff6ff 0%, #f5f3ff 100%)',
            border: '2px solid #c7d2fe',
            borderRadius: '20px',
            padding: '16px 20px',
            boxShadow: '0 4px 12px rgba(99, 102, 241, 0.08)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
              <div>
                <div style={{ fontSize: '11px', fontWeight: 800, color: '#6366f1', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Danh Hiệu Hiện Tại Của Bé
                </div>
                <div style={{ fontSize: '18px', fontWeight: 900, color: '#1e1b4b', marginTop: '2px' }}>
                  {getRankTitle(level)}
                </div>
              </div>
              <div style={{
                background: '#ffffff',
                border: '1.5px solid #10b981',
                color: '#059669',
                padding: '4px 12px',
                borderRadius: '999px',
                fontWeight: 800,
                fontSize: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '5px'
              }}>
                <span>✓</span>
                <span>Độ chính xác tổng: {overallRate}%</span>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
              <div style={{ background: '#ffffff', padding: '10px 8px', borderRadius: '14px', textAlign: 'center', border: '1.5px solid #bfdbfe' }}>
                <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 700 }}>Cấp độ</div>
                <div style={{ fontSize: '18px', fontWeight: 900, color: '#0284c7' }}>Cấp {level}</div>
              </div>

              <div style={{ background: '#ffffff', padding: '10px 8px', borderRadius: '14px', textAlign: 'center', border: '1.5px solid #fef08a' }}>
                <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 700 }}>Sao Vàng</div>
                <div style={{ fontSize: '18px', fontWeight: 900, color: '#ca8a04', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                  <Star size={16} fill="#facc15" color="#ca8a04" />
                  <span>{stars}</span>
                </div>
              </div>

              <div style={{ background: '#ffffff', padding: '10px 8px', borderRadius: '14px', textAlign: 'center', border: '1.5px solid #fed7aa' }}>
                <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 700 }}>Tiền Xu</div>
                <div style={{ fontSize: '18px', fontWeight: 900, color: '#ea580c', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                  <Coins size={16} fill="#fb923c" color="#ea580c" />
                  <span>{coins}</span>
                </div>
              </div>

              <div style={{ background: '#ffffff', padding: '10px 8px', borderRadius: '14px', textAlign: 'center', border: '1.5px solid #bbf7d0' }}>
                <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 700 }}>Đã làm</div>
                <div style={{ fontSize: '18px', fontWeight: 900, color: '#16a34a' }}>{totalCompleted} câu</div>
              </div>
            </div>
          </div>

          {/* Subject Breakdown Cards */}
          <div>
            <div style={{ fontSize: '14px', fontWeight: 800, color: '#334155', marginBottom: '10px' }}>
              Chi Tiết Từng Vùng Đất Học Tập:
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {/* Language Valley Progress */}
              <div style={{ background: '#ffffff', border: '1.5px solid #fbcfe8', borderRadius: '16px', padding: '14px 16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '20px' }}>📖</span>
                    <div>
                      <div style={{ fontWeight: 800, color: '#9d174d', fontSize: '14px' }}>Thung Lũng Ngôn Ngữ</div>
                      <div style={{ fontSize: '11px', color: '#64748b' }}>Từ vựng & Ghép chữ song ngữ Việt - Anh</div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontWeight: 800, color: '#be185d', fontSize: '14px' }}>{langCompleted} câu</span>
                    <div style={{ fontSize: '11px', color: '#059669', fontWeight: 700 }}>{langRate}% chính xác</div>
                  </div>
                </div>
                <div style={{ width: '100%', height: '8px', background: '#fce7f3', borderRadius: '999px', overflow: 'hidden' }}>
                  <div style={{ width: `${Math.min(langRate, 100)}%`, height: '100%', background: 'linear-gradient(90deg, #f472b6, #db2777)', borderRadius: '999px' }} />
                </div>
              </div>

              {/* Math Farm Progress */}
              <div style={{ background: '#ffffff', border: '1.5px solid #a7f3d0', borderRadius: '16px', padding: '14px 16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '20px' }}>🔢</span>
                    <div>
                      <div style={{ fontWeight: 800, color: '#065f46', fontSize: '14px' }}>Nông Trại Số Học</div>
                      <div style={{ fontSize: '11px', color: '#64748b' }}>Đếm quả, phép cộng & so sánh lớn nhỏ</div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontWeight: 800, color: '#059669', fontSize: '14px' }}>{mathCompleted} câu</span>
                    <div style={{ fontSize: '11px', color: '#059669', fontWeight: 700 }}>{mathRate}% chính xác</div>
                  </div>
                </div>
                <div style={{ width: '100%', height: '8px', background: '#d1fae5', borderRadius: '999px', overflow: 'hidden' }}>
                  <div style={{ width: `${Math.min(mathRate, 100)}%`, height: '100%', background: 'linear-gradient(90deg, #34d399, #059669)', borderRadius: '999px' }} />
                </div>
              </div>

              {/* Logic Tower Progress */}
              <div style={{ background: '#ffffff', border: '1.5px solid #ddd6fe', borderRadius: '16px', padding: '14px 16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '20px' }}>🧩</span>
                    <div>
                      <div style={{ fontWeight: 800, color: '#5b21b6', fontSize: '14px' }}>Tháp Bí Ẩn Logic</div>
                      <div style={{ fontSize: '11px', color: '#64748b' }}>Quy luật chuỗi hình & câu đố tư duy</div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontWeight: 800, color: '#7c3aed', fontSize: '14px' }}>{logicCompleted} câu</span>
                    <div style={{ fontSize: '11px', color: '#059669', fontWeight: 700 }}>{logicRate}% chính xác</div>
                  </div>
                </div>
                <div style={{ width: '100%', height: '8px', background: '#ede9fe', borderRadius: '999px', overflow: 'hidden' }}>
                  <div style={{ width: `${Math.min(logicRate, 100)}%`, height: '100%', background: 'linear-gradient(90deg, #a78bfa, #7c3aed)', borderRadius: '999px' }} />
                </div>
              </div>
            </div>
          </div>

          {/* Pet Companion Status */}
          {pet && (
            <div style={{
              background: '#fefce8',
              border: '2px solid #fef08a',
              borderRadius: '18px',
              padding: '14px 18px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '32px' }}>{pet.emoji || '🐱'}</span>
                <div>
                  <div style={{ fontSize: '11px', fontWeight: 800, color: '#a16207', textTransform: 'uppercase' }}>BẠN ĐỒNG HÀNH</div>
                  <div style={{ fontSize: '15px', fontWeight: 800, color: '#78350f' }}>{pet.name}</div>
                  <div style={{ fontSize: '12px', color: '#15803d', fontWeight: 700 }}>Độ no: {pet.hunger || 80}% &middot; Vui vẻ: {pet.happiness || 90}%</div>
                </div>
              </div>
              <div style={{ fontSize: '12px', color: '#92400e', fontWeight: 600, maxWidth: '240px', lineHeight: 1.4 }}>
                🐾 Bé rất biết yêu thương động vật và dùng xu thưởng học tập để chăm sóc thú cưng!
              </div>
            </div>
          )}

          {/* Pedagogical Advice For Parents */}
          <div style={{
            background: '#f0fdf4',
            border: '2px solid #bbf7d0',
            borderRadius: '18px',
            padding: '16px',
            boxShadow: '0 2px 8px rgba(34, 197, 94, 0.05)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#166534', fontWeight: 800, fontSize: '13px', marginBottom: '8px' }}>
              <Sparkles size={16} />
              <span>Gợi Ý Dành Cho Ba Mẹ Đồng Hành Cùng Bé:</span>
            </div>
            <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '13px', color: '#14532d', lineHeight: 1.6, fontWeight: 500 }}>
              <li>Mỗi ngày nên cho bé vừa học vừa chơi khoảng <strong>20 - 30 phút</strong> để hình thành phản xạ tư duy mà không mỏi mắt.</li>
              <li>Hãy cùng bé đọc to từ vựng tiếng Anh khi hoàn thành câu ghép chữ ở Thung Lũng Ngôn Ngữ nhé!</li>
              <li>Khen ngợi bé mỗi khi thăng cấp để tạo động lực học tập tự nhiên và hào hứng hơn.</li>
            </ul>
          </div>
        </div>

        {/* ================= FIXED FOOTER ================= */}
        <div style={{
          padding: '16px 24px',
          borderTop: '1.5px solid #f1f5f9',
          background: '#f8fafc',
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px'
        }}>
          <button
            type="button"
            onClick={handleResetClick}
            style={{
              background: 'none',
              border: 'none',
              color: '#94a3b8',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'color 0.15s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#ef4444'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#94a3b8'}
          >
            <RefreshCcw size={14} />
            <span>Đặt lại dữ liệu học tập</span>
          </button>

          <button
            type="button"
            onClick={handleClose}
            className="btn-kid btn-purple"
            style={{ padding: '10px 28px', fontSize: '14px', fontWeight: 800 }}
          >
            Đóng Báo Cáo
          </button>
        </div>
      </div>
    </div>
  );
}
