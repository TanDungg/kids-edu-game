// Database-First Data Manager for Kids Edu Game
// All collections (Words, Math, Logic, Pets, Shop) synchronize directly with Supabase Database
import * as XLSX from 'xlsx';
import { supabaseService } from './supabase';
import { autoDetectEmoji } from '../utils/emojiDetector';
import { 
  LANGUAGE_LEVELS, 
  MATH_LEVELS, 
  LOGIC_LEVELS, 
  INITIAL_PETS, 
  PET_SHOP_ITEMS 
} from '../data/gameData';

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
    const localWords = this.loadLocal(STORAGE_KEY_WORDS);
    this.words = localWords.length > 0 ? localWords : [...LANGUAGE_LEVELS];

    const localMath = this.loadLocal(STORAGE_KEY_MATH);
    this.mathLevels = localMath.length > 0 ? localMath : [...MATH_LEVELS];

    const localLogic = this.loadLocal(STORAGE_KEY_LOGIC);
    this.logicLevels = localLogic.length > 0 ? localLogic : [...LOGIC_LEVELS];

    const localPets = this.loadLocal(STORAGE_KEY_PETS);
    this.pets = localPets.length > 0 ? localPets : [...INITIAL_PETS];

    const localShop = this.loadLocal(STORAGE_KEY_SHOP);
    this.shopItems = localShop.length > 0 ? localShop : [...PET_SHOP_ITEMS];

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
    const itemsToInsert = [];

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
            id: Date.now() + Math.random(),
            vn: cleanVN,
            en: cleanEN,
            emoji: finalEmoji,
            theme: String(theme).trim(),
            targetVN: cleanVN.toUpperCase(),
            targetEN: cleanEN.toUpperCase(),
            hintVN: hint ? String(hint).trim() : `Đây là "${cleanVN}"`,
            hintEN: hint ? String(hint).trim() : `This is "${cleanEN}"`
          };

          itemsToInsert.push(item);
          next.push(item);
          addedCount++;
        }
      }
    }

    if (itemsToInsert.length > 0) {
      // GOM TOÀN BỘ VÀO 1 REQUEST DUY NHẤT (BULK INSERT)
      supabaseService.insertVocabularyBatch(itemsToInsert).catch((err) => {
        console.warn('Batch insert vocabulary warning:', err);
      });
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

  getShuffledMath() {
    return shuffleArray(this.mathLevels);
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

  getShuffledLogic() {
    return shuffleArray(this.logicLevels);
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

  // 1-Click: Nạp toàn bộ kho dữ liệu mẫu khổng lồ vào Local và Supabase Database
  async seedFullDatabase() {
    this.words = [...LANGUAGE_LEVELS];
    this.mathLevels = [...MATH_LEVELS];
    this.logicLevels = [...LOGIC_LEVELS];
    this.pets = [...INITIAL_PETS];
    this.shopItems = [...PET_SHOP_ITEMS];

    this.saveWords(this.words);
    this.saveMathLevels(this.mathLevels);
    this.saveLogicLevels(this.logicLevels);
    this.savePets(this.pets);
    this.saveShopItems(this.shopItems);

    // Đồng bộ lên Supabase Database trong nền bằng Bulk Insert (chỉ 5 request song song cho 5 bảng thay vì hơn 100 request)
    try {
      await Promise.all([
        supabaseService.insertVocabularyBatch(this.words),
        supabaseService.insertMathBatch(this.mathLevels),
        supabaseService.insertLogicBatch(this.logicLevels),
        supabaseService.insertPetsBatch(this.pets),
        supabaseService.insertShopBatch(this.shopItems)
      ]);
    } catch (err) {
      console.warn('Seed database background sync error:', err);
    }

    return {
      wordsCount: this.words.length,
      mathCount: this.mathLevels.length,
      logicCount: this.logicLevels.length,
      petsCount: this.pets.length,
      shopCount: this.shopItems.length
    };
  }

  // Thêm hàng loạt từ vựng
  async batchAddWords(items) {
    if (!Array.isArray(items) || items.length === 0) return 0;
    const formattedList = items.map((item, index) => {
      let finalEmoji = item.emoji ? item.emoji.trim() : '';
      if (!finalEmoji || finalEmoji === '⭐') {
        finalEmoji = autoDetectEmoji(item.vn, item.en);
      }
      return {
        id: Date.now() + index + Math.random(),
        vn: item.vn.trim(),
        en: (item.en || item.vn).trim(),
        emoji: finalEmoji,
        theme: item.theme?.trim() || 'Tổng hợp',
        targetVN: item.vn.trim().toUpperCase(),
        targetEN: (item.en || item.vn).trim().toUpperCase(),
        hintVN: item.hintVN || `Đây là "${item.vn}"`,
        hintEN: item.hintEN || `This is "${item.en || item.vn}"`
      };
    });

    this.words = [...this.words, ...formattedList];
    this.saveWords(this.words);

    // GOM TOÀN BỘ VÀO 1 REQUEST DUY NHẤT (BULK INSERT)
    supabaseService.insertVocabularyBatch(formattedList).catch((err) => {
      console.warn('Batch insert vocabulary warning:', err);
    });

    return formattedList.length;
  }

  // Phân tích văn bản dán tự do thành danh sách từ vựng song ngữ + emoji
  parseQuickTextWords(rawText) {
    if (!rawText || typeof rawText !== 'string') return [];
    
    // Tách theo dấu phẩy, chấm phẩy hoặc xuống dòng
    const lines = rawText
      .split(/[\n,;]+/)
      .map(s => s.trim())
      .filter(s => s.length > 0);

    const dictionaryMap = {
      'sư tử': { en: 'Lion', emoji: '🦁', theme: 'Động vật' },
      'hổ': { en: 'Tiger', emoji: '🐯', theme: 'Động vật' },
      'báo': { en: 'Leopard', emoji: '🐆', theme: 'Động vật' },
      'voi': { en: 'Elephant', emoji: '🐘', theme: 'Động vật' },
      'khỉ': { en: 'Monkey', emoji: '🐒', theme: 'Động vật' },
      'gấu': { en: 'Bear', emoji: '🐻', theme: 'Động vật' },
      'gấu trúc': { en: 'Panda', emoji: '🐼', theme: 'Động vật' },
      'gấu bắc cực': { en: 'Polar Bear', emoji: '🐻‍❄️', theme: 'Động vật' },
      'hươu': { en: 'Deer', emoji: '🦌', theme: 'Động vật' },
      'hươu cao cổ': { en: 'Giraffe', emoji: '🦒', theme: 'Động vật' },
      'ngựa vằn': { en: 'Zebra', emoji: '🦓', theme: 'Động vật' },
      'lạc đà': { en: 'Camel', emoji: '🐪', theme: 'Động vật' },
      'cá sấu': { en: 'Crocodile', emoji: '🐊', theme: 'Động vật' },
      'hà mã': { en: 'Hippo', emoji: '🦛', theme: 'Động vật' },
      'tê giác': { en: 'Rhino', emoji: '🦏', theme: 'Động vật' },
      'sóc': { en: 'Squirrel', emoji: '🐿️', theme: 'Động vật' },
      'cáo': { en: 'Fox', emoji: '🦊', theme: 'Động vật' },
      'sói': { en: 'Wolf', emoji: '🐺', theme: 'Động vật' },
      'cá voi': { en: 'Whale', emoji: '🐳', theme: 'Động vật' },
      'cá mập': { en: 'Shark', emoji: '🦈', theme: 'Động vật' },
      'bạch tuộc': { en: 'Octopus', emoji: '🐙', theme: 'Động vật' },
      'sao biển': { en: 'Starfish', emoji: '⭐', theme: 'Động vật' },
      'con cua': { en: 'Crab', emoji: '🦀', theme: 'Động vật' },
      'tôm': { en: 'Shrimp', emoji: '🦐', theme: 'Động vật' },
      'mực': { en: 'Squid', emoji: '🦑', theme: 'Động vật' },
      'chim ưng': { en: 'Falcon', emoji: '🦅', theme: 'Động vật' },
      'cú mèo': { en: 'Owl', emoji: '🦉', theme: 'Động vật' },
      'chim bồ câu': { en: 'Dove', emoji: '🕊️', theme: 'Động vật' },
      'chim vẹt': { en: 'Parrot', emoji: '🦜', theme: 'Động vật' },
      'dưa lưới': { en: 'Melon', emoji: '🍈', theme: 'Trái cây' },
      'quả lê': { en: 'Pear', emoji: '🍐', theme: 'Trái cây' },
      'quả đào': { en: 'Peach', emoji: '🍑', theme: 'Trái cây' },
      'quả cherry': { en: 'Cherry', emoji: '🍒', theme: 'Trái cây' },
      'chanh': { en: 'Lemon', emoji: '🍋', theme: 'Trái cây' },
      'dứa': { en: 'Pineapple', emoji: '🍍', theme: 'Trái cây' },
      'súp lơ': { en: 'Broccoli', emoji: '🥦', theme: 'Rau củ' },
      'hành tây': { en: 'Onion', emoji: '🧅', theme: 'Rau củ' },
      'khoai tây': { en: 'Potato', emoji: '🥔', theme: 'Rau củ' },
      'xe máy': { en: 'Motorcycle', emoji: '🛵', theme: 'Phương tiện' },
      'trực thăng': { en: 'Helicopter', emoji: '🚁', theme: 'Phương tiện' },
      'thuyền buồm': { en: 'Sailboat', emoji: '⛵', theme: 'Phương tiện' },
      'xe cứu hỏa': { en: 'Fire Truck', emoji: '🚒', theme: 'Phương tiện' },
      'xe cảnh sát': { en: 'Police Car', emoji: '🚓', theme: 'Phương tiện' },
      'xe cấp cứu': { en: 'Ambulance', emoji: '🚑', theme: 'Phương tiện' },
      'khinh khí cầu': { en: 'Hot Air Balloon', emoji: '🎈', theme: 'Phương tiện' }
    };

    return lines.map(raw => {
      // Cho phép cú pháp: "Từ VN: Từ EN" hoặc chỉ "Từ VN"
      let vnPart = raw;
      let enPart = '';

      if (raw.includes(':') || raw.includes('-')) {
        const parts = raw.split(/[:\-]+/);
        vnPart = parts[0].trim();
        enPart = parts[1].trim();
      }

      const lower = vnPart.toLowerCase();
      const matched = dictionaryMap[lower];

      const enFinal = enPart || matched?.en || vnPart;
      const emojiFinal = matched?.emoji || autoDetectEmoji(vnPart, enFinal);
      const themeFinal = matched?.theme || 'Khám phá';

      return {
        vn: vnPart,
        en: enFinal,
        emoji: emojiFinal,
        theme: themeFinal,
        hintVN: `Bé nhận ra đây là "${vnPart}" không?`,
        hintEN: `Can you guess the "${enFinal}"?`
      };
    });
  }

  // Tự động sinh hàng loạt bài tập toán học
  generateSmartMathLevels(count = 5, category = 'all') {
    const items = [
      { emoji: '🍓', name: 'dâu tây' },
      { emoji: '🍎', name: 'quả táo' },
      { emoji: '🍌', name: 'quả chuối' },
      { emoji: '🍊', name: 'quả cam' },
      { emoji: '🐝', name: 'chú ong' },
      { emoji: '🥕', name: 'củ cà rốt' },
      { emoji: '🍬', name: 'viên kẹo' },
      { emoji: '🍄', name: 'cây nấm' },
      { emoji: '⭐', name: 'ngôi sao' },
      { emoji: '🐟', name: 'chú cá' },
      { emoji: '🦆', name: 'chú vịt' }
    ];

    const types = category === 'all' 
      ? ['count', 'addition', 'compare'] 
      : [category];

    const newLevels = [];

    for (let i = 0; i < count; i++) {
      const selectedType = types[Math.floor(Math.random() * types.length)];
      const item = items[Math.floor(Math.random() * items.length)];
      const id = Date.now() + i + Math.floor(Math.random() * 1000);

      if (selectedType === 'count') {
        const target = Math.floor(Math.random() * 8) + 2; // 2 to 9
        const opts = shuffleArray([
          target,
          Math.max(1, target - 1),
          target + 1,
          target + 2
        ]);

        newLevels.push({
          id,
          type: 'count',
          title: `Đếm ${item.name}`,
          promptVN: `Bé hãy chạm vào từng ${item.name} để đếm nhé!`,
          promptEN: `Count each ${item.name}!`,
          itemEmoji: item.emoji,
          targetCount: target,
          options: opts,
          answer: target
        });
      } else if (selectedType === 'addition') {
        const a = Math.floor(Math.random() * 4) + 1; // 1 to 4
        const b = Math.floor(Math.random() * 5) + 1; // 1 to 5
        const ans = a + b;
        const opts = shuffleArray([
          ans,
          Math.max(1, ans - 1),
          ans + 1
        ]);

        newLevels.push({
          id,
          type: 'addition',
          title: `Cộng ${item.name}`,
          promptVN: `${a} ${item.name} thêm ${b} ${item.name} là mấy?`,
          promptEN: `${a} plus ${b} equals how many?`,
          num1: a,
          num2: b,
          itemEmoji: item.emoji,
          options: opts,
          answer: ans
        });
      } else {
        // Compare
        const a = Math.floor(Math.random() * 7) + 2;
        let b = Math.floor(Math.random() * 7) + 2;
        if (a === b) b = a + 1;

        const isLeftMore = a > b;
        const answer = isLeftMore ? `Bên Trái (${a})` : `Bên Phải (${b})`;

        newLevels.push({
          id,
          type: 'compare',
          title: `So Sánh ${item.name}`,
          promptVN: `Bên nào có NHIỀU ${item.name} hơn?`,
          promptEN: `Which side has MORE?`,
          sideA: { count: a, emoji: item.emoji },
          sideB: { count: b, emoji: item.emoji },
          options: [`Bên Trái (${a})`, `Bên Phải (${b})`],
          answer
        });
      }
    }

    this.mathLevels = [...this.mathLevels, ...newLevels];
    this.saveMathLevels(this.mathLevels);

    // GOM TOÀN BỘ CÂU HỎI TOÁN VÀO 1 REQUEST DUY NHẤT (BULK INSERT)
    supabaseService.insertMathBatch(newLevels).catch((err) => {
      console.warn('Batch insert math warning:', err);
    });

    return newLevels.length;
  }

  // Tự động sinh hàng loạt câu đố Logic
  generateSmartLogicLevels(count = 5) {
    const emojiPairs = [
      ['🔴', '🟡', 'Đỏ - Vàng'],
      ['🍎', '🍏', 'Táo đỏ - Táo xanh'],
      ['🐶', '🐱', 'Cún - Miu'],
      ['🚗', '✈️', 'Ô tô - Máy bay'],
      ['⭐', '💖', 'Sao - Tim'],
      ['☀️', '🌙', 'Ngày - Đêm'],
      ['🌸', '🍀', 'Hoa - Cỏ']
    ];

    const newLevels = [];

    for (let i = 0; i < count; i++) {
      const pair = emojiPairs[Math.floor(Math.random() * emojiPairs.length)];
      const id = Date.now() + i + Math.floor(Math.random() * 1000);
      const e1 = pair[0];
      const e2 = pair[1];

      // Pattern: e1, e2, e1, e2, e1 -> answer: e2
      const opts = shuffleArray([e2, e1, '⭐', '🌈']);

      newLevels.push({
        id,
        type: 'pattern',
        title: `Quy Luật ${pair[2]}`,
        promptVN: `Hình tiếp theo trong chuỗi là hình gì bé ơi?`,
        promptEN: `What comes next in the sequence?`,
        sequence: [e1, e2, e1, e2, e1],
        options: opts,
        answer: e2,
        hint: `Quy luật lặp lại nhịp nhàng giữa ${e1} và ${e2}...`
      });
    }

    this.logicLevels = [...this.logicLevels, ...newLevels];
    this.saveLogicLevels(this.logicLevels);

    // GOM TOÀN BỘ CÂU ĐỐ LOGIC VÀO 1 REQUEST DUY NHẤT (BULK INSERT)
    supabaseService.insertLogicBatch(newLevels).catch((err) => {
      console.warn('Batch insert logic warning:', err);
    });

    return newLevels.length;
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
