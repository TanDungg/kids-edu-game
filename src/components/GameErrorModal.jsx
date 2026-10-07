import React from 'react';
import { RefreshCw, HelpCircle, X, Sparkles } from 'lucide-react';
import { sounds } from '../utils/sound';

export default function GameErrorModal({
  isOpen,
  onClose,
  onRetry,
  onOpenHint,
  message = 'Chưa chính xác rồi bé ơi! Bé thử lại nhé!',
  hintAvailable = false
}) {
  if (!isOpen) return null;

  return (
    <div 
      className="modal-overlay"
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(15, 23, 42, 0.7)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1150,
        padding: '16px',
        boxSizing: 'border-box',
        overscrollBehavior: 'contain'
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          if (onRetry) onRetry();
          else onClose();
        }
      }}
    >
      <div 
        className="kid-card animate-pop-in modal-sheet"
        style={{
          background: '#ffffff',
          borderRadius: 'clamp(20px, 4.5vw, 28px)',
          width: '100%',
          maxWidth: '380px',
          padding: 'clamp(18px, 4.5vw, 24px)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
          position: 'relative',
          textAlign: 'center',
          boxSizing: 'border-box',
          border: '3.5px solid #fca5a5',
          overflow: 'hidden'
        }}
      >
        {/* Top red accent bar */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '6px',
          background: 'linear-gradient(90deg, #f87171, #ef4444, #dc2626)'
        }} />

        {/* Close Button */}
        <button
          type="button"
          onClick={() => {
            sounds.playClick();
            if (onRetry) onRetry();
            else onClose();
          }}
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            background: '#f1f5f9',
            border: 'none',
            borderRadius: '50%',
            width: '30px',
            height: '30px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: '#64748b'
          }}
          title="Đóng"
        >
          <X size={16} />
        </button>

        {/* Mascot / Avatar */}
        <div style={{ fontSize: 'clamp(46px, 11vw, 60px)', margin: '4px 0 8px', lineHeight: 1 }} className="animate-wiggle">
          🐣
        </div>

        {/* Title */}
        <h3 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(17px, 4.5vw, 21px)',
          fontWeight: 900,
          color: '#b91c1c',
          margin: '0 0 8px',
          lineHeight: 1.25
        }}>
          Chưa Chính Xác Rồi!
        </h3>

        {/* Explanatory Message */}
        <div style={{
          background: '#fef2f2',
          border: '1.5px solid #fecaca',
          borderRadius: '14px',
          padding: '12px 14px',
          fontSize: 'clamp(12.5px, 3.2vw, 14px)',
          fontWeight: 700,
          color: '#991b1b',
          lineHeight: 1.45,
          marginBottom: '16px'
        }}>
          {message}
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <button
            type="button"
            onClick={() => {
              sounds.playClick();
              if (onRetry) onRetry();
              else onClose();
            }}
            className="btn-kid btn-yellow"
            style={{
              width: '100%',
              padding: '12px 18px',
              fontSize: 'clamp(14px, 3.8vw, 16px)',
              fontWeight: 900
            }}
          >
            <RefreshCw size={17} />
            <span>Thử Lại Ngay Nào 💪</span>
          </button>

          {hintAvailable && onOpenHint && (
            <button
              type="button"
              onClick={() => {
                sounds.playClick();
                onClose();
                onOpenHint();
              }}
              className="btn-kid btn-blue"
              style={{
                width: '100%',
                padding: '9px 14px',
                fontSize: '13px',
                fontWeight: 800
              }}
            >
              <HelpCircle size={15} />
              <span>Xem Gợi Ý 💡</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
