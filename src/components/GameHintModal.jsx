import React from 'react';
import { HelpCircle, X, Sparkles } from 'lucide-react';
import { sounds } from '../utils/sound';

export default function GameHintModal({
  isOpen,
  onClose,
  hintText,
  theme
}) {
  if (!isOpen) return null;

  return (
    <div
      className="modal-overlay"
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1100,
        padding: '16px',
        overscrollBehavior: 'contain'
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        className="kid-card animate-pop-in modal-sheet"
        style={{
          background: '#ffffff',
          borderRadius: '24px',
          width: '100%',
          maxWidth: '380px',
          padding: '20px',
          textAlign: 'center',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.3)',
          border: '3px solid #7dd3fc',
          position: 'relative'
        }}
      >
        <button
          onClick={() => {
            sounds.playClick();
            onClose();
          }}
          style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
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
        >
          <X size={16} />
        </button>

        <div style={{ fontSize: '42px', margin: '4px 0 8px' }} className="animate-bounce-slow">
          💡
        </div>

        <h3 style={{
          fontFamily: 'var(--font-display)',
          fontSize: '18px',
          fontWeight: 800,
          color: '#0369a1',
          marginBottom: '8px'
        }}>
          Gợi Ý Dành Cho Bé
        </h3>

        <div style={{
          background: '#f0f9ff',
          border: '1.5px solid #bae6fd',
          borderRadius: '14px',
          padding: '12px 14px',
          fontSize: '14px',
          fontWeight: 700,
          color: '#0c4a6e',
          lineHeight: 1.5,
          marginBottom: '16px'
        }}>
          {hintText || 'Bé hãy quan sát thật kỹ các chữ cái hoặc hình ảnh gợi ý nhé!'}
        </div>

        <button
          onClick={() => {
            sounds.playClick();
            onClose();
          }}
          className="btn-kid btn-blue"
          style={{ width: '100%', padding: '10px 16px', fontSize: '14px', fontWeight: 800 }}
        >
          <span>Bé đã hiểu rồi! 🚀</span>
        </button>
      </div>
    </div>
  );
}
