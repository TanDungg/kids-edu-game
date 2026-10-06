import React, { useState } from 'react';
import { X, Lock, BarChart3, BookOpen, Calculator, Puzzle, Heart, Award, Sparkles, RefreshCcw, TrendingUp, CheckCircle, AlertCircle } from 'lucide-react';
import { sounds } from '../utils/sound';

export default function ParentModal({ 
  isOpen, 
  onClose, 
  stats, 
  onResetData,
  stars = 0,
  coins = 0,
  level = 1,
  pet = null,
  currentUser = null
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
      setErrorMessage('Kết quả chưa đúng, ba mẹ vui lòng thử lại nhé.');
    }
  };

  const handleClose = () => {
    sounds.playClick();
    setIsUnlocked(false);
    setParentInput('');
    setErrorMessage('');
    onClose();
  };

  // Tính toán số liệu thống kê chi tiết cho phụ huynh
  const langCompleted = stats?.language?.completed || 0;
  const langCorrect = stats?.language?.correct || 0;
  const langAccuracy = langCompleted > 0 ? Math.round((langCorrect / langCompleted) * 100) : 0;

  const mathCompleted = stats?.math?.completed || 0;
  const mathCorrect = stats?.math?.correct || 0;
  const mathAccuracy = mathCompleted > 0 ? Math.round((mathCorrect / mathCompleted) * 100) : 0;

  const logicCompleted = stats?.logic?.completed || 0;
  const logicCorrect = stats?.logic?.correct || 0;
  const logicAccuracy = logicCompleted > 0 ? Math.round((logicCorrect / logicCompleted) * 100) : 0;

  const totalCompleted = langCompleted + mathCompleted + logicCompleted;
  const totalCorrect = langCorrect + mathCorrect + logicCorrect;
  const overallAccuracy = totalCompleted > 0 ? Math.round((totalCorrect / totalCompleted) * 100) : 100;

  // Đánh giá thế mạnh của bé
  const getTopSubject = () => {
    if (totalCompleted === 0) return 'Bé mới bắt đầu hành trình khám phá';
    if (langCompleted >= mathCompleted && langCompleted >= logicCompleted) {
      return 'Tiếng Anh & Ngôn Ngữ (Bé rất có khiếu nhớ từ vựng và mặt chữ!)';
    }
    if (mathCompleted >= langCompleted && mathCompleted >= logicCompleted) {
      return 'Toán Học & Số Học (Bé có phản xạ tính toán và đếm số rất nhanh!)';
    }
    return 'Tư Duy Logic (Bé có khả năng quan sát hình khối và phân tích xuất sắc!)';
  };

  const getRecommendation = () => {
    if (totalCompleted === 0) {
      return 'Ba mẹ hãy khuyến khích bé chơi mỗi ngày từ 15-20 phút để phát triển toàn diện tư duy và ngôn ngữ nhé.';
    }
    if (langCompleted === 0) return 'Gợi ý: Ba mẹ hãy nhắc bé ghé thăm Thung Lũng Ngôn Ngữ để làm quen các từ vựng song ngữ thú vị nhé.';
    if (mathCompleted === 0) return 'Gợi ý: Bé chưa thử sức ở Nông Trại Số Học, hãy cùng bé đếm táo và cộng kẹo ngọt nhé.';
    if (logicCompleted === 0) return 'Gợi ý: Tháp Bí Ẩn Logic sẽ giúp bé rèn luyện tính kiên nhẫn và khả năng quan sát hình khối rất tốt.';
    return 'Bé đang học rất đều các môn! Ba mẹ hãy dành những lời khen ngợi để tiếp thêm động lực cho bé nhé!';
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
      zIndex: 100,
      padding: '16px'
    }}>
      <div 
        className="kid-card animate-pop-in"
        style={{
          width: '100%',
          maxWidth: '620px',
          background: '#ffffff',
          borderRadius: '28px',
          padding: '28px 24px',
          position: 'relative',
          maxHeight: '92vh',
          overflowY: 'auto',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
        }}
      >
        {/* Top Accent Gradient */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '8px',
          background: 'linear-gradient(90deg, #9333ea, #6366f1, #3b82f6, #10b981)'
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

        {/* ================= LOCKED STATE: Math Security Gate ================= */}
        {!isUnlocked ? (
          <div style={{ textAlign: 'center', padding: '24px 8px' }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: '#ede9fe',
              color: '#7c3aed',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
              boxShadow: '0 8px 16px rgba(124, 58, 237, 0.15)'
            }}>
              <Lock size={30} />
            </div>

            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '24px', fontWeight: 800, color: '#1e293b' }}>
              Cổng Xác Thực Dành Cho Phụ Huynh
            </h3>
            <p style={{ color: '#64748b', fontSize: '14px', marginTop: '6px', marginBottom: '20px', lineHeight: 1.5 }}>
              Để xem báo cáo tiến trình học tập của bé, ba mẹ vui lòng giải phép tính đơn giản dưới đây:
            </p>

            <form onSubmit={handleUnlock} style={{ maxWidth: '280px', margin: '0 auto' }}>
              <div style={{
                fontSize: '28px',
                fontWeight: 900,
                color: '#4338ca',
                background: '#e0e7ff',
                padding: '12px',
                borderRadius: '16px',
                marginBottom: '16px',
                border: '2px solid #c7d2fe'
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

              <button type="submit" className="btn-kid btn-purple" style={{ width: '100%', padding: '12px', fontSize: '15px' }}>
                Xác Nhận & Mở Báo Cáo
              </button>
            </form>
          </div>
        ) : (
          /* ================= UNLOCKED STATE: Comprehensive Learning Report ================= */
          <div>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <div style={{
                width: '42px',
                height: '42px',
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
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '22px', fontWeight: 800, color: '#1e293b', margin: 0 }}>
                  Báo Cáo Tiến Trình Học & Chơi Của Bé
                </h3>
                <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 600 }}>
                  Theo dõi kết quả làm bài, độ chính xác và gợi ý định hướng học tập
                </span>
              </div>
            </div>

            {/* Quick KPI Overview */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '10px',
              marginBottom: '20px'
            }}>
              <div style={{ background: '#f8fafc', padding: '10px', borderRadius: '16px', textAlign: 'center', border: '1.5px solid #e2e8f0' }}>
                <div style={{ fontSize: '11px', fontWeight: 700, color: '#64748b' }}>CẤP ĐỘ</div>
                <div style={{ fontSize: '20px', fontWeight: 900, color: '#0284c7', marginTop: '2px' }}>Cấp {level}</div>
              </div>

              <div style={{ background: '#fefce8', padding: '10px', borderRadius: '16px', textAlign: 'center', border: '1.5px solid #fef08a' }}>
                <div style={{ fontSize: '11px', fontWeight: 700, color: '#854d0e' }}>SAO VÀNG</div>
                <div style={{ fontSize: '20px', fontWeight: 900, color: '#eab308', marginTop: '2px' }}>⭐ {stars}</div>
              </div>

              <div style={{ background: '#fffbeb', padding: '10px', borderRadius: '16px', textAlign: 'center', border: '1.5px solid #fde68a' }}>
                <div style={{ fontSize: '11px', fontWeight: 700, color: '#b45309' }}>XU VÀNG</div>
                <div style={{ fontSize: '20px', fontWeight: 900, color: '#f59e0b', marginTop: '2px' }}>🪙 {coins}</div>
              </div>

              <div style={{ background: '#f0fdf4', padding: '10px', borderRadius: '16px', textAlign: 'center', border: '1.5px solid #bbf7d0' }}>
                <div style={{ fontSize: '11px', fontWeight: 700, color: '#15803d' }}>ĐỘ CHÍNH XÁC</div>
                <div style={{ fontSize: '20px', fontWeight: 900, color: '#16a34a', marginTop: '2px' }}>{overallAccuracy}%</div>
              </div>
            </div>

            {/* 3 Subject Cards Detail */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
              {/* 1. Language Valley */}
              <div style={{
                background: '#fdf2f8',
                borderRadius: '18px',
                padding: '14px 16px',
                border: '2px solid #fbcfe8'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ background: '#ec4899', color: '#ffffff', width: '28px', height: '28px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <BookOpen size={16} />
                    </div>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: 800, color: '#9d174d' }}>Thung Lũng Ngôn Ngữ</div>
                      <div style={{ fontSize: '11px', color: '#be185d', fontWeight: 600 }}>Từ vựng song ngữ Việt - Anh, ghép vần & phát âm</div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '16px', fontWeight: 900, color: '#be185d' }}>{langCompleted} bài</div>
                    <div style={{ fontSize: '11px', color: '#9d174d', fontWeight: 700 }}>Đúng: {langAccuracy}%</div>
                  </div>
                </div>

                {/* Progress bar */}
                <div style={{ width: '100%', height: '8px', background: '#fce7f3', borderRadius: '999px', overflow: 'hidden' }}>
                  <div style={{ width: `${Math.min(100, Math.max(10, langAccuracy))}%`, height: '100%', background: '#ec4899', borderRadius: '999px' }} />
                </div>
              </div>

              {/* 2. Math Farm */}
              <div style={{
                background: '#ecfdf5',
                borderRadius: '18px',
                padding: '14px 16px',
                border: '2px solid #a7f3d0'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ background: '#10b981', color: '#ffffff', width: '28px', height: '28px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Calculator size={16} />
                    </div>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: 800, color: '#065f46' }}>Nông Trại Số Học</div>
                      <div style={{ fontSize: '11px', color: '#047857', fontWeight: 600 }}>Đếm số, so sánh lớn nhỏ, phép tính quả ngọt</div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '16px', fontWeight: 900, color: '#047857' }}>{mathCompleted} bài</div>
                    <div style={{ fontSize: '11px', color: '#065f46', fontWeight: 700 }}>Đúng: {mathAccuracy}%</div>
                  </div>
                </div>

                {/* Progress bar */}
                <div style={{ width: '100%', height: '8px', background: '#d1fae5', borderRadius: '999px', overflow: 'hidden' }}>
                  <div style={{ width: `${Math.min(100, Math.max(10, mathAccuracy))}%`, height: '100%', background: '#10b981', borderRadius: '999px' }} />
                </div>
              </div>

              {/* 3. Logic Tower */}
              <div style={{
                background: '#f5f3ff',
                borderRadius: '18px',
                padding: '14px 16px',
                border: '2px solid #ddd6fe'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ background: '#8b5cf6', color: '#ffffff', width: '28px', height: '28px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Puzzle size={16} />
                    </div>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: 800, color: '#5b21b6' }}>Tháp Bí Ẩn Logic</div>
                      <div style={{ fontSize: '11px', color: '#6d28d9', fontWeight: 600 }}>Quy luật chuỗi hình, tìm điểm khác biệt & giải đố</div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '16px', fontWeight: 900, color: '#6d28d9' }}>{logicCompleted} bài</div>
                    <div style={{ fontSize: '11px', color: '#5b21b6', fontWeight: 700 }}>Đúng: {logicAccuracy}%</div>
                  </div>
                </div>

                {/* Progress bar */}
                <div style={{ width: '100%', height: '8px', background: '#ede9fe', borderRadius: '999px', overflow: 'hidden' }}>
                  <div style={{ width: `${Math.min(100, Math.max(10, logicAccuracy))}%`, height: '100%', background: '#8b5cf6', borderRadius: '999px' }} />
                </div>
              </div>
            </div>

            {/* AI Teacher Insights & Advice */}
            <div style={{
              background: '#f0f9ff',
              border: '2px solid #bae6fd',
              borderRadius: '18px',
              padding: '16px',
              marginBottom: '20px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <Sparkles size={18} color="#0284c7" />
                <span style={{ fontSize: '14px', fontWeight: 800, color: '#0369a1' }}>
                  Đánh Giá & Nhận Xét Của Giáo Viên Dành Cho Ba Mẹ
                </span>
              </div>

              <div style={{ fontSize: '13px', color: '#334155', lineHeight: 1.6, marginBottom: '6px' }}>
                🌟 <strong>Thế mạnh nổi bật:</strong> {getTopSubject()}
              </div>

              <div style={{ fontSize: '13px', color: '#475569', lineHeight: 1.6 }}>
                💡 <strong>Gợi ý học tập:</strong> {getRecommendation()}
              </div>
            </div>

            {/* Pet Status Peek */}
            {pet && (
              <div style={{
                background: '#fffbeb',
                border: '2px solid #fde68a',
                borderRadius: '18px',
                padding: '12px 16px',
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '28px' }}>{pet.emoji}</span>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 800, color: '#78350f' }}>
                      Bạn nhỏ đồng hành: {pet.name}
                    </div>
                    <div style={{ fontSize: '11px', color: '#b45309', fontWeight: 600 }}>
                      Bé rèn luyện tinh thần trách nhiệm và lòng yêu thương động vật
                    </div>
                  </div>
                </div>
                <div style={{ textAlign: 'right', fontSize: '12px', fontWeight: 800, color: '#16a34a' }}>
                  Độ vui: {pet.happiness || 100}% ❤️
                </div>
              </div>
            )}

            {/* Footer Actions: Reset Data & Close */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '12px', borderTop: '1px solid #e2e8f0' }}>
              <button
                type="button"
                onClick={() => {
                  if (window.confirm('Ba mẹ có chắc muốn cài đặt lại toàn bộ tiến độ chơi và học của bé không?')) {
                    onResetData();
                    handleClose();
                  }
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#ef4444',
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <RefreshCcw size={14} />
                <span>Cài lại dữ liệu học tập</span>
              </button>

              <button 
                type="button"
                onClick={handleClose} 
                className="btn-kid btn-purple" 
                style={{ padding: '8px 24px', fontSize: '14px' }}
              >
                Đóng
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
