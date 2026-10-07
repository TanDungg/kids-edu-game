import React from 'react';
import { Sparkles, Volume2, ArrowRight, Star, Coins, RefreshCw, Map } from 'lucide-react';
import { sounds } from '../utils/sound';

export default function GameResultModal({
  isOpen,
  type = 'language', // 'language' | 'math' | 'logic'
  title = 'Chính xác! Bé giỏi quá! 🎉',
  subtitle,
  starsEarned = 1,
  coinsEarned = 15,
  wordData, // { vn, en, emoji, theme }
  onSpeakVN,
  onSpeakEN,
  onNext,
  onReplay,
  onGoMap
}) {
  if (!isOpen) return null;

  return (
    <div 
      className="modal-overlay"
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(15, 23, 42, 0.72)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1100,
        padding: '16px',
        boxSizing: 'border-box',
        overscrollBehavior: 'contain'
      }}
    >
      <div 
        className="kid-card animate-pop-in modal-sheet"
        style={{
          background: '#ffffff',
          borderRadius: 'clamp(22px, 5vw, 32px)',
          width: '100%',
          maxWidth: '420px',
          padding: 'clamp(18px, 4.5vw, 26px)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
          position: 'relative',
          textAlign: 'center',
          boxSizing: 'border-box',
          border: '4px solid #bbf7d0',
          overflow: 'hidden'
        }}
      >
        {/* Top celebratory accent gradient bar */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '8px',
          background: 'linear-gradient(90deg, #facc15, #4ade80, #38bdf8, #f472b6)'
        }} />

        {/* Mascot / Trophy Header */}
        <div style={{ position: 'relative', margin: '6px 0 10px' }}>
          <div 
            className="animate-bounce-slow"
            style={{ fontSize: 'clamp(48px, 12vw, 68px)', lineHeight: 1 }}
          >
            {wordData?.emoji || (type === 'math' ? '🌟' : type === 'logic' ? '🧠' : '🎉')}
          </div>
        </div>

        {/* Title */}
        <h2 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(18px, 4.8vw, 24px)',
          fontWeight: 900,
          color: '#166534',
          margin: '0 0 6px',
          lineHeight: 1.25
        }}>
          {title}
        </h2>

        {/* Subtitle / Encouragement */}
        <p style={{
          fontSize: 'clamp(12.5px, 3.4vw, 14px)',
          color: '#475569',
          fontWeight: 700,
          margin: '0 0 14px',
          lineHeight: 1.4
        }}>
          {subtitle || (
            type === 'language' 
              ? 'Bé hãy bấm vào loa để nghe và đọc theo phát âm chuẩn nhé:' 
              : 'Bé thật xuất sắc! Hãy tiếp tục rèn luyện để trở thành Đại Hiệp Sĩ nào!'
          )}
        </p>

        {/* Reward Pills */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '10px',
          background: '#fefce8',
          border: '2px solid #fef08a',
          padding: '6px 16px',
          borderRadius: '999px',
          marginBottom: '16px',
          boxShadow: '0 2px 8px rgba(234, 179, 8, 0.15)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#854d0e', fontWeight: 900, fontSize: '13.5px' }}>
            <Star size={16} fill="#facc15" color="#ca8a04" />
            <span>+{starsEarned} Sao Vàng</span>
          </div>
          <span style={{ color: '#cbd5e1' }}>&bull;</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#b45309', fontWeight: 900, fontSize: '13.5px' }}>
            <Coins size={16} fill="#fbbf24" color="#d97706" />
            <span>+{coinsEarned} Xu</span>
          </div>
        </div>

        {/* Specific content for Language Valley: Big Pronunciation Buttons */}
        {type === 'language' && wordData && (
          <div style={{
            background: 'linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%)',
            border: '2px dashed #86efac',
            borderRadius: '18px',
            padding: '12px 14px',
            marginBottom: '18px'
          }}>
            <div style={{ fontSize: '12px', fontWeight: 800, color: '#15803d', marginBottom: '8px' }}>
              Từ vựng đã học:
            </div>

            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap' }}>
              {/* Tiếng Việt */}
              <button
                type="button"
                onClick={() => {
                  sounds.playClick();
                  if (onSpeakVN) onSpeakVN();
                }}
                className="btn-kid btn-pink"
                style={{
                  flex: 1,
                  minWidth: '120px',
                  padding: '10px 14px',
                  fontSize: 'clamp(13px, 3.5vw, 15px)',
                  fontWeight: 800
                }}
              >
                <Volume2 size={18} />
                <span>🇻🇳 {wordData.vn}</span>
              </button>

              {/* English */}
              <button
                type="button"
                onClick={() => {
                  sounds.playClick();
                  if (onSpeakEN) onSpeakEN();
                }}
                className="btn-kid btn-blue"
                style={{
                  flex: 1,
                  minWidth: '120px',
                  padding: '10px 14px',
                  fontSize: 'clamp(13px, 3.5vw, 15px)',
                  fontWeight: 800
                }}
              >
                <Volume2 size={18} />
                <span>🇬🇧 {wordData.en}</span>
              </button>
            </div>
          </div>
        )}

        {/* Primary Action: Next Question */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <button
            type="button"
            onClick={() => {
              sounds.playClick();
              if (onNext) onNext();
            }}
            className="btn-kid btn-green"
            style={{
              width: '100%',
              padding: '13px 20px',
              fontSize: 'clamp(15px, 4vw, 17px)',
              fontWeight: 900,
              boxShadow: '0 6px 0 #16a34a, 0 12px 20px rgba(34, 197, 94, 0.3)'
            }}
          >
            <span>{type === 'language' ? 'Từ tiếp theo 🚀' : 'Câu tiếp theo 🚀'}</span>
            <ArrowRight size={19} />
          </button>

          {/* Secondary Actions */}
          <div style={{ display: 'flex', gap: '8px', marginTop: '2px' }}>
            {onReplay && (
              <button
                type="button"
                onClick={() => {
                  sounds.playClick();
                  onReplay();
                }}
                className="btn-kid btn-gray"
                style={{ flex: 1, padding: '9px 12px', fontSize: '12.5px', fontWeight: 800 }}
              >
                <RefreshCw size={14} />
                <span>Chơi lại</span>
              </button>
            )}

            {onGoMap && (
              <button
                type="button"
                onClick={() => {
                  sounds.playClick();
                  onGoMap();
                }}
                className="btn-kid btn-gray"
                style={{ flex: 1, padding: '9px 12px', fontSize: '12.5px', fontWeight: 800 }}
              >
                <Map size={14} />
                <span>Về Bản đồ</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
