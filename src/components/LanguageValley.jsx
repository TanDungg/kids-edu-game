import React, { useState, useEffect } from 'react';
import { Volume2, ArrowLeft, RefreshCw, CheckCircle2, Sparkles, HelpCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { dataManager, shuffleArray } from '../services/dataManager';
import { sounds } from '../utils/sound';

const DEFAULT_WORDS = [
  { id: 1, vn: 'Con Mèo', en: 'Cat', emoji: '🐱', theme: 'Động vật', targetVN: 'MÈO', targetEN: 'CAT', hintVN: 'Loài vật thích bắt chuột, kêu meo meo', hintEN: 'A small pet that purrs' },
  { id: 2, vn: 'Quả Táo', en: 'Apple', emoji: '🍎', theme: 'Trái cây', targetVN: 'TÁO', targetEN: 'APPLE', hintVN: 'Trái cây màu đỏ ngọt thơm, giòn tan', hintEN: 'A red sweet crunchy fruit' },
  { id: 3, vn: 'Mặt Trời', en: 'Sun', emoji: '☀️', theme: 'Tự nhiên', targetVN: 'TRỜI', targetEN: 'SUN', hintVN: 'Tỏa ánh sáng ấm áp vào ban ngày', hintEN: 'Shines bright in daytime sky' },
  { id: 4, vn: 'Chiếc Xe', en: 'Car', emoji: '🚗', theme: 'Phương tiện', targetVN: 'XE', targetEN: 'CAR', hintVN: 'Phương tiện có 4 bánh chạy trên đường', hintEN: 'Vehicle with four wheels' },
  { id: 5, vn: 'Con Chó', en: 'Dog', emoji: '🐶', theme: 'Động vật', targetVN: 'CHÓ', targetEN: 'DOG', hintVN: 'Bạn bốn chân trung thành giữ nhà', hintEN: 'A faithful four-legged friend' }
];

export default function LanguageValley({ onBack, onCompleteLevel }) {
  // Shuffled question list for this play session
  const [wordsList, setWordsList] = useState(() => {
    const list = dataManager.getShuffledWords();
    return (list && list.length > 0) ? list : DEFAULT_WORDS;
  });
  const [levelIndex, setLevelIndex] = useState(0);
  const [mode, setMode] = useState('VN'); // 'VN' or 'EN'
  const [currentGuess, setCurrentGuess] = useState([]);
  const [scrambledLetters, setScrambledLetters] = useState([]);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [wrongMsg, setWrongMsg] = useState('');

  useEffect(() => {
    return dataManager.subscribe(() => {
      const dbList = dataManager.getShuffledWords();
      if (dbList && dbList.length > 0) {
        setWordsList(dbList);
      }
    });
  }, []);

  const currentLevel = (wordsList && wordsList.length > 0) 
    ? (wordsList[levelIndex % wordsList.length] || wordsList[0]) 
    : DEFAULT_WORDS[0];

  // Parse words cleanly into words array to support multi-word expressions (e.g. ['CON', 'MÈO'])
  const getCleanTargetWords = (lvl, currentMode) => {
    if (!lvl) return ['MÈO'];
    let raw = currentMode === 'VN' 
      ? (lvl.targetVN || lvl.target_vn || lvl.vn || '') 
      : (lvl.targetEN || lvl.target_en || lvl.en || '');
    const words = String(raw).toUpperCase().trim().split(/\s+/).filter(Boolean);
    return words.length > 0 ? words : [currentMode === 'VN' ? 'MÈO' : 'CAT'];
  };

  const targetWords = getCleanTargetWords(currentLevel, mode);
  const targetWord = targetWords.join('');
  const totalLetters = targetWord.length;

  // Setup scrambled letters when level changes or mode changes
  useEffect(() => {
    if (targetWord) {
      resetPuzzle();
    }
  }, [levelIndex, mode, wordsList, targetWord]);

  const resetPuzzle = () => {
    if (!targetWord) return;
    setIsSuccess(false);
    setWrongMsg('');
    setCurrentGuess([]);
    setShowHint(false);

    // Target letters
    const letters = targetWord.split('');

    // Plausible distractor letters that do not duplicate target letters
    const alphabet = 'ABCDEGHKLMNOPQRSTUVXY';
    const distractors = [];
    let attempts = 0;
    while (distractors.length < 2 && attempts < 30) {
      attempts++;
      const candidate = alphabet[Math.floor(Math.random() * alphabet.length)];
      if (!letters.includes(candidate) && !distractors.includes(candidate)) {
        distractors.push(candidate);
      }
    }

    // Combine and shuffle with fixed static slots
    const combined = [...letters, ...distractors];
    const shuffled = shuffleArray(
      combined.map((char, index) => ({ 
        char, 
        id: `${char}_${index}_${Math.random()}`,
        isUsed: false 
      }))
    );

    setScrambledLetters(shuffled);
  };

  const handlePickLetter = (item) => {
    if (isSuccess || item.isUsed) return;
    sounds.playClick();
    setWrongMsg('');

    // Check if adding this letter fits the length
    if (currentGuess.length < totalLetters) {
      const nextGuess = [...currentGuess, item];
      setCurrentGuess(nextGuess);
      
      // Mark as used in scrambledLetters WITHOUT shifting or re-sorting remaining letters
      setScrambledLetters(prev => prev.map(l => l.id === item.id ? { ...l, isUsed: true } : l));

      // If word is complete, check answer
      if (nextGuess.length === totalLetters) {
        const guessedString = nextGuess.map(i => i.char).join('');
        if (guessedString === targetWord) {
          handleWin();
        } else {
          sounds.playError();
          setWrongMsg('Chưa chính xác rồi bé ơi! Bé bấm vào ô chữ màu đỏ để sửa lại nhé! ❌');
        }
      }
    }
  };

  const handleRemoveLetter = (indexToRemove) => {
    if (isSuccess) return;
    sounds.playClick();
    setWrongMsg('');
    const removedItem = currentGuess[indexToRemove];
    setCurrentGuess(currentGuess.filter((_, idx) => idx !== indexToRemove));
    
    // Put letter back at its EXACT original spot
    if (removedItem) {
      setScrambledLetters(prev => prev.map(l => l.id === removedItem.id ? { ...l, isUsed: false } : l));
    }
  };

  const handleWin = () => {
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
    onCompleteLevel('language', { correct: true, starsEarned: 1, coinsEarned: 15 });
  };

  const handleSpeakVN = () => {
    sounds.speak(currentLevel.vn, 'vi-VN');
  };

  const handleSpeakEN = () => {
    sounds.speak(currentLevel.en, 'en-US');
  };

  const handleNextWord = () => {
    sounds.playClick();
    setLevelIndex((prev) => (prev + 1) % (wordsList.length || 1));
  };

  const handleReshuffleAndReset = () => {
    sounds.playClick();
    setWordsList(dataManager.getShuffledWords());
    setLevelIndex(0);
    resetPuzzle();
  };

  if (!wordsList || wordsList.length === 0 || !currentLevel) {
    return (
      <div style={{ maxWidth: '600px', margin: '40px auto', padding: '16px', textAlign: 'center' }}>
        <div className="kid-card" style={{ padding: '36px', background: '#fff' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>📚</div>
          <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#1e293b', marginBottom: '8px' }}>
            Đang Tải Câu Hỏi Từ Database...
          </h2>
          <p style={{ color: '#64748b', fontSize: '15px', marginBottom: '24px' }}>
            Dữ liệu từ vựng đang được đồng bộ trực tiếp từ Supabase Database.
          </p>
          <button onClick={onBack} className="btn-kid btn-blue" style={{ padding: '10px 24px' }}>
            <ArrowLeft size={18} />
            <span>Quay lại Bản đồ</span>
          </button>
        </div>
      </div>
    );
  }

  // Global slot counter for multi-word groupings
  let currentSlotIndexTracker = 0;

  return (
    <div className="page-container" style={{ maxWidth: '750px' }}>
      {/* Top Bar - Clean Responsive Single-Line Controls */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '6px',
        marginBottom: '10px'
      }}>
        <button onClick={onBack} className="btn-kid btn-blue" style={{ padding: '6px 12px', fontSize: '12px', flexShrink: 0 }}>
          <ArrowLeft size={15} />
          <span>Bản đồ</span>
        </button>

        {/* Language Switcher Segmented Control */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          background: '#ffffff',
          padding: '2px',
          borderRadius: '999px',
          border: '2px solid #e2e8f0',
          boxShadow: '0 2px 6px rgba(0,0,0,0.04)',
          height: '32px',
          boxSizing: 'border-box'
        }}>
          <button
            type="button"
            onClick={() => { sounds.playClick(); setMode('VN'); }}
            style={{
              border: 'none',
              cursor: 'pointer',
              padding: '3px 9px',
              borderRadius: '999px',
              fontSize: '11.5px',
              fontWeight: 800,
              fontFamily: 'inherit',
              transition: 'all 0.2s ease',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              background: mode === 'VN' ? 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)' : 'transparent',
              color: mode === 'VN' ? '#ffffff' : '#64748b',
              boxShadow: mode === 'VN' ? '0 2px 6px rgba(219, 39, 119, 0.35)' : 'none',
              outline: 'none'
            }}
          >
            <span>🇻🇳</span> <span className="hide-on-mobile">Tiếng </span>Việt
          </button>
          <button
            type="button"
            onClick={() => { sounds.playClick(); setMode('EN'); }}
            style={{
              border: 'none',
              cursor: 'pointer',
              padding: '3px 9px',
              borderRadius: '999px',
              fontSize: '11.5px',
              fontWeight: 800,
              fontFamily: 'inherit',
              transition: 'all 0.2s ease',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              background: mode === 'EN' ? 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)' : 'transparent',
              color: mode === 'EN' ? '#ffffff' : '#64748b',
              boxShadow: mode === 'EN' ? '0 2px 6px rgba(37, 99, 235, 0.35)' : 'none',
              outline: 'none'
            }}
          >
            <span>🇬🇧</span> English
          </button>
        </div>

        {/* Progress Pill & Reshuffle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0 }}>
          <div style={{
            background: '#fdf2f8',
            color: '#db2777',
            padding: '4px 8px',
            borderRadius: '999px',
            fontWeight: 800,
            fontSize: '11px',
            border: '1.5px solid #fbcfe8',
            whiteSpace: 'nowrap'
          }}>
            {levelIndex + 1}/{wordsList.length}
          </div>
          <button onClick={handleReshuffleAndReset} className="btn-kid btn-yellow" style={{ padding: '6px 8px' }} title="Xáo trộn lại câu hỏi">
            <RefreshCw size={13} />
          </button>
        </div>
      </div>

      {/* Main Flashcard - Compact single-screen layout */}
      <div className="kid-card" style={{ padding: 'clamp(10px, 3vw, 20px)', textAlign: 'center', background: '#ffffff', position: 'relative' }}>
        {/* Mascot & Theme */}
        <div style={{ display: 'inline-block', background: '#fdf2f8', padding: '3px 12px', borderRadius: '999px', color: '#db2777', fontWeight: 800, fontSize: '11px', marginBottom: '4px' }}>
          Chủ đề: {currentLevel.theme}
        </div>

        <div style={{ fontSize: 'clamp(48px, 12vw, 76px)', margin: '2px 0' }} className="animate-bounce-slow">
          {currentLevel.emoji}
        </div>

        {/* Prompt */}
        <p style={{ color: '#334155', fontSize: 'clamp(13px, 3vw, 15px)', fontWeight: 800, margin: '4px 0 12px' }}>
          {mode === 'VN' 
            ? 'Bé nhìn hình đoán xem đây là gì và ghép chữ nhé!' 
            : 'Look at the picture and tap the letters to spell!'}
        </p>

        {/* Word Target Slots - Grouped by Word for Proper Line Breaking */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 'clamp(6px, 2vw, 12px)',
          marginBottom: '12px',
          flexWrap: 'wrap',
          width: '100%',
          boxSizing: 'border-box'
        }}>
          {targetWords.map((word, wIdx) => (
            <div key={wIdx} style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 'clamp(2.5px, 1vw, 6px)',
              background: targetWords.length > 1 ? '#f8fafc' : 'transparent',
              padding: targetWords.length > 1 ? '3px 6px' : 0,
              borderRadius: '12px',
              border: targetWords.length > 1 ? '1.5px dashed #cbd5e1' : 'none'
            }}>
              {word.split('').map((_, cIdx) => {
                const slotIndex = currentSlotIndexTracker++;
                const filled = currentGuess[slotIndex];
                const slotWidth = Math.max(28, Math.min(46, Math.floor(260 / Math.max(word.length, 4))));
                const slotHeight = Math.round(slotWidth * 1.2);
                const slotFont = Math.round(slotWidth * 0.55);

                return (
                  <div
                    key={cIdx}
                    onClick={() => filled && handleRemoveLetter(slotIndex)}
                    style={{
                      width: `${slotWidth}px`,
                      height: `${slotHeight}px`,
                      fontSize: `${slotFont}px`,
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 900,
                      border: filled ? (wrongMsg ? '2px solid #ef4444' : '2.5px solid #ec4899') : '2px dashed #cbd5e1',
                      background: filled ? (wrongMsg ? '#fef2f2' : '#fdf2f8') : '#f8fafc',
                      color: wrongMsg ? '#b91c1c' : '#be185d',
                      cursor: filled ? 'pointer' : 'default',
                      boxShadow: filled ? (wrongMsg ? '0 2px 0 #dc2626' : '0 2px 0 #db2777') : 'none',
                      flexShrink: 0,
                      transition: 'all 0.15s ease',
                      userSelect: 'none'
                    }}
                  >
                    {filled ? filled.char : ''}
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {/* Scrambled Letter Options to Pick - STATIC FIXED SLOTS (Never jump around) */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: 'clamp(4px, 1.2vw, 8px)',
          flexWrap: 'wrap',
          maxWidth: '420px',
          margin: '0 auto',
          minHeight: '44px'
        }}>
          {scrambledLetters.map((item) => (
            <div 
              key={item.id}
              style={{
                width: 'clamp(34px, 8.5vw, 44px)',
                height: 'clamp(38px, 9.5vw, 48px)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {item.isUsed ? (
                <div style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: '10px',
                  border: '1.5px dashed #e2e8f0',
                  background: 'rgba(241, 245, 249, 0.6)'
                }} />
              ) : (
                <button
                  onClick={() => handlePickLetter(item)}
                  className="btn-kid btn-yellow animate-pop-in"
                  style={{
                    width: '100%',
                    height: '100%',
                    fontSize: 'clamp(16px, 4vw, 20px)',
                    fontWeight: 900,
                    borderRadius: '10px',
                    padding: 0
                  }}
                >
                  {item.char}
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Clear Wrong Feedback Message */}
        {wrongMsg && (
          <div className="animate-shake" style={{
            background: '#fef2f2',
            border: '1.5px solid #fecaca',
            color: '#b91c1c',
            padding: '6px 12px',
            borderRadius: '10px',
            fontSize: '12px',
            fontWeight: 800,
            marginTop: '8px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <span>❌</span>
            <span>{wrongMsg}</span>
          </div>
        )}

        {/* Success Modal: REVEAL WORD & PRONUNCIATION BUTTONS ONLY AFTER SOLVED */}
        {isSuccess && (
          <div className="animate-pop-in" style={{
            marginTop: '14px',
            padding: '14px',
            background: 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)',
            borderRadius: '18px',
            border: '2px solid #22c55e',
            textAlign: 'center'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginBottom: '4px' }}>
              <CheckCircle2 size={24} color="#16a34a" />
              <span style={{ fontSize: '17px', fontWeight: 900, color: '#14532d' }}>
                Chính xác! Bé giỏi quá! 🎉
              </span>
            </div>

            <p style={{ fontSize: '12.5px', color: '#166534', fontWeight: 700, marginBottom: '10px' }}>
              Bé hãy bấm vào loa để nghe và đọc theo phát âm chuẩn nhé:
            </p>

            {/* Clickable Pronunciation Buttons */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
              <button 
                onClick={handleSpeakVN} 
                className="btn-kid btn-pink" 
                style={{ padding: '8px 16px', fontSize: '13.5px' }}
              >
                <Volume2 size={18} />
                <span>🇻🇳 {currentLevel.vn}</span>
              </button>
              <button 
                onClick={handleSpeakEN} 
                className="btn-kid btn-blue" 
                style={{ padding: '8px 16px', fontSize: '13.5px' }}
              >
                <Volume2 size={18} />
                <span>🇬🇧 {currentLevel.en}</span>
              </button>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '12px', fontWeight: 800, color: '#15803d' }}>
                +1 Sao 🌟 &middot; +15 Xu 🪙
              </span>
              <button onClick={handleNextWord} className="btn-kid btn-green" style={{ padding: '8px 18px', fontSize: '13.5px' }}>
                <span>Từ tiếp theo</span>
                <Sparkles size={15} />
              </button>
            </div>
          </div>
        )}

        {/* Hint Section */}
        {!isSuccess && (
          <div style={{ marginTop: '10px' }}>
            <button 
              onClick={() => setShowHint(!showHint)}
              style={{ background: 'none', border: 'none', color: '#64748b', fontSize: '12px', fontWeight: 700, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
            >
              <HelpCircle size={13} />
              {showHint ? 'Ẩn gợi ý' : 'Bé cần gợi ý không?'}
            </button>
            {showHint && (
              <div style={{ marginTop: '4px', fontSize: '12.5px', color: '#0369a1', background: '#f0f9ff', padding: '6px 12px', borderRadius: '10px', display: 'inline-block' }}>
                💡 {mode === 'VN' ? (currentLevel.hintVN || currentLevel.hint_vn || `Đây là từ "${currentLevel.vn}"`) : (currentLevel.hintEN || currentLevel.hint_en || `This is "${currentLevel.en}"`)}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
