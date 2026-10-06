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

  const getCleanTarget = (lvl, currentMode) => {
    if (!lvl) return 'MÈO';
    let raw = currentMode === 'VN' 
      ? (lvl.targetVN || lvl.target_vn || lvl.vn || '') 
      : (lvl.targetEN || lvl.target_en || lvl.en || '');
    const clean = String(raw).toUpperCase().replace(/\s+/g, '');
    return clean || (currentMode === 'VN' ? 'MÈO' : 'CAT');
  };

  const targetWord = getCleanTarget(currentLevel, mode);

  // Setup scrambled letters when level changes or mode changes
  useEffect(() => {
    if (targetWord) {
      resetPuzzle();
    }
  }, [levelIndex, mode, wordsList, targetWord]);

  const resetPuzzle = () => {
    if (!targetWord) return;
    setIsSuccess(false);
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

    // Combine and shuffle thoroughly
    const combined = [...letters, ...distractors];
    const shuffled = shuffleArray(
      combined.map((char, index) => ({ char, id: `${char}_${index}_${Math.random()}` }))
    );

    setScrambledLetters(shuffled);
  };

  const handlePickLetter = (item) => {
    if (isSuccess) return;
    sounds.playClick();

    // Check if adding this letter fits the length
    if (currentGuess.length < targetWord.length) {
      const nextGuess = [...currentGuess, item];
      setCurrentGuess(nextGuess);
      setScrambledLetters(scrambledLetters.filter(i => i.id !== item.id));

      // If word is complete, check answer
      if (nextGuess.length === targetWord.length) {
        const guessedString = nextGuess.map(i => i.char).join('');
        if (guessedString === targetWord) {
          handleWin();
        } else {
          sounds.playError();
        }
      }
    }
  };

  const handleRemoveLetter = (indexToRemove) => {
    if (isSuccess) return;
    sounds.playClick();
    const removedItem = currentGuess[indexToRemove];
    setCurrentGuess(currentGuess.filter((_, idx) => idx !== indexToRemove));
    setScrambledLetters([...scrambledLetters, removedItem]);
  };

  const handleWin = () => {
    setIsSuccess(true);
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

  return (
    <div className="page-container" style={{ maxWidth: '800px' }}>
      {/* Top Bar - Clean Responsive Single-Line Controls */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '6px',
        marginBottom: '14px'
      }}>
        <button onClick={onBack} className="btn-kid btn-blue" style={{ padding: '7px 12px', fontSize: '13px', flexShrink: 0 }}>
          <ArrowLeft size={16} />
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
          height: '36px',
          boxSizing: 'border-box'
        }}>
          <button
            type="button"
            onClick={() => { sounds.playClick(); setMode('VN'); }}
            style={{
              border: 'none',
              cursor: 'pointer',
              padding: '4px 10px',
              borderRadius: '999px',
              fontSize: '12px',
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
              padding: '4px 10px',
              borderRadius: '999px',
              fontSize: '12px',
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', flexShrink: 0 }}>
          <div style={{
            background: '#fdf2f8',
            color: '#db2777',
            padding: '5px 9px',
            borderRadius: '999px',
            fontWeight: 800,
            fontSize: '11px',
            border: '1.5px solid #fbcfe8',
            whiteSpace: 'nowrap'
          }}>
            {levelIndex + 1}/{wordsList.length}
          </div>
          <button onClick={handleReshuffleAndReset} className="btn-kid btn-yellow" style={{ padding: '7px 10px' }} title="Xáo trộn lại câu hỏi">
            <RefreshCw size={14} />
          </button>
        </div>
      </div>

      {/* Main Flashcard */}
      <div className="kid-card" style={{ padding: 'clamp(14px, 3.5vw, 28px)', textAlign: 'center', background: '#ffffff', position: 'relative' }}>
        {/* Mascot & Theme */}
        <div style={{ display: 'inline-block', background: '#fdf2f8', padding: '4px 14px', borderRadius: '999px', color: '#db2777', fontWeight: 800, fontSize: '12px', marginBottom: '6px' }}>
          Chủ đề: {currentLevel.theme}
        </div>

        <div style={{ fontSize: 'clamp(60px, 14vw, 92px)', margin: '2px 0' }} className="animate-bounce-slow">
          {currentLevel.emoji}
        </div>

        {/* Prompt */}
        <p style={{ color: '#334155', fontSize: 'clamp(14px, 3.2vw, 17px)', fontWeight: 800, margin: '8px 0 16px' }}>
          {mode === 'VN' 
            ? 'Bé nhìn hình đoán xem đây là gì và ghép chữ nhé!' 
            : 'Look at the picture and tap the letters to spell!'}
        </p>

        {/* Word Target Slots - Always 1 Clean Centered Row */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 'clamp(3px, 1.2vw, 8px)',
          marginBottom: '20px',
          flexWrap: 'nowrap',
          width: '100%',
          overflowX: 'auto',
          padding: '4px 2px',
          boxSizing: 'border-box'
        }}>
          {Array.from({ length: targetWord.length }).map((_, idx) => {
            const filled = currentGuess[idx];
            // Dynamic slot size so long words (like AIRPLANE, WATERMELON) fit 100% on one line on any screen
            const slotWidth = Math.max(28, Math.min(52, Math.floor(320 / Math.max(targetWord.length, 5))));
            const slotHeight = Math.round(slotWidth * 1.25);
            const slotFont = Math.round(slotWidth * 0.55);
            const slotRadius = Math.round(slotWidth * 0.25);

            return (
              <div
                key={idx}
                onClick={() => filled && handleRemoveLetter(idx)}
                style={{
                  width: `${slotWidth}px`,
                  height: `${slotHeight}px`,
                  fontSize: `${slotFont}px`,
                  borderRadius: `${slotRadius}px`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 900,
                  border: filled ? '2.5px solid #ec4899' : '2px dashed #cbd5e1',
                  background: filled ? '#fdf2f8' : '#f8fafc',
                  color: '#be185d',
                  cursor: filled ? 'pointer' : 'default',
                  boxShadow: filled ? '0 3px 0 #db2777' : 'none',
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

        {/* Scrambled Letter Options to Pick */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: 'clamp(6px, 1.8vw, 10px)',
          flexWrap: 'wrap',
          maxWidth: '440px',
          margin: '0 auto',
          minHeight: '48px'
        }}>
          {scrambledLetters.map((item) => (
            <button
              key={item.id}
              onClick={() => handlePickLetter(item)}
              className="btn-kid btn-yellow"
              style={{
                width: 'clamp(38px, 9.2vw, 50px)',
                height: 'clamp(42px, 10.5vw, 54px)',
                fontSize: 'clamp(18px, 4.5vw, 24px)',
                fontWeight: 900,
                borderRadius: '12px',
                padding: 0
              }}
            >
              {item.char}
            </button>
          ))}
        </div>

        {/* Success Modal: REVEAL WORD & PRONUNCIATION BUTTONS ONLY AFTER SOLVED */}
        {isSuccess && (
          <div className="animate-pop-in" style={{
            marginTop: '28px',
            padding: '24px',
            background: 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)',
            borderRadius: '24px',
            border: '3px solid #22c55e',
            textAlign: 'center'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '8px' }}>
              <CheckCircle2 size={32} color="#16a34a" />
              <span style={{ fontSize: '22px', fontWeight: 900, color: '#14532d' }}>
                Chính xác! Bé giỏi quá! 🎉
              </span>
            </div>

            <p style={{ fontSize: '15px', color: '#166534', fontWeight: 700, marginBottom: '16px' }}>
              Bé hãy bấm vào loa để nghe và đọc theo phát âm chuẩn nhé:
            </p>

            {/* Clickable Pronunciation Buttons */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginBottom: '20px', flexWrap: 'wrap' }}>
              <button 
                onClick={handleSpeakVN} 
                className="btn-kid btn-pink" 
                style={{ padding: '12px 24px', fontSize: '18px' }}
              >
                <Volume2 size={24} />
                <span>🇻🇳 {currentLevel.vn} (Nghe)</span>
              </button>
              <button 
                onClick={handleSpeakEN} 
                className="btn-kid btn-blue" 
                style={{ padding: '12px 24px', fontSize: '18px' }}
              >
                <Volume2 size={24} />
                <span>🇬🇧 {currentLevel.en} (Listen)</span>
              </button>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '14px', fontWeight: 800, color: '#15803d' }}>
                +1 Sao Vàng 🌟 &middot; +15 Xu 🪙
              </span>
              <button onClick={handleNextWord} className="btn-kid btn-green" style={{ padding: '10px 24px', fontSize: '16px' }}>
                <span>Từ tiếp theo</span>
                <Sparkles size={18} />
              </button>
            </div>
          </div>
        )}

        {/* Hint Section */}
        <div style={{ marginTop: '20px' }}>
          <button 
            onClick={() => setShowHint(!showHint)}
            style={{ background: 'none', border: 'none', color: '#64748b', fontSize: '13px', fontWeight: 700, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
          >
            <HelpCircle size={14} />
            {showHint ? 'Ẩn gợi ý' : 'Bé cần gợi ý không?'}
          </button>
          {showHint && (
            <div style={{ marginTop: '6px', fontSize: '14px', color: '#0369a1', background: '#f0f9ff', padding: '8px 16px', borderRadius: '12px', display: 'inline-block' }}>
              💡 {mode === 'VN' ? (currentLevel.hintVN || currentLevel.hint_vn || `Đây là từ "${currentLevel.vn}"`) : (currentLevel.hintEN || currentLevel.hint_en || `This is "${currentLevel.en}"`)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
