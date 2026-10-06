import React, { useState, useEffect } from 'react';
import { ArrowLeft, RefreshCw, CheckCircle2, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { dataManager } from '../services/dataManager';
import { sounds } from '../utils/sound';

export default function MathFarm({ onBack, onCompleteLevel }) {
  const [mathLevels, setMathLevels] = useState(() => dataManager.getMathLevels());
  const [levelIndex, setLevelIndex] = useState(0);
  const [tappedItems, setTappedItems] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [wrongMsg, setWrongMsg] = useState('');

  useEffect(() => {
    return dataManager.subscribe(() => {
      setMathLevels(dataManager.getMathLevels());
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
    setIsSuccess(false);
    setWrongMsg('');
    if (currentLevel.promptVN) {
      sounds.speak(currentLevel.promptVN, 'vi-VN');
    }
  };

  const handleTapCountItem = (index) => {
    if (tappedItems.includes(index) || isSuccess) return;
    sounds.playCoin();
    const nextTapped = [...tappedItems, index];
    setTappedItems(nextTapped);
    sounds.speak(nextTapped.length.toString(), 'vi-VN');
  };

  const handleChooseOption = (opt) => {
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
      onCompleteLevel('math', { correct: true, starsEarned: 1, coinsEarned: 15 });
    } else {
      sounds.playError();
      setWrongMsg(`Chưa đúng rồi bé ơi! ${opt} chưa phải đáp án chính xác, bé thử chọn lại nhé! ❌`);
      sounds.speak('Bé thử chọn lại xem nào!', 'vi-VN');
    }
  };

  const handleNextLevel = () => {
    sounds.playClick();
    if (mathLevels && mathLevels.length > 0) {
      setLevelIndex((prev) => (prev + 1) % mathLevels.length);
    }
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
        marginBottom: '6px',
        flexShrink: 0
      }}>
        <button onClick={onBack} className="btn-kid btn-green" style={{ padding: '5px 10px', fontSize: '11.5px', flexShrink: 0 }}>
          <ArrowLeft size={14} />
          <span>Bản đồ</span>
        </button>

        <div style={{
          background: '#ecfdf5',
          color: '#047857',
          padding: '3px 10px',
          borderRadius: '999px',
          fontWeight: 800,
          fontSize: '11px',
          border: '1.5px solid #a7f3d0',
          textAlign: 'center',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          maxWidth: '65%'
        }}>
          Màn {levelIndex + 1}/{mathLevels.length}: {currentLevel.title}
        </div>

        <button onClick={resetLevel} className="btn-kid btn-yellow" style={{ padding: '5px 7px' }} title="Làm lại màn này">
          <RefreshCw size={12} />
        </button>
      </div>

      {/* Main Farm Card */}
      <div className="game-card-compact">
        {/* Top Header */}
        <div style={{ textAlign: 'center', flexShrink: 0 }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(14px, 2.5vh, 18px)', color: '#065f46', fontWeight: 800, margin: '0 0 2px' }}>
            {currentLevel.promptVN}
          </h3>
          <p style={{ color: '#64748b', fontSize: 'clamp(11px, 1.8vh, 13px)', fontWeight: 600, margin: '0 0 6px' }}>
            {currentLevel.promptEN}
          </p>
        </div>

        {/* Level Type: COUNT (Tap items) */}
        {currentLevel.type === 'count' && (
          <div style={{ flexShrink: 0, textAlign: 'center' }}>
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: 'clamp(6px, 1.5vw, 12px)',
              flexWrap: 'wrap',
              margin: '4px 0',
              padding: 'clamp(8px, 1.5vh, 14px)',
              background: '#f0fdf4',
              borderRadius: '16px',
              border: '2px dashed #86efac'
            }}>
              {Array.from({ length: currentLevel.targetCount }).map((_, idx) => {
                const isTapped = tappedItems.includes(idx);
                return (
                  <div
                    key={idx}
                    onClick={() => handleTapCountItem(idx)}
                    className="count-item-box"
                    style={{
                      width: 'clamp(42px, 8.5vh, 60px)',
                      height: 'clamp(42px, 8.5vh, 60px)',
                      fontSize: 'clamp(22px, 4.5vh, 32px)',
                      background: isTapped ? '#bbf7d0' : '#ffffff',
                      border: isTapped ? '2.5px solid #22c55e' : '2px solid #e2e8f0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      transform: isTapped ? 'scale(1.08)' : 'scale(1)',
                      boxShadow: isTapped ? '0 4px 0 #16a34a' : '0 3px 0 #cbd5e1',
                      transition: 'all 0.15s ease',
                      position: 'relative',
                      borderRadius: '12px'
                    }}
                  >
                    <span>{currentLevel.itemEmoji}</span>
                    {isTapped && (
                      <span style={{
                        position: 'absolute',
                        top: '-6px',
                        right: '-6px',
                        background: '#16a34a',
                        color: 'white',
                        width: '18px',
                        height: '18px',
                        borderRadius: '50%',
                        fontSize: '10px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 900
                      }}>
                        {tappedItems.indexOf(idx) + 1}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            <div style={{ fontSize: 'clamp(11px, 1.8vh, 13px)', color: '#16a34a', fontWeight: 800, margin: '2px 0 6px' }}>
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
            gap: 'clamp(8px, 2vw, 14px)',
            margin: '4px 0',
            flexWrap: 'wrap',
            padding: 'clamp(8px, 1.5vh, 14px)',
            background: '#fefce8',
            borderRadius: '16px',
            border: '2px solid #fef08a',
            flexShrink: 0
          }}>
            {/* Group 1 */}
            <div style={{ background: '#ffffff', padding: '6px 12px', borderRadius: '12px', border: '2px solid #facc15', textAlign: 'center' }}>
              <div style={{ fontSize: 'clamp(20px, 4.5vh, 28px)' }}>{currentLevel.itemEmoji.repeat(currentLevel.num1)}</div>
              <div style={{ fontWeight: 800, fontSize: 'clamp(14px, 2.5vh, 18px)', color: '#854d0e', marginTop: '2px' }}>{currentLevel.num1}</div>
            </div>

            <span style={{ fontSize: 'clamp(20px, 4.5vh, 28px)', fontWeight: 900, color: '#ca8a04' }}>+</span>

            {/* Group 2 */}
            <div style={{ background: '#ffffff', padding: '6px 12px', borderRadius: '12px', border: '2px solid #facc15', textAlign: 'center' }}>
              <div style={{ fontSize: 'clamp(20px, 4.5vh, 28px)' }}>{currentLevel.itemEmoji.repeat(currentLevel.num2)}</div>
              <div style={{ fontWeight: 800, fontSize: 'clamp(14px, 2.5vh, 18px)', color: '#854d0e', marginTop: '2px' }}>{currentLevel.num2}</div>
            </div>

            <span style={{ fontSize: 'clamp(20px, 4.5vh, 28px)', fontWeight: 900, color: '#ca8a04' }}>=</span>

            {/* Question Mark */}
            <div style={{
              width: 'clamp(40px, 7vh, 52px)',
              height: 'clamp(40px, 7vh, 52px)',
              borderRadius: '12px',
              background: '#fef08a',
              border: '2px dashed #ca8a04',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 'clamp(20px, 4vh, 26px)',
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
            margin: '4px 0',
            flexWrap: 'wrap',
            flexShrink: 0
          }}>
            <div style={{
              background: '#f0fdf4',
              padding: '8px 12px',
              borderRadius: '14px',
              border: '2px solid #86efac',
              minWidth: '120px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: 'clamp(20px, 4vh, 26px)' }}>
                {currentLevel.sideA.emoji.repeat(currentLevel.sideA.count)}
              </div>
              <div style={{ fontWeight: 800, color: '#16a34a', marginTop: '4px', fontSize: '12px' }}>
                Bên Trái: {currentLevel.sideA.count}
              </div>
            </div>

            <div style={{
              background: '#f0fdf4',
              padding: '8px 12px',
              borderRadius: '14px',
              border: '2px solid #86efac',
              minWidth: '120px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: 'clamp(20px, 4vh, 26px)' }}>
                {currentLevel.sideB.emoji.repeat(currentLevel.sideB.count)}
              </div>
              <div style={{ fontWeight: 800, color: '#16a34a', marginTop: '4px', fontSize: '12px' }}>
                Bên Phải: {currentLevel.sideB.count}
              </div>
            </div>
          </div>
        )}

        {/* Answer Options */}
        <div style={{ margin: '4px 0', flexShrink: 0, textAlign: 'center' }}>
          <div style={{ fontSize: 'clamp(12px, 2vh, 13.5px)', fontWeight: 800, color: '#334155', marginBottom: '6px' }}>
            Bé hãy chọn đáp án đúng:
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
                  onClick={() => handleChooseOption(opt)}
                  className={`btn-kid ${btnClass}`}
                  style={{
                    minWidth: 'clamp(56px, 15vw, 72px)',
                    height: 'clamp(38px, 6vh, 46px)',
                    fontSize: 'clamp(16px, 2.8vh, 20px)',
                    borderRadius: '12px',
                    padding: '2px 12px',
                    fontWeight: 900
                  }}
                >
                  {opt}
                  {isSuccess && isAnswerCorrect && ' ✓'}
                </button>
              );
            })}
          </div>

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
              marginTop: '6px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              <span>❌</span>
              <span>{wrongMsg}</span>
            </div>
          )}
        </div>

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
                  Chính xác rồi! Bé tính toán siêu quá! 🌟
                </div>
                <div style={{ fontSize: '11.5px', fontWeight: 700, color: '#16a34a' }}>
                  +1 Sao 🌟 &middot; +15 Xu 🪙
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
