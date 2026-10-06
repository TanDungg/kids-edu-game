import React, { useState, useEffect } from 'react';
import { ArrowLeft, RefreshCw, CheckCircle2, Sparkles, Brain } from 'lucide-react';
import confetti from 'canvas-confetti';
import { dataManager } from '../services/dataManager';
import { sounds } from '../utils/sound';

export default function LogicTower({ onBack, onCompleteLevel }) {
  const [logicLevels, setLogicLevels] = useState(() => dataManager.getLogicLevels());
  const [levelIndex, setLevelIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    return dataManager.subscribe(() => {
      setLogicLevels(dataManager.getLogicLevels());
    });
  }, []);

  const currentLevel = (logicLevels && logicLevels.length > 0) ? (logicLevels[levelIndex % logicLevels.length] || logicLevels[0]) : null;

  useEffect(() => {
    if (currentLevel) {
      resetLevel();
    }
  }, [levelIndex, logicLevels]);

  const resetLevel = () => {
    if (!currentLevel) return;
    setSelectedOption(null);
    setIsSuccess(false);
    if (currentLevel.promptVN) {
      sounds.speak(currentLevel.promptVN, 'vi-VN');
    }
  };

  const handlePickOption = (opt) => {
    if (isSuccess || !currentLevel) return;
    setSelectedOption(opt);

    if (String(opt) === String(currentLevel.answer)) {
      setIsSuccess(true);
      sounds.playSuccess();
      sounds.playCheer();
      sounds.playStar();
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
      onCompleteLevel('logic', { correct: true, starsEarned: 1, coinsEarned: 20 });
    } else {
      sounds.playError();
      sounds.speak('Chưa đúng rồi, bé hãy thử nghĩ lại xem nào!', 'vi-VN');
    }
  };

  const handleNextLevel = () => {
    sounds.playClick();
    if (logicLevels && logicLevels.length > 0) {
      setLevelIndex((prev) => (prev + 1) % logicLevels.length);
    }
  };

  if (!logicLevels || logicLevels.length === 0 || !currentLevel) {
    return (
      <div style={{ maxWidth: '600px', margin: '40px auto', padding: '16px', textAlign: 'center' }}>
        <div className="kid-card" style={{ padding: '36px', background: '#fff' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🧩</div>
          <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#1e293b', marginBottom: '8px' }}>
            Đang Tải Câu Đố Logic...
          </h2>
          <p style={{ color: '#64748b', fontSize: '15px', marginBottom: '24px' }}>
            Dữ liệu câu đố đang được đồng bộ trực tiếp từ Supabase Database.
          </p>
          <button onClick={onBack} className="btn-kid btn-purple" style={{ padding: '10px 24px' }}>
            <ArrowLeft size={18} />
            <span>Quay lại Bản đồ</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container" style={{ maxWidth: '800px' }}>
      {/* Top Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '10px',
        marginBottom: '16px'
      }}>
        <button onClick={onBack} className="btn-kid btn-purple" style={{ padding: '8px 14px', fontSize: '13px' }}>
          <ArrowLeft size={16} />
          <span>Bản đồ</span>
        </button>

        <div style={{
          background: '#f5f3ff',
          color: '#6d28d9',
          padding: '5px 14px',
          borderRadius: '999px',
          fontWeight: 800,
          fontSize: '13px',
          border: '2px solid #ddd6fe',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          textAlign: 'center'
        }}>
          <Brain size={16} />
          <span>Câu {levelIndex + 1} / {logicLevels.length}: {currentLevel.title}</span>
        </div>

        <button onClick={resetLevel} className="btn-kid btn-yellow" style={{ padding: '8px 12px' }} title="Làm lại câu đố này">
          <RefreshCw size={16} />
        </button>
      </div>

      {/* Main Puzzle Card */}
      <div className="kid-card" style={{ padding: 'clamp(16px, 4vw, 32px)', textAlign: 'center', background: '#ffffff' }}>
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(18px, 4vw, 22px)', color: '#4c1d95', fontWeight: 800, marginBottom: '8px' }}>
          {currentLevel.promptVN}
        </h3>
        <p style={{ color: '#64748b', fontSize: '14px', fontWeight: 600, marginBottom: '20px' }}>
          {currentLevel.promptEN}
        </p>

        {/* Level Type: PATTERN */}
        {currentLevel.type === 'pattern' && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 'clamp(6px, 2vw, 12px)',
            margin: '16px 0',
            flexWrap: 'wrap',
            padding: 'clamp(14px, 3vw, 24px)',
            background: '#faf5ff',
            borderRadius: '20px',
            border: '3px dashed #c084fc'
          }}>
            {currentLevel.sequence.map((item, idx) => (
              <div
                key={idx}
                className="pattern-item-box"
                style={{
                  background: '#ffffff',
                  border: '2px solid #e9d5ff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 0 #d8b4fe'
                }}
              >
                {item}
              </div>
            ))}

            <div
              className="pattern-item-box"
              style={{
                background: '#f3e8ff',
                border: '3px dashed #9333ea',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 900,
                color: '#7e22ce'
              }}
            >
              ?
            </div>
          </div>
        )}

        {/* Level Type: ODD ONE OUT */}
        {currentLevel.type === 'odd_one_out' && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
            gap: '16px',
            margin: '24px 0'
          }}>
            {currentLevel.items.map((item, idx) => (
              <div
                key={idx}
                onClick={() => handlePickOption(item.emoji)}
                style={{
                  padding: '20px',
                  borderRadius: '20px',
                  background: selectedOption === item.emoji ? '#f3e8ff' : '#f8fafc',
                  border: selectedOption === item.emoji ? '3px solid #9333ea' : '3px solid #e2e8f0',
                  cursor: 'pointer',
                  boxShadow: '0 6px 0 #cbd5e1',
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{ fontSize: '48px', marginBottom: '8px' }}>{item.emoji}</div>
                <div style={{ fontWeight: 800, color: '#334155', fontSize: '14px' }}>{item.name}</div>
              </div>
            ))}
          </div>
        )}

        {/* Level Type: SIZE ORDER */}
        {currentLevel.type === 'size_order' && (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'flex-end',
            gap: '24px',
            margin: '24px 0',
            flexWrap: 'wrap'
          }}>
            {currentLevel.items.map((item, idx) => (
              <div
                key={idx}
                onClick={() => handlePickOption(item.emoji)}
                style={{
                  padding: '16px 24px',
                  borderRadius: '20px',
                  background: selectedOption === item.emoji ? '#f3e8ff' : '#f8fafc',
                  border: selectedOption === item.emoji ? '3px solid #9333ea' : '3px solid #e2e8f0',
                  cursor: 'pointer',
                  boxShadow: '0 6px 0 #cbd5e1',
                  textAlign: 'center'
                }}
              >
                <div style={{ fontSize: `${28 + item.size * 18}px` }}>{item.emoji}</div>
                <div style={{ fontWeight: 800, color: '#334155', marginTop: '8px' }}>{item.name}</div>
              </div>
            ))}
          </div>
        )}

        {/* Pattern Options Pick Buttons */}
        {currentLevel.type === 'pattern' && (
          <div style={{ marginTop: '20px' }}>
            <div style={{ fontSize: '15px', fontWeight: 800, color: '#334155', marginBottom: '12px' }}>
              Bé hãy chọn hình còn thiếu:
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', flexWrap: 'wrap' }}>
              {currentLevel.options.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => handlePickOption(opt)}
                  className="btn-kid btn-yellow"
                  style={{
                    width: '64px',
                    height: '64px',
                    fontSize: '28px',
                    borderRadius: '16px',
                    padding: 0
                  }}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Success Banner */}
        {isSuccess && (
          <div className="animate-pop-in" style={{
            marginTop: '28px',
            padding: '20px',
            background: 'linear-gradient(135deg, #ede9fe 0%, #ddd6fe 100%)',
            borderRadius: '20px',
            border: '3px solid #7c3aed',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <CheckCircle2 size={36} color="#7c3aed" />
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: '18px', fontWeight: 800, color: '#4c1d95' }}>
                  Bé có tư duy logic thật xuất sắc! 🧠✨
                </div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#7c3aed' }}>
                  +1 Sao Vàng 🌟 &middot; +20 Xu 🪙
                </div>
              </div>
            </div>

            <button onClick={handleNextLevel} className="btn-kid btn-purple" style={{ padding: '10px 24px', fontSize: '16px' }}>
              <span>Thử thách tiếp theo</span>
              <Sparkles size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
