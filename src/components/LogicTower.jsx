import React, { useState, useEffect } from 'react';
import { ArrowLeft, RefreshCw, Sparkles, Brain, Volume2, HelpCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { dataManager } from '../services/dataManager';
import { sounds } from '../utils/sound';
import { getRealPhotoForWord, getRealPhotoForMath } from '../data/realImages';
import GameResultModal from './GameResultModal';
import GameErrorModal from './GameErrorModal';
import GameHintModal from './GameHintModal';

export default function LogicTower({ onBack, onCompleteLevel }) {
  const [logicLevels, setLogicLevels] = useState(() => {
    const list = dataManager.getShuffledLogic();
    return (list && list.length > 0) ? list : dataManager.getLogicLevels();
  });
  const [levelIndex, setLevelIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [isHintModalOpen, setIsHintModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    return dataManager.subscribe(() => {
      const dbList = dataManager.getShuffledLogic();
      if (dbList && dbList.length > 0) {
        setLogicLevels(dbList);
      }
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
    setIsSuccessModalOpen(false);
    setIsErrorModalOpen(false);
    setIsHintModalOpen(false);
    setErrorMessage('');
    if (currentLevel.promptVN) {
      sounds.speak(currentLevel.promptVN, 'vi-VN');
    }
  };

  const handleReshuffleAndReset = () => {
    sounds.playClick();
    const shuffled = dataManager.getShuffledLogic();
    if (shuffled && shuffled.length > 0) {
      setLogicLevels(shuffled);
    }
    setLevelIndex(0);
    resetLevel();
  };

  const handlePickOption = (opt) => {
    if (isSuccessModalOpen || isErrorModalOpen || !currentLevel) return;
    setSelectedOption(opt);

    if (String(opt) === String(currentLevel.answer)) {
      setIsErrorModalOpen(false);
      sounds.playSuccess();
      sounds.playCheer();
      sounds.playStar();
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
      setIsSuccessModalOpen(true);
      onCompleteLevel('logic', { correct: true, starsEarned: 1, coinsEarned: 20 });
    } else {
      sounds.playError();
      setErrorMessage(`Đáp án "${opt}" chưa đúng quy luật rồi bé ơi! Bé quan sát kỹ lại nhé! 🔮`);
      setIsErrorModalOpen(true);
      sounds.speak('Chưa đúng rồi, bé hãy thử nghĩ lại xem nào!', 'vi-VN');
    }
  };

  const handleNextLevel = () => {
    sounds.playClick();
    setIsSuccessModalOpen(false);
    setIsErrorModalOpen(false);
    if (logicLevels && logicLevels.length > 0) {
      setLevelIndex((prev) => (prev + 1) % logicLevels.length);
    }
  };

  const handleRetryAfterError = () => {
    setIsErrorModalOpen(false);
    setSelectedOption(null);
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
        marginBottom: '8px',
        flexShrink: 0
      }}>
        <button 
          onClick={() => {
            sounds.playClick();
            onBack();
          }} 
          className="btn-kid btn-purple" 
          style={{ padding: '5px 10px', fontSize: '12px', flexShrink: 0 }}
        >
          <ArrowLeft size={14} />
          <span>Bản đồ</span>
        </button>

        <div style={{
          background: '#f5f3ff',
          color: '#6d28d9',
          padding: '4px 10px',
          borderRadius: '999px',
          fontWeight: 800,
          fontSize: '11.5px',
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

        <button onClick={handleReshuffleAndReset} className="btn-kid btn-yellow" style={{ padding: '5px 7px' }} title="Xáo trộn lại toàn bộ câu đố logic">
          <RefreshCw size={12} />
        </button>
      </div>

      {/* Main Puzzle Card - Cohesive Centered Layout */}
      <div className="game-card-compact">
        {/* Top Prompt */}
        <div style={{ textAlign: 'center', flexShrink: 0 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', marginBottom: '2px' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(14px, 2.5vh, 17.5px)', color: '#4c1d95', fontWeight: 900, margin: 0 }}>
              {currentLevel.promptVN}
            </h3>
            <button
              onClick={() => sounds.speak(currentLevel.promptVN, 'vi-VN')}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#8b5cf6', display: 'flex', alignItems: 'center', padding: '2px' }}
              title="Nghe lại câu đố"
            >
              <Volume2 size={16} />
            </button>
          </div>
          <p style={{ color: '#64748b', fontSize: 'clamp(11px, 1.8vh, 12.5px)', fontWeight: 600, margin: '0 0 6px' }}>
            {currentLevel.promptEN}
          </p>
        </div>

        {/* Level Type: PATTERN (Sequence with missing slot) */}
        {currentLevel.type === 'pattern' && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 'clamp(6px, 1.8vw, 12px)',
            margin: 'auto 0',
            flexWrap: 'wrap',
            padding: 'clamp(10px, 2vh, 16px)',
            background: '#faf5ff',
            borderRadius: '18px',
            border: '2.5px dashed #c084fc',
            flexShrink: 0
          }}>
            {currentLevel.sequence.map((item, idx) => (
              <div
                key={idx}
                className="pattern-item-box"
                style={{
                  width: 'clamp(42px, 8.5vh, 56px)',
                  height: 'clamp(42px, 8.5vh, 56px)',
                  fontSize: 'clamp(22px, 4.5vh, 30px)',
                  background: '#ffffff',
                  border: '2px solid #e9d5ff',
                  borderRadius: '14px',
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
              className="pattern-item-box animate-bounce-slow"
              style={{
                width: 'clamp(42px, 8.5vh, 56px)',
                height: 'clamp(42px, 8.5vh, 56px)',
                fontSize: 'clamp(22px, 4.5vh, 30px)',
                background: '#f3e8ff',
                border: '2.5px dashed #9333ea',
                borderRadius: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 900,
                color: '#7e22ce',
                boxShadow: '0 3px 0 #c084fc'
              }}
            >
              ?
            </div>
          </div>
        )}

        {/* Level Type: ODD ONE OUT (Select different object) */}
        {currentLevel.type === 'odd_one_out' && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${Math.min(currentLevel.items.length, 4)}, 1fr)`,
            gap: 'clamp(6px, 1.8vw, 12px)',
            margin: 'auto 0',
            flexShrink: 0
          }}>
            {currentLevel.items.map((item, idx) => {
              const photo = getRealPhotoForWord(item) || getRealPhotoForMath(item.emoji, item.name);
              return (
                <div
                  key={idx}
                  onClick={() => handlePickOption(item.emoji)}
                  className="kid-card"
                  style={{
                    padding: 'clamp(8px, 1.8vh, 12px) 6px',
                    borderRadius: '16px',
                    background: '#f8fafc',
                    border: '2px solid #e2e8f0',
                    boxShadow: '0 3px 0 #cbd5e1',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    textAlign: 'center'
                  }}
                >
                  <div style={{ height: 'clamp(36px, 7vh, 52px)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '4px' }}>
                    {photo ? (
                      <img 
                        src={photo} 
                        alt={item.name} 
                        style={{
                          width: 'clamp(36px, 7vh, 52px)',
                          height: 'clamp(36px, 7vh, 52px)',
                          objectFit: 'cover',
                          borderRadius: '12px'
                        }}
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          if (e.currentTarget.nextSibling) e.currentTarget.nextSibling.style.display = 'block';
                        }}
                      />
                    ) : null}
                    <span style={{ fontSize: 'clamp(28px, 5vh, 40px)', display: photo ? 'none' : 'block', lineHeight: 1 }}>
                      {item.emoji}
                    </span>
                  </div>
                  <div style={{ fontWeight: 800, color: '#334155', fontSize: 'clamp(11px, 1.6vh, 12.5px)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {item.name}
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
            margin: 'auto 0',
            flexWrap: 'wrap',
            flexShrink: 0
          }}>
            {currentLevel.items.map((item, idx) => {
              const photo = getRealPhotoForWord(item) || getRealPhotoForMath(item.emoji, item.name);
              const imgDim = 32 + (item.size || 1) * 16;
              return (
                <div
                  key={idx}
                  onClick={() => handlePickOption(item.emoji)}
                  className="kid-card"
                  style={{
                    padding: 'clamp(8px, 1.8vh, 14px) clamp(8px, 2vw, 14px)',
                    borderRadius: '16px',
                    background: '#f8fafc',
                    border: '2px solid #e2e8f0',
                    boxShadow: '0 3px 0 #cbd5e1',
                    cursor: 'pointer',
                    textAlign: 'center',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{ height: `${imgDim}px`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {photo ? (
                      <img 
                        src={photo} 
                        alt={item.name} 
                        style={{
                          width: `${imgDim}px`,
                          height: `${imgDim}px`,
                          objectFit: 'cover',
                          borderRadius: '14px',
                          boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                        }}
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          if (e.currentTarget.nextSibling) e.currentTarget.nextSibling.style.display = 'block';
                        }}
                      />
                    ) : null}
                    <span style={{ fontSize: `${24 + (item.size || 1) * 12}px`, display: photo ? 'none' : 'block', lineHeight: 1 }}>
                      {item.emoji}
                    </span>
                  </div>
                  <div style={{ fontWeight: 800, color: '#334155', marginTop: '4px', fontSize: '12px' }}>
                    {item.name}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pattern Choice Options Buttons */}
        {currentLevel.type === 'pattern' && (
          <div style={{ margin: '6px 0', flexShrink: 0, textAlign: 'center' }}>
            <div style={{ fontSize: 'clamp(12.5px, 2vh, 14px)', fontWeight: 800, color: '#334155', marginBottom: '6px' }}>
              Bé hãy chọn hình còn thiếu:
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 'clamp(6px, 1.8vw, 12px)', flexWrap: 'wrap' }}>
              {currentLevel.options.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => handlePickOption(opt)}
                  className="btn-kid btn-yellow"
                  style={{
                    width: 'clamp(46px, 8.5vh, 58px)',
                    height: 'clamp(46px, 8.5vh, 58px)',
                    fontSize: 'clamp(24px, 4.2vh, 30px)',
                    borderRadius: '14px',
                    padding: 0
                  }}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Hint Trigger Button */}
        {currentLevel.hint && (
          <div style={{ marginTop: '4px', textAlign: 'center' }}>
            <button 
              onClick={() => {
                sounds.playClick();
                setIsHintModalOpen(true);
              }}
              style={{ 
                background: '#f5f3ff', 
                border: '1.5px solid #ddd6fe', 
                color: '#7c3aed', 
                fontSize: '12px', 
                fontWeight: 800, 
                cursor: 'pointer', 
                display: 'inline-flex', 
                alignItems: 'center', 
                gap: '4px',
                padding: '4px 12px',
                borderRadius: '999px'
              }}
            >
              <HelpCircle size={13} />
              <span>Gợi ý quy luật 💡</span>
            </button>
          </div>
        )}
      </div>

      {/* Result Modal: Success Celebratory Popup */}
      <GameResultModal
        isOpen={isSuccessModalOpen}
        type="logic"
        title="Xuất sắc! Bé tư duy logic tuyệt vời! 🧠✨"
        subtitle="Bé đã giải mã thành công bí ẩn của Tháp Logic!"
        starsEarned={1}
        coinsEarned={20}
        onNext={handleNextLevel}
        onReplay={resetLevel}
        onGoMap={onBack}
      />

      {/* Error / Wrong Attempt Modal */}
      <GameErrorModal
        isOpen={isErrorModalOpen}
        onClose={() => setIsErrorModalOpen(false)}
        onRetry={handleRetryAfterError}
        onOpenHint={() => setIsHintModalOpen(true)}
        message={errorMessage || 'Chưa đúng quy luật rồi bé ơi! Bé thử quan sát lại nhé!'}
        hintAvailable={Boolean(currentLevel.hint)}
      />

      {/* Hint Modal */}
      <GameHintModal
        isOpen={isHintModalOpen}
        onClose={() => setIsHintModalOpen(false)}
        hintText={currentLevel.hint || 'Bé quan sát sự lặp lại theo thứ tự của các hình nhé!'}
      />
    </div>
  );
}
