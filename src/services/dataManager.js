// Database-First Data Manager for Kids Edu Game
// All collections (Words, Math, Logic, Pets, Shop) synchronize directly with Supabase Database
import * as XLSX from 'xlsx';
import { supabaseService } from './supabase';
import { autoDetectEmoji } from '../utils/emojiDetector';

const STORAGE_KEY_WORDS = 'kids_game_custom_words';
const STORAGE_KEY_MATH = 'kids_game_custom_math';
const STORAGE_KEY_LOGIC = 'kids_game_custom_logic';
const STORAGE_KEY_SHOP = 'kids_game_custom_shop';
const STORAGE_KEY_PETS = 'kids_game_custom_pets';

// Fisher-Yates Shuffle Algorithm
export function shuffleArray(arr) {
  if (!Array.isArray(arr)) return [];
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

class DataManager {
  constructor() {
    this.listeners = new Set();
    this.words = this.loadLocal(STORAGE_KEY_WORDS);
    this.mathLevels = this.loadLocal(STORAGE_KEY_MATH);
    this.logicLevels = this.loadLocal(STORAGE_KEY_LOGIC);
    this.pets = this.loadLocal(STORAGE_KEY_PETS);
    this.shopItems = this.loadLocal(STORAGE_KEY_SHOP);

    // Tự động kéo dữ liệu thật từ Supabase Database khi khởi động
    this.initDatabaseData();
  }

  subscribe(callback) {
    if (typeof callback === 'function') {
      this.listeners.add(callback);
    }
    return () => {
      this.listeners.delete(callback);
    };
  }

  notify() {
    this.listeners.forEach(fn => {
      try {
        fn();
      } catch (err) {
        console.error('DataManager listener error:', err);
      }
    });
  }

  loadLocal(key) {
    try {
      const saved = localStorage.getItem(key);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // fallback
    }
    return [];
  }

  // Kéo dữ liệu thời gian thực từ Supabase Database
  async initDatabaseData() {
    try {
      const [dbWords, dbMath, dbLogic, dbPets, dbShop] = await Promise.all([
        supabaseService.fetchVocabulary(),
        supabaseService.fetchMath(),
        supabaseService.fetchLogic(),
        supabaseService.fetchPets(),
        supabaseService.fetchShop()
      ]);

      if (Array.isArray(dbWords) && dbWords.length > 0) {
        this.words = dbWords;
        localStorage.setItem(STORAGE_KEY_WORDS, JSON.stringify(dbWords));
      }
      if (Array.isArray(dbMath) && dbMath.length > 0) {
        this.mathLevels = dbMath;
        localStorage.setItem(STORAGE_KEY_MATH, JSON.stringify(dbMath));
      }
      if (Array.isArray(dbLogic) && dbLogic.length > 0) {
        this.logicLevels = dbLogic;
        localStorage.setItem(STORAGE_KEY_LOGIC, JSON.stringify(dbLogic));
      }
      if (Array.isArray(dbPets) && dbPets.length > 0) {
        this.pets = dbPets;
        localStorage.setItem(STORAGE_KEY_PETS, JSON.stringify(dbPets));
      }
      if (Array.isArray(dbShop) && dbShop.length > 0) {
        this.shopItems = dbShop;
        localStorage.setItem(STORAGE_KEY_SHOP, JSON.stringify(dbShop));
      }
    } catch (e) {
      console.warn('Sync database error:', e);
    } finally {
      this.notify();
    }
  }

  // ===================== 1. TỪ VỰNG & NGÔN NGỮ =====================
  getWords() {
    return this.words;
  }

  getShuffledWords() {
    return shuffleArray(this.words);
  }

  saveWords(newWords) {
    this.words = newWords;
    localStorage.setItem(STORAGE_KEY_WORDS, JSON.stringify(newWords));
    this.notify();
  }

  async addWord(item) {
    let finalEmoji = item.emoji ? item.emoji.trim() : '';
    if (!finalEmoji || finalEmoji === '⭐') {
      finalEmoji = autoDetectEmoji(item.vn, item.en);
    }

    const formatted = {
      id: Date.now() + Math.random(),
      vn: item.vn.trim(),
      en: item.en.trim(),
      emoji: finalEmoji,
      theme: item.theme?.trim() || 'Tổng hợp',
      targetVN: item.vn.trim().toUpperCase(),
      targetEN: item.en.trim().toUpperCase(),
      hintVN: item.hintVN || `Đây là từ "${item.vn}"`,
      hintEN: item.hintEN || `This is "${item.en}"`
    };

    // 1. Lưu vào Database Supabase
    const dbRecord = await supabaseService.insertVocabulary(formatted);
    if (dbRecord && dbRecord.id) {
      formatted.id = dbRecord.id;
    }

    // 2. Cập nhật cache cục bộ
    const next = [...this.words, formatted];
    this.saveWords(next);
    return formatted;
  }

  async deleteWord(id) {
    // Xóa từ Database Supabase
    await supabaseService.deleteVocabulary(id);

    const next = this.words.filter(w => w.id !== id);
    this.saveWords(next);
    return next;
  }

  async importFromRows(rawRows) {
    if (!Array.isArray(rawRows) || rawRows.length === 0) return 0;

    let addedCount = 0;
    const next = [...this.words];

    for (const row of rawRows) {
      const vn = row['TiengViet'] || row['Tiếng Việt'] || row['vn'] || row['VN'] || row['Vietnamese'];
      const en = row['TiengAnh'] || row['Tiếng Anh'] || row['en'] || row['EN'] || row['English'];
      const emoji = row['Emoji'] || row['Icon'] || row['emoji'] || row['icon'];
      const theme = row['ChuDe'] || row['Chủ đề'] || row['theme'] || row['Theme'] || 'Đời sống';
      const hint = row['GoiY'] || row['Gợi ý'] || row['hint'] || '';

      if (vn && en) {
        const cleanVN = String(vn).trim();
        const cleanEN = String(en).trim();

        let finalEmoji = emoji ? String(emoji).trim() : '';
        if (!finalEmoji || finalEmoji === '⭐') {
          finalEmoji = autoDetectEmoji(cleanVN, cleanEN);
        }

        const exists = next.some(
          w => w.vn.toLowerCase() === cleanVN.toLowerCase() || 
               w.en.toLowerCase() === cleanEN.toLowerCase()
        );

        if (!exists) {
          const item = {
            vn: cleanVN,
            en: cleanEN,
            emoji: finalEmoji,
            theme: String(theme).trim(),
            targetVN: cleanVN.toUpperCase(),
            targetEN: cleanEN.toUpperCase(),
            hintVN: hint ? String(hint).trim() : `Đây là "${cleanVN}"`,
            hintEN: hint ? String(hint).trim() : `This is "${cleanEN}"`
          };

          // Gửi INSERT vào Database Supabase
          const dbCreated = await supabaseService.insertVocabulary(item);
          item.id = dbCreated?.id || (Date.now() + Math.random());

          next.push(item);
          addedCount++;
        }
      }
    }

    if (addedCount > 0) {
      this.saveWords(next);
    }
    return addedCount;
  }

  downloadSampleExcel() {
    const sampleData = [
      { TiengViet: 'Con Voi', TiengAnh: 'Elephant', Emoji: '', ChuDe: 'Động vật', GoiY: 'Có vòi dài và tai to' },
      { TiengViet: 'Con Hổ', TiengAnh: 'Tiger', Emoji: '', ChuDe: 'Động vật', GoiY: 'Chúa sơn lâm có vằn' },
      { TiengViet: 'Quả Chuối', TiengAnh: 'Banana', Emoji: '', ChuDe: 'Trái cây', GoiY: 'Quả cong vỏ vàng ngọt' },
      { TiengViet: 'Máy Bay', TiengAnh: 'Airplane', Emoji: '', ChuDe: 'Phương tiện', GoiY: 'Bay lượn trên bầu trời' },
      { TiengViet: 'Cá Heo', TiengAnh: 'Dolphin', Emoji: '', ChuDe: 'Động vật', GoiY: 'Rất thông minh bơi dưới biển' }
    ];

    const worksheet = XLSX.utils.json_to_sheet(sampleData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'TuVungMau');
    XLSX.writeFile(workbook, 'mau_tu_vung_game_tre_em.xlsx');
  }

  // ===================== 2. TOÁN HỌC (MATH FARM) =====================
  getMathLevels() {
    return this.mathLevels;
  }

  saveMathLevels(levels) {
    this.mathLevels = levels;
    localStorage.setItem(STORAGE_KEY_MATH, JSON.stringify(levels));
    this.notify();
  }

  async addMathLevel(item) {
    const newLevel = {
      type: item.type || 'count',
      title: item.title || 'Câu hỏi Toán Học',
      promptVN: item.promptVN || 'Bé hãy giải bài toán này nhé!',
      promptEN: item.promptEN || 'Solve this math puzzle!',
      itemEmoji: item.itemEmoji || '🍎',
      targetCount: item.targetCount !== undefined ? Number(item.targetCount) : undefined,
      num1: item.num1 !== undefined ? Number(item.num1) : undefined,
      num2: item.num2 !== undefined ? Number(item.num2) : undefined,
      options: item.options || [1, 2, 3, 4],
      answer: item.answer
    };

    // Gửi INSERT vào Supabase
    const dbCreated = await supabaseService.insertMath(newLevel);
    newLevel.id = dbCreated?.id || (Date.now() + Math.random());

    const next = [...this.mathLevels, newLevel];
    this.saveMathLevels(next);
    return newLevel;
  }

  async deleteMathLevel(id) {
    await supabaseService.deleteMath(id);
    const next = this.mathLevels.filter(m => m.id !== id);
    this.saveMathLevels(next);
    return next;
  }

  // ===================== 3. LOGIC & TƯ DUY (LOGIC TOWER) =====================
  getLogicLevels() {
    return this.logicLevels;
  }

  saveLogicLevels(levels) {
    this.logicLevels = levels;
    localStorage.setItem(STORAGE_KEY_LOGIC, JSON.stringify(levels));
    this.notify();
  }

  async addLogicLevel(item) {
    const newLevel = {
      type: item.type || 'pattern',
      title: item.title || 'Câu đố tư duy',
      promptVN: item.promptVN || 'Bé hãy tìm quy luật chính xác!',
      promptEN: item.promptEN || 'Find the right logic!',
      sequence: item.sequence || [],
      options: item.options || [],
      answer: item.answer,
      hint: item.hint || ''
    };

    // Gửi INSERT vào Supabase
    const dbCreated = await supabaseService.insertLogic(newLevel);
    newLevel.id = dbCreated?.id || (Date.now() + Math.random());

    const next = [...this.logicLevels, newLevel];
    this.saveLogicLevels(next);
    return newLevel;
  }

  async deleteLogicLevel(id) {
    await supabaseService.deleteLogic(id);
    const next = this.logicLevels.filter(l => l.id !== id);
    this.saveLogicLevels(next);
    return next;
  }

  // ===================== 4. THÚ CƯNG (PETS) =====================
  getPets() {
    return this.pets;
  }

  savePets(pets) {
    this.pets = pets;
    localStorage.setItem(STORAGE_KEY_PETS, JSON.stringify(pets));
    this.notify();
  }

  async addPet(item) {
    const newPet = {
      id: item.id || `pet_${Date.now()}`,
      name: item.name || 'Thú Cưng Mới',
      emoji: item.emoji || '🐶',
      sound: item.sound || 'Gâu gâu!',
      hunger: item.hunger || 80,
      happiness: item.happiness || 85
    };

    // Gửi INSERT vào Supabase
    await supabaseService.insertPet(newPet);

    const next = [...this.pets, newPet];
    this.savePets(next);
    return newPet;
  }

  async deletePet(id) {
    await supabaseService.deletePet(id);
    const next = this.pets.filter(p => p.id !== id);
    this.savePets(next);
    return next;
  }

  // ===================== 5. CỬA HÀNG VẬT PHẨM (SHOP ITEMS) =====================
  getShopItems() {
    return this.shopItems;
  }

  saveShopItems(items) {
    this.shopItems = items;
    localStorage.setItem(STORAGE_KEY_SHOP, JSON.stringify(items));
    this.notify();
  }

  async addShopItem(item) {
    const newItem = {
      id: item.id || `item_${Date.now()}`,
      name: item.name || 'Vật Phẩm Mới',
      type: item.type || 'food',
      emoji: item.emoji || '🍪',
      price: Number(item.price) || 10,
      hungerBoost: item.hungerBoost ? Number(item.hungerBoost) : undefined
    };

    // Gửi INSERT vào Supabase
    await supabaseService.insertShop(newItem);

    const next = [...this.shopItems, newItem];
    this.saveShopItems(next);
    return newItem;
  }

  async deleteShopItem(id) {
    await supabaseService.deleteShop(id);
    const next = this.shopItems.filter(i => i.id !== id);
    this.saveShopItems(next);
    return next;
  }

  // Đồng bộ cưỡng bức từ Database về lại client
  async refreshFromDatabase() {
    await this.initDatabaseData();
    return {
      words: this.words,
      mathLevels: this.mathLevels,
      logicLevels: this.logicLevels,
      pets: this.pets,
      shopItems: this.shopItems
    };
  }
}

export const PRESET_PACKS = {
  animals: {
    name: '🐾 Thế Giới Động Vật',
    items: [
      { vn: 'Con Voi', en: 'Elephant', emoji: '🐘', theme: 'Động vật', hint: 'Có vòi dài và đôi tai to lớn' },
      { vn: 'Con Hổ', en: 'Tiger', emoji: '🐯', theme: 'Động vật', hint: 'Chúa sơn lâm có vằn màu cam đen' },
      { vn: 'Con Khỉ', en: 'Monkey', emoji: '🐒', theme: 'Động vật', hint: 'Thích ăn chuối và leo trèo cây' },
      { vn: 'Con Ngựa', en: 'Horse', emoji: '🐴', theme: 'Động vật', hint: 'Chạy rất nhanh trên thảo nguyên' },
      { vn: 'Cá Heo', en: 'Dolphin', emoji: '🐬', theme: 'Động vật', hint: 'Rất thông minh và thích biểu diễn' }
    ]
  },
  fruits: {
    name: '🍎 Vườn Trái Cây Tươi Ngon',
    items: [
      { vn: 'Quả Táo', en: 'Apple', emoji: '🍎', theme: 'Trái cây', hint: 'Màu đỏ hoặc xanh, giòn ngọt' },
      { vn: 'Quả Chuối', en: 'Banana', emoji: '🍌', theme: 'Trái cây', hint: 'Vỏ vàng uốn cong thơm lừng' },
      { vn: 'Quả Cam', en: 'Orange', emoji: '🍊', theme: 'Trái cây', hint: 'Chứa nhiều vitamin C và mọng nước' },
      { vn: 'Quả Dưa Hấu', en: 'Watermelon', emoji: '🍉', theme: 'Trái cây', hint: 'Vỏ xanh ruột đỏ hạt đen giải khát mùa hè' }
    ]
  },
  vehicles: {
    name: '🚀 Phương Tiện Giao Thông',
    items: [
      { vn: 'Máy Bay', en: 'Airplane', emoji: '✈️', theme: 'Phương tiện', hint: 'Bay lượn trên bầu trời xanh' },
      { vn: 'Ô Tô', en: 'Car', emoji: '🚗', theme: 'Phương tiện', hint: 'Chạy bon bon trên 4 bánh xe' },
      { vn: 'Tàu Hỏa', en: 'Train', emoji: '🚂', theme: 'Phương tiện', hint: 'Chạy xình xịch trên đường ray' },
      { vn: 'Tên Lửa', en: 'Rocket', emoji: '🚀', theme: 'Phương tiện', hint: 'Phóng vút bay vào không gian vũ trụ' }
    ]
  }
};

export const dataManager = new DataManager();
