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
        <button onClick={onBack} className="btn-kid btn-green" style={{ padding: '8px 14px', fontSize: '13px' }}>
          <ArrowLeft size={16} />
          <span>Bản đồ</span>
        </button>

        <div style={{
          background: '#ecfdf5',
          color: '#047857',
          padding: '5px 14px',
          borderRadius: '999px',
          fontWeight: 800,
          fontSize: '13px',
          border: '2px solid #a7f3d0',
          textAlign: 'center'
        }}>
          Màn {levelIndex + 1} / {mathLevels.length}: {currentLevel.title}
        </div>

        <button onClick={resetLevel} className="btn-kid btn-yellow" style={{ padding: '8px 12px' }} title="Làm lại màn này">
          <RefreshCw size={16} />
        </button>
      </div>

      {/* Main Farm Card */}
      <div className="kid-card" style={{ padding: 'clamp(16px, 4vw, 32px)', textAlign: 'center', background: '#ffffff' }}>
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(18px, 4vw, 22px)', color: '#065f46', fontWeight: 800, marginBottom: '8px' }}>
          {currentLevel.promptVN}
        </h3>
        <p style={{ color: '#64748b', fontSize: '14px', fontWeight: 600, marginBottom: '20px' }}>
          {currentLevel.promptEN}
        </p>

        {/* Level Type: COUNT (Tap items) */}
        {currentLevel.type === 'count' && (
          <div>
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: 'clamp(8px, 2vw, 16px)',
              flexWrap: 'wrap',
              margin: '16px 0',
              padding: 'clamp(14px, 3vw, 24px)',
              background: '#f0fdf4',
              borderRadius: '20px',
              border: '3px dashed #86efac'
            }}>
              {Array.from({ length: currentLevel.targetCount }).map((_, idx) => {
                const isTapped = tappedItems.includes(idx);
                return (
                  <div
                    key={idx}
                    onClick={() => handleTapCountItem(idx)}
                    className="count-item-box"
                    style={{
                      background: isTapped ? '#bbf7d0' : '#ffffff',
                      border: isTapped ? '3px solid #22c55e' : '3px solid #e2e8f0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      transform: isTapped ? 'scale(1.1)' : 'scale(1)',
                      boxShadow: isTapped ? '0 6px 0 #16a34a' : '0 4px 0 #cbd5e1',
                      transition: 'all 0.15s ease',
                      position: 'relative'
                    }}
                  >
                    <span>{currentLevel.itemEmoji}</span>
                    {isTapped && (
                      <span style={{
                        position: 'absolute',
                        top: '-8px',
                        right: '-8px',
                        background: '#16a34a',
                        color: 'white',
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        fontSize: '12px',
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

            <div style={{ fontSize: '15px', color: '#16a34a', fontWeight: 800, marginBottom: '16px' }}>
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
            gap: '16px',
            margin: '20px 0',
            flexWrap: 'wrap',
            padding: '24px',
            background: '#fefce8',
            borderRadius: '24px',
            border: '3px solid #fef08a'
          }}>
            {/* Group 1 */}
            <div style={{ background: '#ffffff', padding: '16px', borderRadius: '16px', border: '2px solid #facc15' }}>
              <div style={{ fontSize: '32px' }}>{currentLevel.itemEmoji.repeat(currentLevel.num1)}</div>
              <div style={{ fontWeight: 800, fontSize: '20px', color: '#854d0e', marginTop: '4px' }}>{currentLevel.num1}</div>
            </div>

            <span style={{ fontSize: '36px', fontWeight: 900, color: '#ca8a04' }}>+</span>

            {/* Group 2 */}
            <div style={{ background: '#ffffff', padding: '16px', borderRadius: '16px', border: '2px solid #facc15' }}>
              <div style={{ fontSize: '32px' }}>{currentLevel.itemEmoji.repeat(currentLevel.num2)}</div>
              <div style={{ fontWeight: 800, fontSize: '20px', color: '#854d0e', marginTop: '4px' }}>{currentLevel.num2}</div>
            </div>

            <span style={{ fontSize: '36px', fontWeight: 900, color: '#ca8a04' }}>=</span>

            {/* Question Mark */}
            <div style={{
              width: '70px',
              height: '70px',
              borderRadius: '16px',
              background: '#fef08a',
              border: '3px dashed #ca8a04',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '32px',
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
            gap: '24px',
            margin: '24px 0',
            flexWrap: 'wrap'
          }}>
            <div style={{
              background: '#f0fdf4',
              padding: '20px',
              borderRadius: '20px',
              border: '3px solid #86efac',
              minWidth: '150px'
            }}>
              <div style={{ fontSize: '32px', minHeight: '48px' }}>
                {currentLevel.sideA.emoji.repeat(currentLevel.sideA.count)}
              </div>
              <div style={{ fontWeight: 800, color: '#16a34a', marginTop: '8px' }}>
                Bên Trái: {currentLevel.sideA.count}
              </div>
            </div>

            <div style={{
              background: '#f0fdf4',
              padding: '20px',
              borderRadius: '20px',
              border: '3px solid #86efac',
              minWidth: '150px'
            }}>
              <div style={{ fontSize: '32px', minHeight: '48px' }}>
                {currentLevel.sideB.emoji.repeat(currentLevel.sideB.count)}
              </div>
              <div style={{ fontWeight: 800, color: '#16a34a', marginTop: '8px' }}>
                Bên Phải: {currentLevel.sideB.count}
              </div>
            </div>
          </div>
        )}

        {/* Answer Options */}
        <div style={{ marginTop: '20px' }}>
          <div style={{ fontSize: '14px', fontWeight: 800, color: '#334155', marginBottom: '10px' }}>
            Bé hãy chọn đáp án đúng:
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', flexWrap: 'wrap' }}>
            {currentLevel.options.map((opt, idx) => (
              <button
                key={idx}
                onClick={() => handleChooseOption(opt)}
                className={`btn-kid ${selectedOption === opt && !isSuccess ? 'btn-pink' : 'btn-yellow'}`}
                style={{
                  minWidth: '70px',
                  height: '48px',
                  fontSize: '20px',
                  borderRadius: '14px',
                  padding: '6px 18px'
                }}
              >
                {opt}
              </button>
            ))}
          </div>

          {/* Explicit Wrong Feedback */}
          {wrongMsg && (
            <div className="animate-shake" style={{
              background: '#fef2f2',
              border: '1.5px solid #fecaca',
              color: '#b91c1c',
              padding: '8px 14px',
              borderRadius: '12px',
              fontSize: '12.5px',
              fontWeight: 800,
              marginTop: '12px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <span>❌</span>
              <span>{wrongMsg}</span>
            </div>
          )}
        </div>

        {/* Win Banner */}
        {isSuccess && (
          <div className="animate-pop-in" style={{
            marginTop: '28px',
            padding: '20px',
            background: 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)',
            borderRadius: '20px',
            border: '3px solid #22c55e',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <CheckCircle2 size={36} color="#16a34a" />
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: '18px', fontWeight: 800, color: '#14532d' }}>
                  Chính xác rồi! Bé tính toán siêu quá! 🌟
                </div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#16a34a' }}>
                  +1 Sao Vàng 🌟 &middot; +15 Xu 🪙
                </div>
              </div>
            </div>

            <button onClick={handleNextLevel} className="btn-kid btn-green" style={{ padding: '10px 24px', fontSize: '16px' }}>
              <span>Câu tiếp theo</span>
              <Sparkles size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
