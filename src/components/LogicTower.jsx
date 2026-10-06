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
  const [wrongMsg, setWrongMsg] = useState('');

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
    setWrongMsg('');
    if (currentLevel.promptVN) {
      sounds.speak(currentLevel.promptVN, 'vi-VN');
    }
  };

  const handlePickOption = (opt) => {
    if (isSuccess || !currentLevel) return;
    setSelectedOption(opt);

    if (String(opt) === String(currentLevel.answer)) {
      setIsSuccess(true);
      setWrongMsg('');
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
      setWrongMsg(`Chưa đúng quy luật rồi bé ơi! ${opt} chưa phải đáp án đúng, bé quan sát kỹ lại nhé! ❌`);
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
    <div className="game-screen-wrapper">
      {/* Top Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '6px',
        marginBottom: '6px',
        flexShrink: 0
      }}>
        <button onClick={onBack} className="btn-kid btn-purple" style={{ padding: '5px 10px', fontSize: '11.5px', flexShrink: 0 }}>
          <ArrowLeft size={14} />
          <span>Bản đồ</span>
        </button>

        <div style={{
          background: '#f5f3ff',
          color: '#6d28d9',
          padding: '3px 10px',
          borderRadius: '999px',
          fontWeight: 800,
          fontSize: '11px',
          border: '1.5px solid #ddd6fe',
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          textAlign: 'center',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          maxWidth: '65%'
        }}>
          <Brain size={13} />
          <span>Câu {levelIndex + 1}/{logicLevels.length}: {currentLevel.title}</span>
        </div>

        <button onClick={resetLevel} className="btn-kid btn-yellow" style={{ padding: '5px 7px' }} title="Làm lại câu đố này">
          <RefreshCw size={12} />
        </button>
      </div>

      {/* Main Puzzle Card */}
      <div className="game-card-compact">
        {/* Top Prompt */}
        <div style={{ textAlign: 'center', flexShrink: 0 }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(14px, 2.4vh, 18px)', color: '#4c1d95', fontWeight: 800, margin: '0 0 2px' }}>
            {currentLevel.promptVN}
          </h3>
          <p style={{ color: '#64748b', fontSize: 'clamp(11px, 1.8vh, 13px)', fontWeight: 600, margin: '0 0 6px' }}>
            {currentLevel.promptEN}
          </p>
        </div>

        {/* Level Type: PATTERN (Sequence with missing slot) */}
        {currentLevel.type === 'pattern' && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 'clamp(5px, 1.5vw, 10px)',
            margin: '4px 0',
            flexWrap: 'wrap',
            padding: 'clamp(8px, 1.5vh, 14px)',
            background: '#faf5ff',
            borderRadius: '16px',
            border: '2px dashed #c084fc',
            flexShrink: 0
          }}>
            {currentLevel.sequence.map((item, idx) => (
              <div
                key={idx}
                className="pattern-item-box"
                style={{
                  width: 'clamp(38px, 7.5vh, 54px)',
                  height: 'clamp(38px, 7.5vh, 54px)',
                  fontSize: 'clamp(20px, 4vh, 28px)',
                  background: '#ffffff',
                  border: '2px solid #e9d5ff',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 3px 0 #d8b4fe'
                }}
              >
                {item}
              </div>
            ))}

            <div
              className="pattern-item-box"
              style={{
                width: 'clamp(38px, 7.5vh, 54px)',
                height: 'clamp(38px, 7.5vh, 54px)',
                fontSize: 'clamp(20px, 4vh, 28px)',
                background: isSuccess ? '#dcfce7' : '#f3e8ff',
                border: isSuccess ? '2.5px solid #22c55e' : '2px dashed #9333ea',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 900,
                color: isSuccess ? '#15803d' : '#7e22ce',
                boxShadow: isSuccess ? '0 3px 0 #16a34a' : '0 3px 0 #c084fc'
              }}
            >
              {isSuccess ? currentLevel.answer : '?'}
            </div>
          </div>
        )}

        {/* Level Type: ODD ONE OUT (Select different object) */}
        {currentLevel.type === 'odd_one_out' && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${Math.min(currentLevel.items.length, 4)}, 1fr)`,
            gap: 'clamp(6px, 1.5vw, 12px)',
            margin: '4px 0',
            flexShrink: 0
          }}>
            {currentLevel.items.map((item, idx) => {
              const isSelected = selectedOption === item.emoji;
              const isAnswerCorrect = String(item.emoji) === String(currentLevel.answer);

              let cardBg = '#f8fafc';
              let cardBorder = '2px solid #e2e8f0';
              let cardShadow = '0 3px 0 #cbd5e1';
              let cardClass = '';

              if (isSuccess && isAnswerCorrect) {
                cardBg = '#dcfce7';
                cardBorder = '2.5px solid #22c55e';
                cardShadow = '0 3px 0 #16a34a';
              } else if (isSelected && !isSuccess) {
                cardBg = '#fef2f2';
                cardBorder = '2.5px solid #ef4444';
                cardShadow = '0 3px 0 #dc2626';
                cardClass = 'animate-shake';
              }

              return (
                <div
                  key={idx}
                  onClick={() => handlePickOption(item.emoji)}
                  className={cardClass}
                  style={{
                    padding: 'clamp(8px, 1.5vh, 14px) 6px',
                    borderRadius: '14px',
                    background: cardBg,
                    border: cardBorder,
                    boxShadow: cardShadow,
                    cursor: isSuccess ? 'default' : 'pointer',
                    transition: 'all 0.15s ease',
                    textAlign: 'center'
                  }}
                >
                  <div style={{ fontSize: 'clamp(28px, 5.5vh, 42px)', lineHeight: 1, marginBottom: '4px' }}>
                    {item.emoji}
                  </div>
                  <div style={{ fontWeight: 800, color: isSuccess && isAnswerCorrect ? '#15803d' : '#334155', fontSize: 'clamp(11px, 1.8vh, 13px)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {item.name}
                    {isSuccess && isAnswerCorrect && ' ✓'}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Level Type: SIZE ORDER */}
        {currentLevel.type === 'size_order' && (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'flex-end',
            gap: 'clamp(8px, 2vw, 16px)',
            margin: '4px 0',
            flexWrap: 'wrap',
            flexShrink: 0
          }}>
            {currentLevel.items.map((item, idx) => {
              const isSelected = selectedOption === item.emoji;
              const isAnswerCorrect = String(item.emoji) === String(currentLevel.answer);

              let cardBg = '#f8fafc';
              let cardBorder = '2px solid #e2e8f0';
              let cardShadow = '0 3px 0 #cbd5e1';
              let cardClass = '';

              if (isSuccess && isAnswerCorrect) {
                cardBg = '#dcfce7';
                cardBorder = '2.5px solid #22c55e';
                cardShadow = '0 3px 0 #16a34a';
              } else if (isSelected && !isSuccess) {
                cardBg = '#fef2f2';
                cardBorder = '2.5px solid #ef4444';
                cardShadow = '0 3px 0 #dc2626';
                cardClass = 'animate-shake';
              }

              return (
                <div
                  key={idx}
                  onClick={() => handlePickOption(item.emoji)}
                  className={cardClass}
                  style={{
                    padding: 'clamp(8px, 1.5vh, 14px) clamp(10px, 2.5vw, 18px)',
                    borderRadius: '14px',
                    background: cardBg,
                    border: cardBorder,
                    boxShadow: cardShadow,
                    cursor: isSuccess ? 'default' : 'pointer',
                    textAlign: 'center',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{ fontSize: `${22 + (item.size || 1) * 12}px`, lineHeight: 1 }}>{item.emoji}</div>
                  <div style={{ fontWeight: 800, color: isSuccess && isAnswerCorrect ? '#15803d' : '#334155', marginTop: '4px', fontSize: '11.5px' }}>
                    {item.name}
                    {isSuccess && isAnswerCorrect && ' ✓'}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pattern Choice Options Buttons */}
        {currentLevel.type === 'pattern' && (
          <div style={{ margin: '4px 0', flexShrink: 0, textAlign: 'center' }}>
            <div style={{ fontSize: 'clamp(12px, 2vh, 13.5px)', fontWeight: 800, color: '#334155', marginBottom: '6px' }}>
              Bé hãy chọn hình còn thiếu:
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 'clamp(6px, 1.8vw, 12px)', flexWrap: 'wrap' }}>
              {currentLevel.options.map((opt, idx) => {
                const isSelected = selectedOption === opt;
                const isAnswerCorrect = String(opt) === String(currentLevel.answer);

                let btnClass = 'btn-yellow';
                if (isSuccess && isAnswerCorrect) {
                  btnClass = 'btn-green';
                } else if (isSelected && !isSuccess) {
                  btnClass = 'btn-red animate-shake';
                } else if (isSuccess) {
                  btnClass = 'btn-gray';
                }

                return (
                  <button
                    key={idx}
                    disabled={isSuccess}
                    onClick={() => handlePickOption(opt)}
                    className={`btn-kid ${btnClass}`}
                    style={{
                      width: 'clamp(44px, 8vh, 56px)',
                      height: 'clamp(44px, 8vh, 56px)',
                      fontSize: 'clamp(22px, 4vh, 28px)',
                      borderRadius: '12px',
                      padding: 0
                    }}
                  >
                    {opt}
                    {isSuccess && isAnswerCorrect && ' ✓'}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Explicit Wrong Feedback */}
        {wrongMsg && (
          <div className="animate-shake" style={{
            background: '#fef2f2',
            border: '1.5px solid #fecaca',
            color: '#b91c1c',
            padding: '4px 10px',
            borderRadius: '10px',
            fontSize: '11.5px',
            fontWeight: 800,
            marginTop: '4px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            flexShrink: 0
          }}>
            <span>❌</span>
            <span>{wrongMsg}</span>
          </div>
        )}

        {/* Win Banner */}
        {isSuccess && (
          <div className="animate-pop-in" style={{
            marginTop: '6px',
            padding: '8px 12px',
            background: 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)',
            borderRadius: '14px',
            border: '2px solid #22c55e',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '8px',
            flexShrink: 0
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle2 size={24} color="#16a34a" />
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: '13.5px', fontWeight: 800, color: '#14532d' }}>
                  Bé tư duy logic xuất sắc quá! 🧠✨
                </div>
                <div style={{ fontSize: '11.5px', fontWeight: 700, color: '#16a34a' }}>
                  +1 Sao Vàng 🌟 &middot; +20 Xu 🪙
                </div>
              </div>
            </div>

            <button onClick={handleNextLevel} className="btn-kid btn-green" style={{ padding: '6px 14px', fontSize: '12.5px' }}>
              <span>Câu tiếp theo</span>
              <Sparkles size={14} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

