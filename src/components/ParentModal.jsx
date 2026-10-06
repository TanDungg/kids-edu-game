import React, { useState } from 'react';
import { X, Lock, CheckCircle2, BarChart3, Star, Coins, Award, Heart, BookOpen, Calculator, Puzzle, Sparkles, RefreshCcw } from 'lucide-react';
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
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [num1] = useState(Math.floor(Math.random() * 6) + 5); // 5 - 10
  const [num2] = useState(Math.floor(Math.random() * 5) + 3); // 3 - 7
  const [parentInput, setParentInput] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleUnlock = (e) => {
    e.preventDefault();
    if (parseInt(parentInput, 10) === num1 + num2) {
      sounds.playSuccess();
      setIsUnlocked(true);
      setErrorMessage('');
    } else {
      sounds.playError();
      setErrorMessage('Kết quả chưa đúng, vui lòng thử lại.');
    }
  };

  const handleClose = () => {
    sounds.playClick();
    setIsUnlocked(false);
    setParentInput('');
    setErrorMessage('');
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
          padding: '24px',
          position: 'relative',
          maxHeight: '92vh',
          overflowY: 'auto',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
        }}
      >
        {/* Top Gradient Stripe */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '8px',
          background: 'linear-gradient(90deg, #ec4899, #8b5cf6, #3b82f6, #10b981)'
        }} />

        {/* Close Button */}
        <button 
          onClick={handleClose}
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
          <X size={20} />
        </button>

        {/* LOCKED STATE: Math Security Gate */}
        {!isUnlocked ? (
          <div style={{ textAlign: 'center', padding: '30px 12px' }}>
            <div style={{
              width: '72px',
              height: '72px',
              borderRadius: '50%',
              background: '#ede9fe',
              color: '#7c3aed',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
              boxShadow: '0 8px 16px rgba(124, 58, 237, 0.15)'
            }}>
              <Lock size={36} />
            </div>

            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '24px', fontWeight: 800, color: '#1e293b', marginBottom: '6px' }}>
              Cổng Bảo Vệ Phụ Huynh
            </h3>
            <p style={{ color: '#64748b', fontSize: '14px', maxWidth: '380px', margin: '0 auto 20px', lineHeight: 1.5 }}>
              Để bảo đảm bé không vô tình thay đổi cài đặt, xin vui lòng hoàn thành phép tính dưới đây:
            </p>

            <form onSubmit={handleUnlock} style={{ maxWidth: '280px', margin: '0 auto' }}>
              <div style={{
                fontSize: '32px',
                fontWeight: 900,
                color: '#4338ca',
                background: '#e0e7ff',
                padding: '14px',
                borderRadius: '18px',
                marginBottom: '16px',
                letterSpacing: '2px'
              }}>
                {num1} + {num2} = ?
              </div>

              <input 
                type="number" 
                autoFocus
                placeholder="Nhập kết quả"
                value={parentInput}
                onChange={(e) => setParentInput(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '14px',
                  border: '2px solid #cbd5e1',
                  fontSize: '18px',
                  textAlign: 'center',
                  fontWeight: 700,
                  outline: 'none',
                  marginBottom: '12px',
                  boxSizing: 'border-box'
                }}
              />

              {errorMessage && (
                <div style={{ color: '#dc2626', fontSize: '13px', fontWeight: 700, marginBottom: '12px' }}>
                  {errorMessage}
                </div>
              )}

              <button type="submit" className="btn-kid btn-purple" style={{ width: '100%', padding: '12px', fontSize: '16px' }}>
                Xác nhận mở khóa 🔓
              </button>
            </form>
          </div>
        ) : (
          /* UNLOCKED STATE: Comprehensive Learning Analytics for Parents */
          <div>
            {/* Header Title */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', paddingRight: '40px' }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '12px',
                background: '#ede9fe',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#7c3aed'
              }}>
                <BarChart3 size={24} />
              </div>
              <div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: 800, color: '#1e293b', margin: 0 }}>
                  Báo Cáo Học Tập & Tiến Trình Của Bé
                </h3>
                <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 600 }}>
                  Theo dõi kết quả học tập, độ chính xác và định hướng phát triển
                </span>
              </div>
            </div>

            {/* General Overview Summary */}
            <div style={{
              background: 'linear-gradient(135deg, #f8fafc 0%, #eff6ff 100%)',
              border: '2px solid #dbeafe',
              borderRadius: '20px',
              padding: '16px',
              marginBottom: '20px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
                <div>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: '#3b82f6' }}>DANH HIỆU CỦA BÉ</div>
                  <div style={{ fontSize: '17px', fontWeight: 800, color: '#1e293b' }}>{getRankTitle(level)}</div>
                </div>
                <div style={{
                  background: '#dcfce7',
                  color: '#15803d',
                  padding: '4px 12px',
                  borderRadius: '999px',
                  fontSize: '12px',
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  <CheckCircle2 size={14} />
                  <span>Độ chính xác tổng: {overallRate}%</span>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', textAlign: 'center' }}>
                <div style={{ background: '#ffffff', padding: '10px 4px', borderRadius: '14px', border: '1.5px solid #bfdbfe' }}>
                  <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 700 }}>Cấp độ</div>
                  <div style={{ fontSize: '18px', fontWeight: 800, color: '#0284c7' }}>Cấp {level}</div>
                </div>
                <div style={{ background: '#ffffff', padding: '10px 4px', borderRadius: '14px', border: '1.5px solid #fef08a' }}>
                  <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 700 }}>Sao Vàng</div>
                  <div style={{ fontSize: '18px', fontWeight: 800, color: '#eab308' }}>⭐ {stars}</div>
                </div>
                <div style={{ background: '#ffffff', padding: '10px 4px', borderRadius: '14px', border: '1.5px solid #fde68a' }}>
                  <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 700 }}>Tiền Xu</div>
                  <div style={{ fontSize: '18px', fontWeight: 800, color: '#d97706' }}>🪙 {coins}</div>
                </div>
                <div style={{ background: '#ffffff', padding: '10px 4px', borderRadius: '14px', border: '1.5px solid #bbf7d0' }}>
                  <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 700 }}>Đã làm</div>
                  <div style={{ fontSize: '18px', fontWeight: 800, color: '#16a34a' }}>{totalCompleted} câu</div>
                </div>
              </div>
            </div>

            {/* Subject Breakdown Details */}
            <div style={{ marginBottom: '20px' }}>
              <h4 style={{ fontSize: '15px', fontWeight: 800, color: '#334155', marginBottom: '10px' }}>
                Chi Tiết Từng Vùng Đất Học Tập:
              </h4>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {/* 1. Ngôn ngữ */}
                <div style={{
                  background: '#ffffff',
                  border: '2px solid #fce7f3',
                  borderRadius: '16px',
                  padding: '12px 16px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ background: '#fdf2f8', padding: '6px', borderRadius: '10px', color: '#db2777' }}>
                        <BookOpen size={18} />
                      </div>
                      <div>
                        <div style={{ fontSize: '14px', fontWeight: 800, color: '#831843' }}>Thung Lũng Ngôn Ngữ</div>
                        <div style={{ fontSize: '11px', color: '#9d174d', fontWeight: 600 }}>Từ vựng & Ghép chữ song ngữ Việt - Anh</div>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '14px', fontWeight: 800, color: '#db2777' }}>
                        {langCompleted} câu
                      </span>
                      <div style={{ fontSize: '11px', color: '#be185d', fontWeight: 700 }}>{langRate}% chính xác</div>
                    </div>
                  </div>
                  {/* Progress Bar */}
                  <div style={{ width: '100%', height: '8px', background: '#fce7f3', borderRadius: '999px', overflow: 'hidden' }}>
                    <div style={{ width: `${langRate}%`, height: '100%', background: 'linear-gradient(90deg, #f472b6, #db2777)', borderRadius: '999px', transition: 'width 0.5s ease' }} />
                  </div>
                </div>

                {/* 2. Toán học */}
                <div style={{
                  background: '#ffffff',
                  border: '2px solid #d1fae5',
                  borderRadius: '16px',
                  padding: '12px 16px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ background: '#ecfdf5', padding: '6px', borderRadius: '10px', color: '#059669' }}>
                        <Calculator size={18} />
                      </div>
                      <div>
                        <div style={{ fontSize: '14px', fontWeight: 800, color: '#064e3b' }}>Nông Trại Số Học</div>
                        <div style={{ fontSize: '11px', color: '#065f46', fontWeight: 600 }}>Đếm quả, phép cộng & so sánh lớn nhỏ</div>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '14px', fontWeight: 800, color: '#059669' }}>
                        {mathCompleted} câu
                      </span>
                      <div style={{ fontSize: '11px', color: '#047857', fontWeight: 700 }}>{mathRate}% chính xác</div>
                    </div>
                  </div>
                  {/* Progress Bar */}
                  <div style={{ width: '100%', height: '8px', background: '#d1fae5', borderRadius: '999px', overflow: 'hidden' }}>
                    <div style={{ width: `${mathRate}%`, height: '100%', background: 'linear-gradient(90deg, #34d399, #059669)', borderRadius: '999px', transition: 'width 0.5s ease' }} />
                  </div>
                </div>

                {/* 3. Logic */}
                <div style={{
                  background: '#ffffff',
                  border: '2px solid #ede9fe',
                  borderRadius: '16px',
                  padding: '12px 16px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ background: '#f5f3ff', padding: '6px', borderRadius: '10px', color: '#7c3aed' }}>
                        <Puzzle size={18} />
                      </div>
                      <div>
                        <div style={{ fontSize: '14px', fontWeight: 800, color: '#3b0764' }}>Tháp Bí Ẩn Logic</div>
                        <div style={{ fontSize: '11px', color: '#581c87', fontWeight: 600 }}>Quy luật chuỗi hình & câu đố tư duy</div>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '14px', fontWeight: 800, color: '#7c3aed' }}>
                        {logicCompleted} câu
                      </span>
                      <div style={{ fontSize: '11px', color: '#6d28d9', fontWeight: 700 }}>{logicRate}% chính xác</div>
                    </div>
                  </div>
                  {/* Progress Bar */}
                  <div style={{ width: '100%', height: '8px', background: '#ede9fe', borderRadius: '999px', overflow: 'hidden' }}>
                    <div style={{ width: `${logicRate}%`, height: '100%', background: 'linear-gradient(90deg, #a78bfa, #7c3aed)', borderRadius: '999px', transition: 'width 0.5s ease' }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Pet Companionship Status */}
            {pet && (
              <div style={{
                background: '#fffbeb',
                border: '2px solid #fde68a',
                borderRadius: '18px',
                padding: '14px',
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '12px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '36px' }}>{pet.emoji}</span>
                  <div>
                    <div style={{ fontSize: '12px', fontWeight: 700, color: '#b45309' }}>BẠN ĐỒNG HÀNH</div>
                    <div style={{ fontSize: '16px', fontWeight: 800, color: '#78350f' }}>{pet.name}</div>
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
              padding: '14px',
              marginBottom: '20px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#166534', fontWeight: 800, fontSize: '13px', marginBottom: '6px' }}>
                <Sparkles size={16} />
                <span>Gợi Ý Dành Cho Ba Mẹ Đồng Hành Cùng Bé:</span>
              </div>
              <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '12px', color: '#14532d', lineHeight: 1.6, fontWeight: 600 }}>
                <li>Mỗi ngày nên cho bé vừa học vừa chơi khoảng <strong>20 - 30 phút</strong> để hình thành phản xạ tư duy mà không mỏi mắt.</li>
                <li>Hãy cùng bé đọc to từ vựng tiếng Anh khi hoàn thành câu ghép chữ ở Thung Lũng Ngôn Ngữ nhé!</li>
                <li>Khen ngợi bé mỗi khi thăng cấp để tạo động lực học tập tự nhiên và hào hứng hơn.</li>
              </ul>
            </div>

            {/* Bottom Actions */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '12px', borderTop: '2px solid #f1f5f9' }}>
              <button
                type="button"
                onClick={handleResetClick}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#94a3b8',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#ef4444'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#94a3b8'}
              >
                <RefreshCcw size={13} />
                <span>Đặt lại dữ liệu học tập</span>
              </button>

              <button
                onClick={handleClose}
                className="btn-kid btn-purple"
                style={{ padding: '8px 24px', fontSize: '14px' }}
              >
                Đóng Báo Cáo
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
