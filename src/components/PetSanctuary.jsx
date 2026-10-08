import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowLeft, 
  Heart, 
  Sparkles, 
  ShoppingBag, 
  Utensils, 
  Smile, 
  Volume2, 
  Coins, 
  Award, 
  Check, 
  Crown,
  Hand,
  Gamepad2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { dataManager } from '../services/dataManager';
import { sounds } from '../utils/sound';
import { get3DPetAsset } from '../data/realImages';
import Pet3DCanvas from './Pet3DCanvas';

const DEFAULT_PETS = [
  { id: 'fox', name: 'Cáo Cam Foxy', emoji: '🦊', sound: 'Khịt khịt~', hunger: 85, happiness: 90 },
  { id: 'horse', name: 'Ngựa Thần Kỳ', emoji: '🐴', sound: 'Hí hí~', hunger: 80, happiness: 85 },
  { id: 'parrot', name: 'Vẹt Sặc Sỡ', emoji: '🦜', sound: 'Vẹt vẹt~', hunger: 85, happiness: 90 },
  { id: 'duck', name: 'Bé Vịt Vàng', emoji: '🦆', sound: 'Cạp cạp!', hunger: 75, happiness: 85 },
  { id: 'flamingo', name: 'Hồng Hạc Xinh', emoji: '🦩', sound: 'Quác quác!', hunger: 70, happiness: 80 },
  { id: 'dog', name: 'Chú Cún Con', emoji: '🐶', sound: 'Gâu gâu!', hunger: 75, happiness: 85 },
  { id: 'cat', name: 'Bé Miu Miu', emoji: '🐱', sound: 'Meo meo~', hunger: 80, happiness: 90 }
];

const DEFAULT_SHOP = [
  { id: 'milk', name: 'Bình Sữa Bò', type: 'food', emoji: '🍼', price: 8, hungerBoost: 20 },
  { id: 'cookie', name: 'Bánh Quy Ngọt', type: 'food', emoji: '🍪', price: 10, hungerBoost: 25 },
  { id: 'donut', name: 'Bánh Donut Dâu', type: 'food', emoji: '🍩', price: 12, hungerBoost: 30 },
  { id: 'icecream', name: 'Kem Cầu Vồng', type: 'food', emoji: '🍦', price: 15, hungerBoost: 35 },
  { id: 'bone', name: 'Xương Ngon Giòn', type: 'food', emoji: '🍖', price: 16, hungerBoost: 35 },
  { id: 'fish_can', name: 'Hộp Cá Ngừ', type: 'food', emoji: '🐟', price: 18, hungerBoost: 40 },
  { id: 'apple_pie', name: 'Bánh Táo Nướng', type: 'food', emoji: '🥧', price: 20, hungerBoost: 45 },
  { id: 'sunglasses', name: 'Kính Mát Cool', type: 'hat', emoji: '🕶️', price: 25, hungerBoost: 0 },
  { id: 'party_hat', name: 'Mũ Sinh Nhật', type: 'hat', emoji: '🎉', price: 30, hungerBoost: 0 },
  { id: 'bow', name: 'Nơ Hồng Xinh', type: 'hat', emoji: '🎀', price: 20, hungerBoost: 0 },
  { id: 'crown', name: 'Vương Miện Vàng', type: 'hat', emoji: '👑', price: 50, hungerBoost: 0 },
  { id: 'grad_cap', name: 'Mũ Tiến Sĩ', type: 'hat', emoji: '🎓', price: 60, hungerBoost: 0 }
];

export default function PetSanctuary({ 
  onBack, 
  coins = 30, 
  pet, 
  onUpdatePet, 
  onSpendCoins 
}) {
  const [shopItems, setShopItems] = useState(() => {
    const items = dataManager.getShopItems();
    return (items && items.length > 0) ? items : DEFAULT_SHOP;
  });
  const [pets, setPets] = useState(() => {
    const list = dataManager.getPets();
    return (list && list.length > 0) ? list : DEFAULT_PETS;
  });
  const [selectedPet, setSelectedPet] = useState(() => {
    if (pet) return pet;
    const initialPets = dataManager.getPets();
    return (initialPets && initialPets.length > 0) ? initialPets[0] : DEFAULT_PETS[0];
  });

  const petAsset = get3DPetAsset(selectedPet);

  const [activeTab, setActiveTab] = useState('food'); // 'food' | 'hat'
  const [activeHat, setActiveHat] = useState(null);
  const [actionMessage, setActionMessage] = useState('Bé hãy chạm vào tớ hoặc cho tớ ăn nhé! 💕');
  const [isJumping, setIsJumping] = useState(false);
  const [floatingHearts, setFloatingHearts] = useState([]);
  const heartCounter = useRef(0);

  // 3D Canvas real-time action triggers
  const [pet3DAction, setPet3DAction] = useState('idle');
  const [pet3DTrigger, setPet3DTrigger] = useState(0);

  const trigger3DAction = (act) => {
    setPet3DAction(act);
    setPet3DTrigger(prev => prev + 1);
  };

  useEffect(() => {
    return dataManager.subscribe(() => {
      const dbPets = dataManager.getPets();
      const dbShop = dataManager.getShopItems();
      if (dbPets && dbPets.length > 0) setPets(dbPets);
      if (dbShop && dbShop.length > 0) setShopItems(dbShop);
    });
  }, []);

  // Update selectedPet if parent pet changes
  useEffect(() => {
    if (pet && pet.id && pet.id !== selectedPet.id) {
      setSelectedPet(pet);
    }
  }, [pet]);

  // Spawn visual floating hearts
  const triggerFloatingHearts = (count = 4) => {
    const newHearts = [];
    for (let i = 0; i < count; i++) {
      heartCounter.current += 1;
      newHearts.push({
        id: heartCounter.current,
        left: 30 + Math.random() * 40, // 30% to 70%
        emoji: ['💖', '✨', '⭐', '🌸', '🥰'][Math.floor(Math.random() * 5)],
        delay: i * 0.12
      });
    }
    setFloatingHearts(prev => [...prev, ...newHearts]);
    setTimeout(() => {
      setFloatingHearts(prev => prev.filter(h => !newHearts.some(nh => nh.id === h.id)));
    }, 1800);
  };

  // Pet interactive tap / click
  const handlePetInteraction = () => {
    sounds.playClick();
    sounds.playStar();
    setIsJumping(true);
    trigger3DAction('jump');
    triggerFloatingHearts(5);

    const happyBoost = Math.min(100, (selectedPet.happiness || 80) + 3);
    const updated = { ...selectedPet, happiness: happyBoost };
    setSelectedPet(updated);
    if (onUpdatePet) onUpdatePet(updated);

    const petPhrases = [
      `${selectedPet.sound} Tớ thích bé lắm! 💕`,
      `Hi hi, nhột quá đi thôi! 😄`,
      `Bé thật là ngoan và đáng yêu! ✨`,
      `${selectedPet.sound} Chúng mình cùng chơi nhé! 🎈`
    ];
    const phrase = petPhrases[Math.floor(Math.random() * petPhrases.length)];
    setActionMessage(phrase);
    sounds.speak(phrase, 'vi-VN');

    setTimeout(() => setIsJumping(false), 800);
  };

  // Xoa đầu bé (Petting)
  const handlePetting = () => {
    sounds.playClick();
    sounds.playSuccess();
    trigger3DAction('pet');
    triggerFloatingHearts(6);
    const happyBoost = Math.min(100, (selectedPet.happiness || 80) + 5);
    const updated = { ...selectedPet, happiness: happyBoost };
    setSelectedPet(updated);
    if (onUpdatePet) onUpdatePet(updated);

    const msg = `Bé xoa đầu làm ${selectedPet.name} ấm áp và vui lắm! 🥰`;
    setActionMessage(msg);
    sounds.speak(`${selectedPet.sound} Yêu bé!`, 'vi-VN');
  };

  // Chơi đùa với thú cưng
  const handlePlayBall = () => {
    sounds.playClick();
    sounds.playCheer();
    setIsJumping(true);
    trigger3DAction('play');
    triggerFloatingHearts(6);
    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.5 }
    });

    const happyBoost = Math.min(100, (selectedPet.happiness || 80) + 8);
    const updated = { ...selectedPet, happiness: happyBoost };
    setSelectedPet(updated);
    if (onUpdatePet) onUpdatePet(updated);

    const msg = `Bé và ${selectedPet.name} tung bóng chơi đùa thật vui nhộn! 🎾`;
    setActionMessage(msg);
    sounds.speak("Vui quá đi thôi!", 'vi-VN');

    setTimeout(() => setIsJumping(false), 900);
  };

  // Cho thú cưng ăn
  const handleFeed = (item) => {
    if (coins < item.price) {
      sounds.playError();
      setActionMessage('Bé cần học thêm ở các vùng đất để tích lũy đủ xu nhé! 🪙');
      return;
    }

    sounds.playCoin();
    sounds.playSuccess();
    if (onSpendCoins) onSpendCoins(item.price);

    const nextHunger = Math.min(100, (selectedPet.hunger || 70) + item.hungerBoost);
    const nextHappiness = Math.min(100, (selectedPet.happiness || 80) + 5);
    const updated = { ...selectedPet, hunger: nextHunger, happiness: nextHappiness };
    setSelectedPet(updated);
    if (onUpdatePet) onUpdatePet(updated);

    setIsJumping(true);
    trigger3DAction('eat');
    triggerFloatingHearts(6);
    confetti({
      particleCount: 55,
      spread: 65,
      origin: { y: 0.45 }
    });

    const msg = `Măm măm~ ${item.name} ngon tuyệt! ${selectedPet.name} đã no nê (+${item.hungerBoost}%) 😋`;
    setActionMessage(msg);
    sounds.speak(`${selectedPet.sound} Ngon quá bé ơi!`, 'vi-VN');

    setTimeout(() => setIsJumping(false), 800);
  };

  // Đổi mũ / trang phục
  const handleEquipHat = (item) => {
    if (activeHat === item.emoji) {
      sounds.playClick();
      setActiveHat(null);
      setActionMessage(`Đã tháo ${item.name} khỏi ${selectedPet.name}!`);
      return;
    }

    if (coins < item.price) {
      sounds.playError();
      setActionMessage('Bé cần thêm xu để mở khóa phụ kiện này nhé! 🪙');
      return;
    }

    sounds.playClick();
    sounds.playStar();
    if (onSpendCoins) onSpendCoins(item.price);
    setActiveHat(item.emoji);
    setIsJumping(true);
    trigger3DAction('jump');
    triggerFloatingHearts(5);

    const msg = `Woa! ${selectedPet.name} đội ${item.name} trông siêu ngầu và đáng yêu! ✨`;
    setActionMessage(msg);
    sounds.speak("Đẹp quá!", 'vi-VN');

    setTimeout(() => setIsJumping(false), 700);
  };

  return (
    <div className="page-container" style={{ maxWidth: '920px', paddingBottom: '30px' }}>
      {/* Inline Styles for 3D Animations */}
      <style>{`
        @keyframes floatIsland {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-12px) rotate(1.5deg); }
        }
        @keyframes shadowBreath {
          0%, 100% { transform: scale(1); opacity: 0.65; }
          50% { transform: scale(0.72); opacity: 0.25; }
        }
        @keyframes auroraGlow {
          0% { transform: rotate(0deg) scale(1); }
          50% { transform: rotate(180deg) scale(1.1); }
          100% { transform: rotate(360deg) scale(1); }
        }
        @keyframes petHappyJump {
          0% { transform: translateY(0) scale(1); }
          30% { transform: translateY(-38px) scale(1.18, 0.88) rotate(-6deg); }
          60% { transform: translateY(-18px) scale(0.92, 1.12) rotate(6deg); }
          100% { transform: translateY(0) scale(1); }
        }
        @keyframes floatUpFade {
          0% { opacity: 0; transform: translateY(10px) scale(0.6); }
          20% { opacity: 1; transform: translateY(-10px) scale(1.2); }
          100% { opacity: 0; transform: translateY(-65px) scale(1.5); }
        }
        @keyframes shimmerGleam {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(250%); }
        }
        .island-stage {
          animation: floatIsland 4.2s ease-in-out infinite;
        }
        .island-shadow {
          animation: shadowBreath 4.2s ease-in-out infinite;
        }
        .pet-jumping {
          animation: petHappyJump 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) !important;
        }
        .shimmer-bar::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent);
          animation: shimmerGleam 2.8s infinite;
        }
      `}</style>

      {/* Top Header Navigation Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '14px',
        gap: '8px'
      }}>
        <button 
          onClick={onBack} 
          className="btn-kid btn-yellow" 
          style={{
            padding: '8px 14px',
            fontSize: '13.5px',
            flexShrink: 0,
            boxShadow: '0 4px 12px rgba(234, 179, 8, 0.35)'
          }}
        >
          <ArrowLeft size={16} />
          <span>Bản đồ</span>
        </button>

        {/* 3D Gold Coin Badge */}
        <div style={{
          background: 'linear-gradient(135deg, #fef08a 0%, #facc15 50%, #eab308 100%)',
          color: '#713f12',
          padding: '6px 16px',
          borderRadius: '999px',
          fontWeight: 900,
          fontSize: '14px',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          boxShadow: '0 4px 14px rgba(234, 179, 8, 0.4), inset 0 2px 2px rgba(255, 255, 255, 0.8)',
          border: '1.5px solid #fef08a'
        }}>
          <span style={{ fontSize: '16px' }}>🪙</span>
          <span>Xu của bé:</span>
          <span style={{ fontSize: '16px', color: '#854d0e', marginLeft: '2px' }}>{coins}</span>
        </div>
      </div>

      {/* Main Sanctuary Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '16px'
      }}>

        {/* ================= LEFT: 3D MAGICAL PET ISLAND STAGE ================= */}
        <div 
          className="kid-card"
          style={{
            background: 'linear-gradient(180deg, #ffffff 0%, #f0fdf4 60%, #e0f2fe 100%)',
            borderRadius: '28px',
            padding: '20px 16px',
            boxShadow: '0 16px 36px -8px rgba(16, 185, 129, 0.18), 0 4px 12px rgba(0,0,0,0.04)',
            border: '2px solid rgba(255, 255, 255, 0.9)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          {/* Ambient Glow in background */}
          <div style={{
            position: 'absolute',
            top: '20%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '260px',
            height: '260px',
            background: 'radial-gradient(circle, rgba(254, 240, 138, 0.5) 0%, rgba(187, 247, 208, 0.35) 50%, transparent 75%)',
            borderRadius: '50%',
            filter: 'blur(30px)',
            pointerEvents: 'none',
            zIndex: 0
          }} />

          {/* 1. Pet Carousel Selector (3D Pills) */}
          <div style={{
            width: '100%',
            display: 'flex',
            gap: '8px',
            overflowX: 'auto',
            padding: '4px 4px 12px 4px',
            WebkitOverflowScrolling: 'touch',
            scrollbarWidth: 'none',
            zIndex: 2
          }}>
            {pets.map((p) => {
              const isSelected = selectedPet.id === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => {
                    sounds.playClick();
                    sounds.playStar();
                    setSelectedPet(p);
                    if (onUpdatePet) onUpdatePet(p);
                    setActionMessage(`${p.name} rất vui được làm bạn đồng hành cùng bé! ✨`);
                  }}
                  style={{
                    flexShrink: 0,
                    padding: isSelected ? '7px 14px' : '6px 12px',
                    borderRadius: '20px',
                    border: isSelected ? '2.5px solid #facc15' : '2px solid #e2e8f0',
                    background: isSelected 
                      ? 'linear-gradient(135deg, #fef08a 0%, #fde047 100%)' 
                      : '#ffffff',
                    color: isSelected ? '#713f12' : '#64748b',
                    fontWeight: 900,
                    fontSize: '13px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    cursor: 'pointer',
                    transform: isSelected ? 'scale(1.04)' : 'scale(1)',
                    boxShadow: isSelected 
                      ? '0 8px 18px rgba(250, 204, 21, 0.45), inset 0 2px 2px #ffffff' 
                      : '0 2px 6px rgba(0,0,0,0.04)',
                    transition: 'all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)'
                  }}
                >
                  {get3DPetAsset(p)?.image3d ? (
                    <img 
                      src={get3DPetAsset(p).image3d} 
                      alt={p.name}
                      style={{
                        width: '26px',
                        height: '26px',
                        borderRadius: '8px',
                        objectFit: 'cover',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.15)'
                      }} 
                    />
                  ) : (
                    <span style={{ fontSize: '20px' }}>{p.emoji}</span>
                  )}
                  <span>{p.name}</span>
                  {isSelected && <Sparkles size={13} color="#ca8a04" />}
                </button>
              );
            })}
          </div>

          {/* 2. 3D Floating Stage Island */}
          <div style={{
            position: 'relative',
            width: '100%',
            minHeight: '230px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '10px 0',
            zIndex: 1
          }}>
            {/* Interactive Comic Speech Bubble */}
            <div 
              className="animate-pop-in"
              style={{
                background: '#ffffff',
                border: '2px solid #fed7aa',
                borderRadius: '16px',
                padding: '8px 16px',
                fontSize: '13px',
                fontWeight: 800,
                color: '#9a3412',
                boxShadow: '0 6px 16px rgba(251, 146, 60, 0.15)',
                marginBottom: '10px',
                maxWidth: '90%',
                textAlign: 'center',
                position: 'relative'
              }}
            >
              <span>{actionMessage}</span>
              {/* Little speech bubble tail pointing down */}
              <div style={{
                position: 'absolute',
                bottom: '-7px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '12px',
                height: '12px',
                background: '#ffffff',
                borderRight: '2px solid #fed7aa',
                borderBottom: '2px solid #fed7aa',
                transformOrigin: 'center',
                rotate: '45deg'
              }} />
            </div>

            {/* Floating Particles/Hearts on click */}
            <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 10 }}>
              {floatingHearts.map(h => (
                <div
                  key={h.id}
                  style={{
                    position: 'absolute',
                    left: `${h.left}%`,
                    top: '40%',
                    fontSize: '28px',
                    animation: `floatUpFade 1.4s ease-out forwards ${h.delay}s`
                  }}
                >
                  {h.emoji}
                </div>
              ))}
            </div>

            {/* Real-time Interactive 3D Animal WebGL Stage */}
            <div 
              style={{
                position: 'relative',
                width: '100%',
                height: '320px',
                cursor: 'grab',
                userSelect: 'none',
                touchAction: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '24px',
                overflow: 'hidden'
              }}
              title="Chạm vào tớ hoặc vuốt xoay 360° để chơi cùng nhé!"
            >
              <Pet3DCanvas 
                petType={selectedPet.id}
                action={pet3DAction}
                actionTrigger={pet3DTrigger}
                activeHat={activeHat}
                onPetClick={handlePetInteraction}
              />
            </div>

            {/* Interactive hint badge */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 14px',
              borderRadius: '999px',
              background: 'rgba(255, 255, 255, 0.9)',
              border: '1.5px solid #bbf7d0',
              fontSize: '11.5px',
              fontWeight: 800,
              color: '#15803d',
              boxShadow: '0 2px 8px rgba(22, 163, 74, 0.12)',
              marginTop: '4px',
              zIndex: 2
            }}>
              <span>🖐️ Vuốt ngón tay / chuột để xoay 360° • Chạm để chơi đùa</span>
            </div>
          </div>

          {/* Pet Name & Badge */}
          <div style={{ textAlign: 'center', marginTop: '2px', zIndex: 2 }}>
            <h3 style={{
              fontFamily: 'var(--font-display)',
              fontSize: '22px',
              fontWeight: 900,
              color: '#1e293b',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}>
              <span>{selectedPet.name}</span>
              <span style={{ fontSize: '16px' }}>⭐</span>
            </h3>
            <p style={{ color: '#64748b', fontSize: '13px', fontWeight: 700, marginTop: '2px' }}>
              Tiếng kêu: <span style={{ color: '#0284c7' }}>"{selectedPet.sound}"</span>
            </p>
          </div>

          {/* Quick Pet Interactive Buttons */}
          <div style={{
            display: 'flex',
            gap: '8px',
            width: '100%',
            justifyContent: 'center',
            margin: '14px 0 10px 0',
            zIndex: 2
          }}>
            <button
              onClick={handlePetting}
              className="btn-kid btn-pink"
              style={{
                padding: '7px 12px',
                fontSize: '12.5px',
                flex: 1,
                boxShadow: '0 4px 10px rgba(244, 114, 182, 0.3)'
              }}
            >
              <Hand size={14} />
              <span>Xoa đầu</span>
            </button>
            <button
              onClick={handlePlayBall}
              className="btn-kid btn-purple"
              style={{
                padding: '7px 12px',
                fontSize: '12.5px',
                flex: 1,
                boxShadow: '0 4px 10px rgba(192, 132, 252, 0.3)'
              }}
            >
              <Gamepad2 size={14} />
              <span>Chơi đùa</span>
            </button>
            <button
              onClick={() => {
                sounds.playClick();
                sounds.speak(selectedPet.sound, 'vi-VN');
              }}
              className="btn-kid btn-blue"
              style={{
                padding: '7px 10px',
                fontSize: '12.5px',
                boxShadow: '0 4px 10px rgba(56, 189, 248, 0.3)'
              }}
              title="Nghe tiếng kêu"
            >
              <Volume2 size={15} />
            </button>
          </div>

          {/* 3. 3D Vital Gauges (Độ no & Độ hạnh phúc) */}
          <div style={{
            width: '100%',
            background: 'rgba(255, 255, 255, 0.85)',
            backdropFilter: 'blur(8px)',
            borderRadius: '20px',
            padding: '14px',
            border: '1.5px solid #e2e8f0',
            boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
            zIndex: 2
          }}>
            {/* Hunger Bar */}
            <div style={{ marginBottom: '12px' }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontSize: '12.5px',
                fontWeight: 900,
                color: '#065f46',
                marginBottom: '5px'
              }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <span>🍖</span> Độ No Bụng:
                </span>
                <span style={{
                  background: '#dcfce7',
                  color: '#15803d',
                  padding: '2px 8px',
                  borderRadius: '999px',
                  fontSize: '11.5px',
                  fontWeight: 900
                }}>
                  {selectedPet.hunger || 80}%
                </span>
              </div>
              <div style={{
                width: '100%',
                height: '14px',
                background: '#e2e8f0',
                borderRadius: '999px',
                overflow: 'hidden',
                position: 'relative',
                boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)'
              }}>
                <div 
                  className="shimmer-bar"
                  style={{
                    width: `${selectedPet.hunger || 80}%`,
                    height: '100%',
                    background: 'linear-gradient(90deg, #34d399 0%, #10b981 50%, #059669 100%)',
                    borderRadius: '999px',
                    position: 'relative',
                    transition: 'width 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)'
                  }} 
                />
              </div>
            </div>

            {/* Happiness Bar */}
            <div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontSize: '12.5px',
                fontWeight: 900,
                color: '#9d174d',
                marginBottom: '5px'
              }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <span>💖</span> Độ Hạnh Phúc:
                </span>
                <span style={{
                  background: '#fce7f3',
                  color: '#be185d',
                  padding: '2px 8px',
                  borderRadius: '999px',
                  fontSize: '11.5px',
                  fontWeight: 900
                }}>
                  {selectedPet.happiness || 90}%
                </span>
              </div>
              <div style={{
                width: '100%',
                height: '14px',
                background: '#e2e8f0',
                borderRadius: '999px',
                overflow: 'hidden',
                position: 'relative',
                boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)'
              }}>
                <div 
                  className="shimmer-bar"
                  style={{
                    width: `${selectedPet.happiness || 90}%`,
                    height: '100%',
                    background: 'linear-gradient(90deg, #f472b6 0%, #ec4899 50%, #db2777 100%)',
                    borderRadius: '999px',
                    position: 'relative',
                    transition: 'width 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)'
                  }} 
                />
              </div>
            </div>
          </div>
        </div>


        {/* ================= RIGHT: 3D PET BOUTIQUE & GOURMET SHOP ================= */}
        <div 
          className="kid-card"
          style={{
            background: '#ffffff',
            borderRadius: '28px',
            padding: '20px 16px',
            boxShadow: '0 16px 36px -8px rgba(202, 138, 4, 0.15), 0 4px 12px rgba(0,0,0,0.04)',
            border: '2px solid rgba(255, 255, 255, 0.9)',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          {/* Shop Title */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '14px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #fef08a, #facc15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px',
                boxShadow: '0 4px 10px rgba(234, 179, 8, 0.3)'
              }}>
                🛍️
              </div>
              <div>
                <h3 style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '18px',
                  fontWeight: 900,
                  color: '#1e293b',
                  margin: 0
                }}>
                  Cửa Hàng Quà Tặng
                </h3>
                <p style={{ fontSize: '11.5px', color: '#94a3b8', fontWeight: 700, margin: 0 }}>
                  Dùng xu thưởng để mua quà cho bé cưng
                </p>
              </div>
            </div>
          </div>

          {/* Shop Category Tabs (3D Toggle) */}
          <div style={{
            display: 'flex',
            background: '#f1f5f9',
            borderRadius: '16px',
            padding: '4px',
            gap: '4px',
            marginBottom: '16px'
          }}>
            <button
              onClick={() => {
                sounds.playClick();
                setActiveTab('food');
              }}
              style={{
                flex: 1,
                padding: '8px 12px',
                borderRadius: '12px',
                border: 'none',
                background: activeTab === 'food' ? '#ffffff' : 'transparent',
                color: activeTab === 'food' ? '#15803d' : '#64748b',
                fontWeight: 900,
                fontSize: '13px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                cursor: 'pointer',
                boxShadow: activeTab === 'food' ? '0 4px 12px rgba(0,0,0,0.08)' : 'none',
                transition: 'all 0.2s'
              }}
            >
              <span>🍎</span>
              <span>Thức Ăn Ngon</span>
            </button>

            <button
              onClick={() => {
                sounds.playClick();
                setActiveTab('hat');
              }}
              style={{
                flex: 1,
                padding: '8px 12px',
                borderRadius: '12px',
                border: 'none',
                background: activeTab === 'hat' ? '#ffffff' : 'transparent',
                color: activeTab === 'hat' ? '#7c3aed' : '#64748b',
                fontWeight: 900,
                fontSize: '13px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                cursor: 'pointer',
                boxShadow: activeTab === 'hat' ? '0 4px 12px rgba(0,0,0,0.08)' : 'none',
                transition: 'all 0.2s'
              }}
            >
              <span>👑</span>
              <span>Mũ & Phụ Kiện</span>
            </button>
          </div>

          {/* Shop Item Grid with 3D Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
            gap: '10px',
            maxHeight: '380px',
            overflowY: 'auto',
            paddingRight: '2px',
            paddingBottom: '6px'
          }}>
            {activeTab === 'food' ? (
              shopItems.filter(i => i.type === 'food').map((item) => {
                const canAfford = coins >= item.price;
                return (
                  <div
                    key={item.id}
                    style={{
                      background: 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)',
                      border: '2px solid #e2e8f0',
                      borderRadius: '18px',
                      padding: '12px 8px',
                      textAlign: 'center',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      gap: '6px',
                      boxShadow: '0 4px 10px rgba(0,0,0,0.04)',
                      transition: 'all 0.2s'
                    }}
                  >
                    {/* Item Emoji */}
                    <div style={{
                      fontSize: '38px',
                      lineHeight: 1,
                      margin: '4px 0',
                      filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.1))',
                      transform: 'scale(1)',
                      transition: 'transform 0.2s'
                    }}>
                      {item.emoji}
                    </div>

                    {/* Item Title & Boost */}
                    <div>
                      <div style={{ fontSize: '12.5px', fontWeight: 900, color: '#1e293b' }}>
                        {item.name}
                      </div>
                      <div style={{ fontSize: '11px', fontWeight: 800, color: '#16a34a', marginTop: '2px' }}>
                        +{item.hungerBoost}% No bụng
                      </div>
                    </div>

                    {/* 3D Action Button */}
                    <button
                      onClick={() => handleFeed(item)}
                      className={`btn-kid ${canAfford ? 'btn-green' : 'btn-gray'}`}
                      style={{
                        padding: '6px 10px',
                        fontSize: '12px',
                        width: '100%',
                        borderRadius: '12px',
                        marginTop: '4px',
                        boxShadow: canAfford ? '0 4px 10px rgba(34, 197, 94, 0.3)' : 'none'
                      }}
                    >
                      <span>{item.price} Xu 🪙</span>
                    </button>
                  </div>
                );
              })
            ) : (
              shopItems.filter(i => i.type === 'hat').map((item) => {
                const isEquipped = activeHat === item.emoji;
                const canAfford = coins >= item.price || isEquipped;
                return (
                  <div
                    key={item.id}
                    style={{
                      background: isEquipped 
                        ? 'linear-gradient(180deg, #f5f3ff 0%, #ede9fe 100%)' 
                        : 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)',
                      border: isEquipped ? '2px solid #8b5cf6' : '2px solid #e2e8f0',
                      borderRadius: '18px',
                      padding: '12px 8px',
                      textAlign: 'center',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      gap: '6px',
                      boxShadow: isEquipped 
                        ? '0 6px 14px rgba(139, 92, 246, 0.25)' 
                        : '0 4px 10px rgba(0,0,0,0.04)',
                      transition: 'all 0.2s'
                    }}
                  >
                    {/* Item Emoji */}
                    <div style={{
                      fontSize: '38px',
                      lineHeight: 1,
                      margin: '4px 0',
                      filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.1))'
                    }}>
                      {item.emoji}
                    </div>

                    {/* Item Title */}
                    <div>
                      <div style={{ fontSize: '12.5px', fontWeight: 900, color: '#1e293b' }}>
                        {item.name}
                      </div>
                      <div style={{ fontSize: '11px', fontWeight: 800, color: '#7c3aed', marginTop: '2px' }}>
                        {isEquipped ? '✨ Đang đội' : 'Phụ kiện đẹp'}
                      </div>
                    </div>

                    {/* 3D Action Button */}
                    <button
                      onClick={() => handleEquipHat(item)}
                      className={`btn-kid ${isEquipped ? 'btn-pink' : canAfford ? 'btn-purple' : 'btn-gray'}`}
                      style={{
                        padding: '6px 10px',
                        fontSize: '12px',
                        width: '100%',
                        borderRadius: '12px',
                        marginTop: '4px',
                        boxShadow: isEquipped 
                          ? '0 4px 10px rgba(244, 114, 182, 0.35)' 
                          : canAfford ? '0 4px 10px rgba(168, 85, 247, 0.3)' : 'none'
                      }}
                    >
                      {isEquipped ? (
                        <span>Tháo Mũ ✖</span>
                      ) : (
                        <span>{item.price} Xu 🪙</span>
                      )}
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
