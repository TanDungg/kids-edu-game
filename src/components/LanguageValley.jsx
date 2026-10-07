import React, { useState, useEffect } from 'react';
import { Volume2, ArrowLeft, RefreshCw, Sparkles, HelpCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { dataManager, shuffleArray } from '../services/dataManager';
import { sounds } from '../utils/sound';
import { getRealPhotoForWord } from '../data/realImages';
import GameResultModal from './GameResultModal';
import GameErrorModal from './GameErrorModal';
import GameHintModal from './GameHintModal';

const DEFAULT_WORDS = [
  { id: 1, vn: 'Con Mèo', en: 'Cat', emoji: '🐱', theme: 'Động vật', targetVN: 'MÈO', targetEN: 'CAT', hintVN: 'Loài vật thích bắt chuột, kêu meo meo', hintEN: 'A small pet that purrs' },
  { id: 2, vn: 'Quả Táo', en: 'Apple', emoji: '🍎', theme: 'Trái cây', targetVN: 'TÁO', targetEN: 'APPLE', hintVN: 'Trái cây màu đỏ ngọt thơm, giòn tan', hintEN: 'A red sweet crunchy fruit' },
  { id: 3, vn: 'Mặt Trời', en: 'Sun', emoji: '☀️', theme: 'Tự nhiên', targetVN: 'TRỜI', targetEN: 'SUN', hintVN: 'Tỏa ánh sáng ấm áp vào ban ngày', hintEN: 'Shines bright in daytime sky' },
  { id: 4, vn: 'Chiếc Xe', en: 'Car', emoji: '🚗', theme: 'Phương tiện', targetVN: 'XE', targetEN: 'CAR', hintVN: 'Phương tiện có 4 bánh chạy trên đường', hintEN: 'Vehicle with four wheels' },
  { id: 5, vn: 'Con Chó', en: 'Dog', emoji: '🐶', theme: 'Động vật', targetVN: 'CHÓ', targetEN: 'DOG', hintVN: 'Bạn bốn chân trung thành giữ nhà', hintEN: 'A faithful four-legged friend' }
];

export default function LanguageValley({ onBack, onCompleteLevel }) {
  const [wordsList, setWordsList] = useState(() => {
    const list = dataManager.getShuffledWords();
    return (list && list.length > 0) ? list : DEFAULT_WORDS;
  });
  const [levelIndex, setLevelIndex] = useState(0);
  const [mode, setMode] = useState('VN'); // 'VN' or 'EN'
  const [currentGuess, setCurrentGuess] = useState([]);
  const [scrambledLetters, setScrambledLetters] = useState([]);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [isHintModalOpen, setIsHintModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

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

  useEffect(() => {
    if (targetWord) {
      resetPuzzle();
    }
  }, [levelIndex, mode, wordsList, targetWord]);

  const resetPuzzle = () => {
    if (!targetWord) return;
    setIsSuccessModalOpen(false);
    setIsErrorModalOpen(false);
    setIsHintModalOpen(false);
    setErrorMessage('');
    setCurrentGuess([]);

    const letters = targetWord.split('');
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
    if (isSuccessModalOpen || isErrorModalOpen || item.isUsed) return;
    sounds.playClick();

    if (currentGuess.length < totalLetters) {
      const nextGuess = [...currentGuess, item];
      setCurrentGuess(nextGuess);
      
      setScrambledLetters(prev => prev.map(l => l.id === item.id ? { ...l, isUsed: true } : l));

      if (nextGuess.length === totalLetters) {
        const guessedString = nextGuess.map(i => i.char).join('');
        if (guessedString === targetWord) {
          handleWin();
        } else {
          sounds.playError();
          setErrorMessage(`Từ "${guessedString}" chưa đúng rồi bé ơi! Bé thử lại để tìm từ chính xác nhé!`);
          setIsErrorModalOpen(true);
        }
      }
    }
  };

  const handleRemoveLetter = (indexToRemove) => {
    if (isSuccessModalOpen || isErrorModalOpen) return;
    sounds.playClick();
    const removedItem = currentGuess[indexToRemove];
    setCurrentGuess(currentGuess.filter((_, idx) => idx !== indexToRemove));
    
    if (removedItem) {
      setScrambledLetters(prev => prev.map(l => l.id === removedItem.id ? { ...l, isUsed: false } : l));
    }
  };

  const handleWin = () => {
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
    setIsSuccessModalOpen(false);
    setIsErrorModalOpen(false);
    setLevelIndex((prev) => (prev + 1) % (wordsList.length || 1));
  };

  const handleReshuffleAndReset = () => {
    sounds.playClick();
    setWordsList(dataManager.getShuffledWords());
    setLevelIndex(0);
    resetPuzzle();
  };

  const handleRetryAfterError = () => {
    setIsErrorModalOpen(false);
    // Reset the slots back to scramble list
    setCurrentGuess([]);
    setScrambledLetters(prev => prev.map(l => ({ ...l, isUsed: false })));
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

  let currentSlotIndexTracker = 0;

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
          className="btn-kid btn-blue" 
          style={{ padding: '5px 10px', fontSize: '12px', flexShrink: 0 }}
        >
          <ArrowLeft size={14} />
          <span>Bản đồ</span>
        </button>

        {/* Language Switcher */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          background: '#ffffff',
          padding: '2px',
          borderRadius: '999px',
          border: '1.5px solid #e2e8f0',
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
              padding: '3px 8px',
              borderRadius: '999px',
              fontSize: '11.5px',
              fontWeight: 800,
              fontFamily: 'inherit',
              transition: 'all 0.2s ease',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '3px',
              background: mode === 'VN' ? 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)' : 'transparent',
              color: mode === 'VN' ? '#ffffff' : '#64748b',
              boxShadow: mode === 'VN' ? '0 2px 6px rgba(219, 39, 119, 0.35)' : 'none',
              outline: 'none'
            }}
          >
            <span>🇻🇳</span> <span>Việt</span>
          </button>
          <button
            type="button"
            onClick={() => { sounds.playClick(); setMode('EN'); }}
            style={{
              border: 'none',
              cursor: 'pointer',
              padding: '3px 8px',
              borderRadius: '999px',
              fontSize: '11.5px',
              fontWeight: 800,
              fontFamily: 'inherit',
              transition: 'all 0.2s ease',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '3px',
              background: mode === 'EN' ? 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)' : 'transparent',
              color: mode === 'EN' ? '#ffffff' : '#64748b',
              boxShadow: mode === 'EN' ? '0 2px 6px rgba(37, 99, 235, 0.35)' : 'none',
              outline: 'none'
            }}
          >
            <span>🇬🇧</span> <span>English</span>
          </button>
        </div>

        {/* Progress Pill & Reshuffle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0 }}>
          <div style={{
            background: '#fdf2f8',
            color: '#db2777',
            padding: '3px 8px',
            borderRadius: '999px',
            fontWeight: 800,
            fontSize: '11px',
            border: '1.5px solid #fbcfe8',
            whiteSpace: 'nowrap'
          }}>
            {levelIndex + 1}/{wordsList.length}
          </div>
          <button onClick={handleReshuffleAndReset} className="btn-kid btn-yellow" style={{ padding: '5px 7px' }} title="Xáo trộn lại toàn bộ câu hỏi">
            <RefreshCw size={12} />
          </button>
        </div>
      </div>

      {/* Main Flashcard - Cohesive & Centered Layout */}
      <div className="game-card-compact">
        {/* Top: Theme & Mascot */}
        <div style={{ textAlign: 'center', flexShrink: 0 }}>
          <div style={{ display: 'inline-block', background: '#fdf2f8', padding: '2px 10px', borderRadius: '999px', color: '#db2777', fontWeight: 800, fontSize: '11px', marginBottom: '3px' }}>
            Chủ đề: {currentLevel.theme}
          </div>

          {/* Real Photo Illustration with 3D Frame */}
          <div style={{ display: 'flex', justifyContent: 'center', margin: '4px 0' }}>
            {getRealPhotoForWord(currentLevel) ? (
              <div 
                className="animate-pop-in"
                style={{
                  position: 'relative',
                  width: 'clamp(94px, 16vh, 126px)',
                  height: 'clamp(94px, 16vh, 126px)',
                  borderRadius: '24px',
                  padding: '3px',
                  background: 'linear-gradient(135deg, #ffffff 0%, #fce7f3 100%)',
                  boxShadow: '0 12px 24px -4px rgba(219, 39, 119, 0.22), 0 4px 8px rgba(0,0,0,0.06)',
                  border: '2.5px solid #fbcfe8'
                }}
              >
                <img 
                  src={getRealPhotoForWord(currentLevel)} 
                  alt={currentLevel.vn}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    borderRadius: '20px',
                    display: 'block'
                  }}
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    if (e.currentTarget.nextSibling) e.currentTarget.nextSibling.style.display = 'flex';
                  }}
                />
                <div style={{
                  display: 'none',
                  width: '100%',
                  height: '100%',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '56px'
                }}>
                  {currentLevel.emoji}
                </div>
                {/* Cute corner badge */}
                <div style={{
                  position: 'absolute',
                  bottom: '-5px',
                  right: '-5px',
                  background: '#ffffff',
                  borderRadius: '50%',
                  padding: '2px',
                  fontSize: '18px',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
                  border: '1.5px solid #fbcfe8'
                }}>
                  {currentLevel.emoji}
                </div>
              </div>
            ) : (
              <div 
                style={{ fontSize: 'clamp(52px, 11vh, 74px)', margin: '2px 0', lineHeight: 1 }} 
                className="animate-bounce-slow"
              >
                {currentLevel.emoji}
              </div>
            )}
          </div>

          {/* Prompt */}
          <h3 style={{ color: '#1e293b', fontSize: 'clamp(13.5px, 2.2vh, 15.5px)', fontWeight: 800, margin: '2px 0 6px', lineHeight: 1.3 }}>
            {mode === 'VN' 
              ? 'Bé nhìn hình đoán xem đây là gì và ghép chữ nhé!' 
              : 'Look at the picture and tap the letters to spell!'}
          </h3>
        </div>

        {/* Word Target Slots */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 'clamp(6px, 2vw, 12px)',
          margin: 'auto 0',
          flexWrap: 'wrap',
          width: '100%',
          boxSizing: 'border-box',
          flexShrink: 0
        }}>
          {targetWords.map((word, wIdx) => (
            <div key={wIdx} style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 'clamp(3px, 1.2vw, 6px)',
              background: targetWords.length > 1 ? '#f8fafc' : 'transparent',
              padding: targetWords.length > 1 ? '4px 6px' : 0,
              borderRadius: '12px',
              border: targetWords.length > 1 ? '1.5px dashed #cbd5e1' : 'none'
            }}>
              {word.split('').map((_, cIdx) => {
                const slotIndex = currentSlotIndexTracker++;
                const filled = currentGuess[slotIndex];
                const slotWidth = Math.max(34, Math.min(48, Math.floor(260 / Math.max(word.length, 4))));
                const slotHeight = Math.round(slotWidth * 1.22);
                const slotFont = Math.round(slotWidth * 0.56);

                return (
                  <div
                    key={cIdx}
                    onClick={() => filled && handleRemoveLetter(slotIndex)}
                    style={{
                      width: `${slotWidth}px`,
                      height: `${slotHeight}px`,
                      fontSize: `${slotFont}px`,
                      borderRadius: '10px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 900,
                      border: filled ? '2.5px solid #ec4899' : '2.5px dashed #cbd5e1',
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
          ))}
        </div>

        {/* Scrambled Letter Options to Pick */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: 'clamp(6px, 1.8vw, 10px)',
          flexWrap: 'wrap',
          maxWidth: '400px',
          margin: '6px auto',
          minHeight: '48px',
          alignItems: 'center'
        }}>
          {scrambledLetters.map((item) => (
            <div 
              key={item.id}
              style={{
                width: 'clamp(40px, 9.5vw, 48px)',
                height: 'clamp(44px, 10.5vw, 54px)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {item.isUsed ? (
                <div style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: '12px',
                  border: '2px dashed #e2e8f0',
                  background: 'rgba(241, 245, 249, 0.7)'
                }} />
              ) : (
                <button
                  onClick={() => handlePickLetter(item)}
                  className="btn-kid btn-yellow animate-pop-in"
                  style={{
                    width: '100%',
                    height: '100%',
                    fontSize: 'clamp(18px, 4.5vw, 22px)',
                    fontWeight: 900,
                    borderRadius: '12px',
                    padding: 0
                  }}
                >
                  {item.char}
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Hint Trigger Button */}
        <div style={{ marginTop: '6px', textAlign: 'center' }}>
          <button 
            onClick={() => {
              sounds.playClick();
              setIsHintModalOpen(true);
            }}
            style={{ 
              background: '#f0f9ff', 
              border: '1.5px solid #bae6fd', 
              color: '#0284c7', 
              fontSize: '12px', 
              fontWeight: 800, 
              cursor: 'pointer', 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '4px',
              padding: '5px 12px',
              borderRadius: '999px'
            }}
          >
            <HelpCircle size={14} />
            <span>Bé cần gợi ý không? 💡</span>
          </button>
        </div>
      </div>

      {/* Result Modal: Success Celebratory Popup */}
      <GameResultModal
        isOpen={isSuccessModalOpen}
        type="language"
        title="Chính xác! Bé giỏi quá! 🎉"
        subtitle="Bé hãy bấm vào loa để nghe và đọc theo phát âm chuẩn nhé:"
        starsEarned={1}
        coinsEarned={15}
        wordData={currentLevel}
        onSpeakVN={handleSpeakVN}
        onSpeakEN={handleSpeakEN}
        onNext={handleNextWord}
        onReplay={resetPuzzle}
        onGoMap={onBack}
      />

      {/* Error / Wrong Attempt Modal */}
      <GameErrorModal
        isOpen={isErrorModalOpen}
        onClose={() => setIsErrorModalOpen(false)}
        onRetry={handleRetryAfterError}
        onOpenHint={() => setIsHintModalOpen(true)}
        message={errorMessage || 'Chưa chính xác rồi bé ơi! Bé bấm thử lại để xếp lại các chữ cái nhé!'}
        hintAvailable={true}
      />

      {/* Hint Modal */}
      <GameHintModal
        isOpen={isHintModalOpen}
        onClose={() => setIsHintModalOpen(false)}
        hintText={mode === 'VN' ? (currentLevel.hintVN || currentLevel.hint_vn || `Đây là từ "${currentLevel.vn}"`) : (currentLevel.hintEN || currentLevel.hint_en || `This is "${currentLevel.en}"`)}
      />
    </div>
  );
}
