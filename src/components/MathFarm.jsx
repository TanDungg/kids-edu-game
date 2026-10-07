import React, { useState, useEffect } from 'react';
import { ArrowLeft, RefreshCw, Sparkles, Volume2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { dataManager } from '../services/dataManager';
import { sounds } from '../utils/sound';
import { getRealPhotoForMath } from '../data/realImages';
import GameResultModal from './GameResultModal';
import GameErrorModal from './GameErrorModal';

export default function MathFarm({ onBack, onCompleteLevel }) {
  const [mathLevels, setMathLevels] = useState(() => {
    const list = dataManager.getShuffledMath();
    return (list && list.length > 0) ? list : dataManager.getMathLevels();
  });
  const [levelIndex, setLevelIndex] = useState(0);
  const [tappedItems, setTappedItems] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    return dataManager.subscribe(() => {
      const dbList = dataManager.getShuffledMath();
      if (dbList && dbList.length > 0) {
        setMathLevels(dbList);
      }
    });
  }, []);

  const currentLevel = (mathLevels && mathLevels.length > 0) ? (mathLevels[levelIndex % mathLevels.length] || mathLevels[0]) : null;

  useEffect(() => {
    if (currentLevel) {
      resetLevel();
    }
  }, [levelIndex, mathLevels]);

  const resetLevel = () => {
    if (!currentLevel) return;
    setTappedItems([]);
    setSelectedOption(null);
    setIsSuccessModalOpen(false);
    setIsErrorModalOpen(false);
    setErrorMessage('');
    if (currentLevel.promptVN) {
      sounds.speak(currentLevel.promptVN, 'vi-VN');
    }
  };

  const handleReshuffleAndReset = () => {
    sounds.playClick();
    const shuffled = dataManager.getShuffledMath();
    if (shuffled && shuffled.length > 0) {
      setMathLevels(shuffled);
    }
    setLevelIndex(0);
    resetLevel();
  };

  const handleTapCountItem = (index) => {
    if (tappedItems.includes(index) || isSuccessModalOpen || isErrorModalOpen) return;
    sounds.playCoin();
    const nextTapped = [...tappedItems, index];
    setTappedItems(nextTapped);
    sounds.speak(nextTapped.length.toString(), 'vi-VN');
  };

  const handleChooseOption = (opt) => {
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
      onCompleteLevel('math', { correct: true, starsEarned: 1, coinsEarned: 15 });
    } else {
      sounds.playError();
      setErrorMessage(`Đáp án "${opt}" chưa chính xác rồi bé ơi! Bé thử quan sát và đếm lại xem nào! 🍎`);
      setIsErrorModalOpen(true);
      sounds.speak('Bé thử chọn lại xem nào!', 'vi-VN');
    }
  };

  const handleNextLevel = () => {
    sounds.playClick();
    setIsSuccessModalOpen(false);
    setIsErrorModalOpen(false);
    if (mathLevels && mathLevels.length > 0) {
      setLevelIndex((prev) => (prev + 1) % mathLevels.length);
    }
  };

  const handleRetryAfterError = () => {
    setIsErrorModalOpen(false);
    setSelectedOption(null);
  };

  if (!mathLevels || mathLevels.length === 0 || !currentLevel) {
    return (
      <div style={{ maxWidth: '600px', margin: '40px auto', padding: '16px', textAlign: 'center' }}>
        <div className="kid-card" style={{ padding: '36px', background: '#fff' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🍎</div>
          <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#1e293b', marginBottom: '8px' }}>
            Đang Tải Câu Hỏi Toán Học...
          </h2>
          <p style={{ color: '#64748b', fontSize: '15px', marginBottom: '24px' }}>
            Dữ liệu bài tập toán đang được đồng bộ trực tiếp từ Supabase Database.
          </p>
          <button onClick={onBack} className="btn-kid btn-green" style={{ padding: '10px 24px' }}>
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
          className="btn-kid btn-green" 
          style={{ padding: '5px 10px', fontSize: '12px', flexShrink: 0 }}
        >
          <ArrowLeft size={14} />
          <span>Bản đồ</span>
        </button>

        <div style={{
          background: '#ecfdf5',
          color: '#047857',
          padding: '4px 10px',
          borderRadius: '999px',
          fontWeight: 800,
          fontSize: '11.5px',
          border: '1.5px solid #a7f3d0',
          textAlign: 'center',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          maxWidth: '65%'
        }}>
          Màn {levelIndex + 1}/{mathLevels.length}: {currentLevel.title}
        </div>

        <button onClick={handleReshuffleAndReset} className="btn-kid btn-yellow" style={{ padding: '5px 7px' }} title="Xáo trộn lại toàn bộ câu hỏi toán">
          <RefreshCw size={12} />
        </button>
      </div>

      {/* Main Farm Card - Cohesive Centered Layout */}
      <div className="game-card-compact">
        {/* Top Header Prompt */}
        <div style={{ textAlign: 'center', flexShrink: 0 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', marginBottom: '2px' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(14px, 2.5vh, 17.5px)', color: '#065f46', fontWeight: 900, margin: 0 }}>
              {currentLevel.promptVN}
            </h3>
            <button
              onClick={() => sounds.speak(currentLevel.promptVN, 'vi-VN')}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#10b981', display: 'flex', alignItems: 'center', padding: '2px' }}
              title="Nghe lại câu hỏi"
            >
              <Volume2 size={16} />
            </button>
          </div>
          <p style={{ color: '#64748b', fontSize: 'clamp(11px, 1.8vh, 12.5px)', fontWeight: 600, margin: '0 0 6px' }}>
            {currentLevel.promptEN}
          </p>
        </div>

        {/* Level Type: COUNT (Tap items) */}
        {currentLevel.type === 'count' && (
          <div style={{ flexShrink: 0, textAlign: 'center', margin: 'auto 0' }}>
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: 'clamp(8px, 2vw, 14px)',
              flexWrap: 'wrap',
              margin: '4px 0',
              padding: 'clamp(10px, 2vh, 16px)',
              background: '#f0fdf4',
              borderRadius: '18px',
              border: '2.5px dashed #86efac'
            }}>
              {Array.from({ length: currentLevel.targetCount }).map((_, idx) => {
                const isTapped = tappedItems.includes(idx);
                return (
                  <div
                    key={idx}
                    onClick={() => handleTapCountItem(idx)}
                    className="count-item-box animate-wiggle"
                    style={{
                      width: 'clamp(48px, 9.5vh, 66px)',
                      height: 'clamp(48px, 9.5vh, 66px)',
                      fontSize: 'clamp(26px, 5vh, 38px)',
                      background: isTapped ? '#bbf7d0' : '#ffffff',
                      border: isTapped ? '3px solid #22c55e' : '2.5px solid #e2e8f0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      transform: isTapped ? 'scale(1.1)' : 'scale(1)',
                      boxShadow: isTapped ? '0 4px 0 #16a34a' : '0 3px 0 #cbd5e1',
                      transition: 'all 0.15s ease',
                      position: 'relative',
                      borderRadius: '14px',
                      overflow: 'hidden'
                    }}
                  >
                    {getRealPhotoForMath(currentLevel.itemEmoji, currentLevel.promptVN || currentLevel.title) ? (
                      <img 
                        src={getRealPhotoForMath(currentLevel.itemEmoji, currentLevel.promptVN || currentLevel.title)} 
                        alt="" 
                        style={{
                          width: '80%',
                          height: '80%',
                          objectFit: 'cover',
                          borderRadius: '10px'
                        }}
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          if (e.currentTarget.nextSibling) e.currentTarget.nextSibling.style.display = 'inline';
                        }}
                      />
                    ) : null}
                    <span style={{ display: getRealPhotoForMath(currentLevel.itemEmoji, currentLevel.promptVN || currentLevel.title) ? 'none' : 'inline' }}>
                      {currentLevel.itemEmoji}
                    </span>
                    {isTapped && (
                      <span style={{
                        position: 'absolute',
                        top: '-7px',
                        right: '-7px',
                        background: '#16a34a',
                        color: 'white',
                        width: '20px',
                        height: '20px',
                        borderRadius: '50%',
                        fontSize: '11px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 900,
                        boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                      }}>
                        {tappedItems.indexOf(idx) + 1}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            <div style={{ fontSize: 'clamp(12px, 2vh, 13.5px)', color: '#16a34a', fontWeight: 800, margin: '4px 0 2px' }}>
              Bé đã đếm được: {tappedItems.length} {currentLevel.itemEmoji}
            </div>
          </div>
        )}

        {/* Level Type: ADDITION (Visual Plus) */}
        {currentLevel.type === 'addition' && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 'clamp(8px, 2vw, 16px)',
            margin: 'auto 0',
            flexWrap: 'wrap',
            padding: 'clamp(10px, 2vh, 16px)',
            background: '#fefce8',
            borderRadius: '18px',
            border: '2.5px solid #fef08a',
            flexShrink: 0
          }}>
            {/* Group 1 */}
            <div style={{ background: '#ffffff', padding: '6px 14px', borderRadius: '14px', border: '2px solid #facc15', textAlign: 'center', boxShadow: '0 3px 0 #fde047' }}>
              <div style={{ fontSize: 'clamp(22px, 4.5vh, 30px)' }}>{currentLevel.itemEmoji.repeat(currentLevel.num1)}</div>
              <div style={{ fontWeight: 900, fontSize: 'clamp(15px, 2.8vh, 20px)', color: '#854d0e', marginTop: '2px' }}>{currentLevel.num1}</div>
            </div>

            <span style={{ fontSize: 'clamp(22px, 4.5vh, 28px)', fontWeight: 900, color: '#ca8a04' }}>+</span>

            {/* Group 2 */}
            <div style={{ background: '#ffffff', padding: '6px 14px', borderRadius: '14px', border: '2px solid #facc15', textAlign: 'center', boxShadow: '0 3px 0 #fde047' }}>
              <div style={{ fontSize: 'clamp(22px, 4.5vh, 30px)' }}>{currentLevel.itemEmoji.repeat(currentLevel.num2)}</div>
              <div style={{ fontWeight: 900, fontSize: 'clamp(15px, 2.8vh, 20px)', color: '#854d0e', marginTop: '2px' }}>{currentLevel.num2}</div>
            </div>

            <span style={{ fontSize: 'clamp(22px, 4.5vh, 28px)', fontWeight: 900, color: '#ca8a04' }}>=</span>

            {/* Question Mark */}
            <div style={{
              width: 'clamp(44px, 8vh, 54px)',
              height: 'clamp(44px, 8vh, 54px)',
              borderRadius: '14px',
              background: '#fef08a',
              border: '2px dashed #ca8a04',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 'clamp(22px, 4vh, 28px)',
              fontWeight: 900,
              color: '#854d0e'
            }}>
              ?
            </div>
          </div>
        )}

        {/* Level Type: COMPARE (Which is bigger) */}
        {currentLevel.type === 'compare' && (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: 'clamp(8px, 2vw, 16px)',
            margin: 'auto 0',
            flexWrap: 'wrap',
            flexShrink: 0
          }}>
            <div style={{
              background: '#f0fdf4',
              padding: '10px 16px',
              borderRadius: '16px',
              border: '2px solid #86efac',
              minWidth: '120px',
              textAlign: 'center',
              boxShadow: '0 3px 0 #bbf7d0'
            }}>
              <div style={{ fontSize: 'clamp(22px, 4.5vh, 28px)' }}>
                {currentLevel.sideA.emoji.repeat(currentLevel.sideA.count)}
              </div>
              <div style={{ fontWeight: 900, color: '#16a34a', marginTop: '4px', fontSize: '13px' }}>
                Bên Trái: {currentLevel.sideA.count}
              </div>
            </div>

            <div style={{
              background: '#f0fdf4',
              padding: '10px 16px',
              borderRadius: '16px',
              border: '2px solid #86efac',
              minWidth: '120px',
              textAlign: 'center',
              boxShadow: '0 3px 0 #bbf7d0'
            }}>
              <div style={{ fontSize: 'clamp(22px, 4.5vh, 28px)' }}>
                {currentLevel.sideB.emoji.repeat(currentLevel.sideB.count)}
              </div>
              <div style={{ fontWeight: 900, color: '#16a34a', marginTop: '4px', fontSize: '13px' }}>
                Bên Phải: {currentLevel.sideB.count}
              </div>
            </div>
          </div>
        )}

        {/* Answer Options Area */}
        <div style={{ margin: '6px 0', flexShrink: 0, textAlign: 'center' }}>
          <div style={{ fontSize: 'clamp(12.5px, 2vh, 14px)', fontWeight: 800, color: '#334155', marginBottom: '6px' }}>
            Bé hãy chọn đáp án đúng:
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 'clamp(6px, 1.8vw, 12px)', flexWrap: 'wrap' }}>
            {currentLevel.options.map((opt, idx) => (
              <button
                key={idx}
                onClick={() => handleChooseOption(opt)}
                className="btn-kid btn-yellow"
                style={{
                  minWidth: 'clamp(58px, 15vw, 76px)',
                  height: 'clamp(40px, 6.5vh, 48px)',
                  fontSize: 'clamp(17px, 2.8vh, 21px)',
                  borderRadius: '12px',
                  padding: '3px 14px',
                  fontWeight: 900
                }}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Result Modal: Success Celebratory Popup */}
      <GameResultModal
        isOpen={isSuccessModalOpen}
        type="math"
        title="Chính xác! Bé tính toán siêu quá! 🌟"
        subtitle="Bé đã hoàn thành xuất sắc câu đố toán học kỳ diệu!"
        starsEarned={1}
        coinsEarned={15}
        onNext={handleNextLevel}
        onReplay={resetLevel}
        onGoMap={onBack}
      />

      {/* Error / Wrong Attempt Modal */}
      <GameErrorModal
        isOpen={isErrorModalOpen}
        onClose={() => setIsErrorModalOpen(false)}
        onRetry={handleRetryAfterError}
        message={errorMessage || 'Chưa chính xác rồi bé ơi! Bé thử tính và chọn lại nhé!'}
      />
    </div>
  );
}
