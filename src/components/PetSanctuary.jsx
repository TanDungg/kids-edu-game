import React, { useState, useEffect } from 'react';
import { ArrowLeft, Heart, Sparkles, ShoppingBag, Utensils } from 'lucide-react';
import confetti from 'canvas-confetti';
import { dataManager } from '../services/dataManager';
import { sounds } from '../utils/sound';

const DEFAULT_PETS = [
  { id: 'cat', name: 'Bé Miu Miu', emoji: '🐱', sound: 'Meo meo~', hunger: 80, happiness: 90 },
  { id: 'dog', name: 'Cún Lu Lu', emoji: '🐶', sound: 'Gâu gâu!', hunger: 75, happiness: 85 },
  { id: 'rabbit', name: 'Thỏ Bông', emoji: '🐰', sound: 'Khịt khịt~', hunger: 90, happiness: 95 }
];

const DEFAULT_SHOP = [
  { id: 1, name: 'Kem Dâu', type: 'food', emoji: '🍦', price: 15, hungerBoost: 25 },
  { id: 2, name: 'Táo Đỏ', type: 'food', emoji: '🍎', price: 10, hungerBoost: 15 },
  { id: 3, name: 'Bánh Donut', type: 'food', emoji: '🍩', price: 20, hungerBoost: 30 },
  { id: 4, name: 'Sữa Tươi', type: 'food', emoji: '🥛', price: 12, hungerBoost: 20 },
  { id: 5, name: 'Mũ Phù Thủy', type: 'hat', emoji: '🧙', price: 50, hungerBoost: 0 },
  { id: 6, name: 'Mũ Vương Miện', type: 'hat', emoji: '👑', price: 80, hungerBoost: 0 },
  { id: 7, name: 'Kính Râm Cool', type: 'hat', emoji: '🕶️', price: 40, hungerBoost: 0 },
  { id: 8, name: 'Mũ Cao Bồi', type: 'hat', emoji: '🤠', price: 45, hungerBoost: 0 }
];

export default function PetSanctuary({ 
  onBack, 
  coins, 
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
  const [activeHat, setActiveHat] = useState(null);
  const [actionMessage, setActionMessage] = useState('');

  useEffect(() => {
    return dataManager.subscribe(() => {
      const dbPets = dataManager.getPets();
      const dbShop = dataManager.getShopItems();
      if (dbPets && dbPets.length > 0) setPets(dbPets);
      if (dbShop && dbShop.length > 0) setShopItems(dbShop);
      if ((!selectedPet || !selectedPet.id) && dbPets && dbPets.length > 0) {
        setSelectedPet(dbPets[0]);
      }
    });
  }, [selectedPet]);



  const handleFeed = (item) => {
    if (coins < item.price) {
      sounds.playError();
      setActionMessage('Bé cần học thêm để kiếm đủ xu mua món này nhé! 🪙');
      return;
    }

    sounds.playCoin();
    sounds.playSuccess();
    onSpendCoins(item.price);

    const nextHunger = Math.min(100, (selectedPet.hunger || 70) + item.hungerBoost);
    const nextHappiness = Math.min(100, (selectedPet.happiness || 80) + 10);
    const updated = { ...selectedPet, hunger: nextHunger, happiness: nextHappiness };
    setSelectedPet(updated);
    onUpdatePet(updated);

    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.5 }
    });

    setActionMessage(`${selectedPet.name} thích ${item.name} lắm, cảm ơn bé! 💕`);
    sounds.speak(`${selectedPet.name} rất vui và khen ngon!`, 'vi-VN');
  };

  const handleEquipHat = (item) => {
    if (coins < item.price && activeHat !== item.emoji) {
      sounds.playError();
      setActionMessage('Bé cần thêm xu để mở khóa trang phục này nhé! 🪙');
      return;
    }

    sounds.playClick();
    if (activeHat === item.emoji) {
      setActiveHat(null);
      setActionMessage(`Đã tháo ${item.name}!`);
    } else {
      onSpendCoins(item.price);
      setActiveHat(item.emoji);
      setActionMessage(`Đã đội ${item.name} cho ${selectedPet.name} cực ngầu! ✨`);
      sounds.playStar();
    }
  };

  return (
    <div className="page-container" style={{ maxWidth: '850px' }}>
      {/* Top Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', gap: '8px' }}>
        <button onClick={onBack} className="btn-kid btn-yellow" style={{ padding: '7px 12px', fontSize: '13px', flexShrink: 0 }}>
          <ArrowLeft size={16} />
          <span>Bản đồ</span>
        </button>

        <div style={{ background: '#fef3c7', color: '#b45309', padding: '5px 14px', borderRadius: '999px', fontWeight: 800, fontSize: '13px', border: '1.5px solid #fde68a' }}>
          🪙 Xu của bé: <strong>{coins}</strong>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
        {/* Left: Pet Display Stage */}
        <div className="kid-card" style={{ padding: 'clamp(16px, 4vw, 28px)', textAlign: 'center', background: '#ffffff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Pet Switcher - Smooth Horizontal Scroll */}
          <div style={{
            display: 'flex',
            gap: '8px',
            marginBottom: '14px',
            overflowX: 'auto',
            maxWidth: '100%',
            padding: '4px 2px',
            WebkitOverflowScrolling: 'touch',
            scrollbarWidth: 'none'
          }}>
            {pets.map((p) => (
              <button
                key={p.id}
                onClick={() => {
                  sounds.playClick();
                  setSelectedPet(p);
                  onUpdatePet(p);
                }}
                className={`btn-kid ${selectedPet.id === p.id ? 'btn-yellow' : 'btn-gray'}`}
                style={{
                  padding: '6px 12px',
                  fontSize: '20px',
                  flexShrink: 0
                }}
              >
                {p.emoji}
              </button>
            ))}
          </div>

          {/* Pet Character with Hat */}
          <div style={{ position: 'relative', margin: '20px 0' }}>
            {activeHat && (
              <div 
                className="animate-bounce-slow"
                style={{
                  position: 'absolute',
                  top: '-32px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  fontSize: '54px',
                  zIndex: 10
                }}
              >
                {activeHat}
              </div>
            )}
            <div 
              style={{ fontSize: '120px', cursor: 'pointer' }}
              className="animate-wiggle"
              onClick={() => {
                sounds.playClick();
                sounds.speak(selectedPet.sound, 'vi-VN');
              }}
            >
              {selectedPet.emoji}
            </div>
          </div>

          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '24px', fontWeight: 800, color: '#78350f' }}>
            {selectedPet.name}
          </h3>
          <p style={{ color: '#64748b', fontSize: '14px', fontWeight: 700 }}>
            Tiếng kêu: "{selectedPet.sound}"
          </p>

          {/* Stats Progress Bars */}
          <div style={{ width: '100%', marginTop: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: 800, color: '#047857', marginBottom: '4px' }}>
              <span>Độ no bụng:</span>
              <span>{selectedPet.hunger || 80}%</span>
            </div>
            <div style={{ width: '100%', height: '14px', background: '#e2e8f0', borderRadius: '999px', overflow: 'hidden', marginBottom: '12px' }}>
              <div style={{ width: `${selectedPet.hunger || 80}%`, height: '100%', background: 'linear-gradient(90deg, #4ade80, #22c55e)', borderRadius: '999px' }} />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: 800, color: '#be185d', marginBottom: '4px' }}>
              <span>Độ hạnh phúc:</span>
              <span>{selectedPet.happiness || 90}%</span>
            </div>
            <div style={{ width: '100%', height: '14px', background: '#e2e8f0', borderRadius: '999px', overflow: 'hidden' }}>
              <div style={{ width: `${selectedPet.happiness || 90}%`, height: '100%', background: 'linear-gradient(90deg, #f472b6, #db2777)', borderRadius: '999px' }} />
            </div>
          </div>

          {actionMessage && (
            <div style={{ marginTop: '16px', fontSize: '13px', fontWeight: 800, color: '#ca8a04', background: '#fffbeb', padding: '8px 16px', borderRadius: '12px', border: '1px solid #fde68a' }}>
              {actionMessage}
            </div>
          )}
        </div>

        {/* Right: Pet Shop */}
        <div className="kid-card" style={{ padding: '24px', background: '#ffffff' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <ShoppingBag size={22} color="#ca8a04" />
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: 800, color: '#1e293b' }}>
              Cửa Hàng Quà Tặng
            </h3>
          </div>

          {/* Foods Section */}
          <div style={{ marginBottom: '20px' }}>
            <div style={{ fontSize: '13px', fontWeight: 800, color: '#047857', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '10px' }}>
              <Utensils size={14} /> Thức ăn thơm ngon:
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(115px, 1fr))', gap: '10px' }}>
              {shopItems.filter(i => i.type === 'food').map((item) => (
                <div
                  key={item.id}
                  style={{
                    background: '#f8fafc',
                    border: '2px solid #e2e8f0',
                    borderRadius: '16px',
                    padding: '12px',
                    textAlign: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: '6px'
                  }}
                >
                  <div style={{ fontSize: '36px' }}>{item.emoji}</div>
                  <div style={{ fontSize: '13px', fontWeight: 800, color: '#334155' }}>{item.name}</div>
                  <button
                    onClick={() => handleFeed(item)}
                    className="btn-kid btn-green"
                    style={{ padding: '6px 10px', fontSize: '12px', width: '100%' }}
                  >
                    <span>{item.price} Xu 🪙</span>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Costumes Section */}
          <div>
            <div style={{ fontSize: '13px', fontWeight: 800, color: '#7c3aed', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '10px' }}>
              <Sparkles size={14} /> Mũ & Phụ kiện siêu ngầu:
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(115px, 1fr))', gap: '10px' }}>
              {shopItems.filter(i => i.type === 'hat').map((item) => {
                const isEquipped = activeHat === item.emoji;
                return (
                  <div
                    key={item.id}
                    style={{
                      background: isEquipped ? '#f5f3ff' : '#f8fafc',
                      border: isEquipped ? '2px solid #8b5cf6' : '2px solid #e2e8f0',
                      borderRadius: '16px',
                      padding: '12px',
                      textAlign: 'center',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      gap: '6px'
                    }}
                  >
                    <div style={{ fontSize: '36px' }}>{item.emoji}</div>
                    <div style={{ fontSize: '13px', fontWeight: 800, color: '#334155' }}>{item.name}</div>
                    <button
                      onClick={() => handleEquipHat(item)}
                      className={`btn-kid ${isEquipped ? 'btn-pink' : 'btn-purple'}`}
                      style={{ padding: '6px 10px', fontSize: '12px', width: '100%' }}
                    >
                      <span>{isEquipped ? 'Đang đội' : `${item.price} Xu 🪙`}</span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
