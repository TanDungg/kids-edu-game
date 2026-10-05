// Intelligent Keyword-to-Emoji Auto Detector for Kids Edu Game
// Supports both Vietnamese (with and without prefixes) and English terms

const EMOJI_DICTIONARY = [
  // --- Animals / Động vật ---
  { emoji: "🐱", keywords: ["cat", "mèo", "kitten", "meo", "con mèo", "miu"] },
  { emoji: "🐶", keywords: ["dog", "chó", "puppy", "con chó", "cún"] },
  { emoji: "🐯", keywords: ["tiger", "hổ", "cọp", "con hổ", "con cọp"] },
  { emoji: "🦁", keywords: ["lion", "sư tử", "con sư tử"] },
  { emoji: "🐘", keywords: ["elephant", "voi", "con voi"] },
  { emoji: "🐵", keywords: ["monkey", "khỉ", "con khỉ"] },
  { emoji: "🐼", keywords: ["panda", "gấu trúc", "con gấu trúc"] },
  { emoji: "🐻", keywords: ["bear", "gấu", "con gấu"] },
  { emoji: "🦊", keywords: ["fox", "cáo", "con cáo", "hồ ly"] },
  { emoji: "🐰", keywords: ["rabbit", "bunny", "thỏ", "con thỏ"] },
  { emoji: "🐸", keywords: ["frog", "ếch", "con ếch"] },
  { emoji: "🐴", keywords: ["horse", "ngựa", "con ngựa"] },
  { emoji: "🦓", keywords: ["zebra", "ngựa vằn", "con ngựa vằn"] },
  { emoji: "🦒", keywords: ["giraffe", "hươu cao cổ", "con hươu"] },
  { emoji: "🐮", keywords: ["cow", "bò", "bò sữa", "con bò"] },
  { emoji: "🐷", keywords: ["pig", "heo", "lợn", "con heo", "con lợn"] },
  { emoji: "🐑", keywords: ["sheep", "cừu", "con cừu"] },
  { emoji: "🐓", keywords: ["rooster", "chicken", "gà", "gà trống", "con gà"] },
  { emoji: "🦆", keywords: ["duck", "vịt", "con vịt"] },
  { emoji: "🐧", keywords: ["penguin", "chim cánh cụt"] },
  { emoji: "🦉", keywords: ["owl", "cú mèo", "con cú"] },
  { emoji: "🦅", keywords: ["eagle", "đại bàng"] },
  { emoji: "🕊️", keywords: ["dove", "chim bồ câu", "chim"] },
  { emoji: "🐟", keywords: ["fish", "cá", "con cá"] },
  { emoji: "🐬", keywords: ["dolphin", "cá heo"] },
  { emoji: "🐳", keywords: ["whale", "cá voi"] },
  { emoji: "🦈", keywords: ["shark", "cá mập"] },
  { emoji: "🐙", keywords: ["octopus", "bạch tuộc", "con bạch tuộc"] },
  { emoji: "🦀", keywords: ["crab", "cua", "con cua"] },
  { emoji: "🐢", keywords: ["turtle", "rùa", "con rùa"] },
  { emoji: "🐍", keywords: ["snake", "rắn", "con rắn"] },
  { emoji: "🐝", keywords: ["bee", "ong", "con ong", "chú ong"] },
  { emoji: "🦋", keywords: ["butterfly", "bướm", "con bướm"] },
  { emoji: "🐜", keywords: ["ant", "kiến", "con kiến"] },
  { emoji: "🐲", keywords: ["dragon", "rồng", "con rồng"] },

  // --- Fruits & Food / Trái cây & Đồ ăn ---
  { emoji: "🍎", keywords: ["apple", "táo", "quả táo", "trái táo"] },
  { emoji: "🍌", keywords: ["banana", "chuối", "quả chuối", "trái chuối"] },
  { emoji: "🍇", keywords: ["grape", "nho", "quả nho", "chùm nho"] },
  { emoji: "🍉", keywords: ["watermelon", "dưa hấu", "quả dưa hấu"] },
  { emoji: "🍓", keywords: ["strawberry", "dâu tây", "dâu"] },
  { emoji: "🍊", keywords: ["orange", "cam", "quả cam", "trái cam"] },
  { emoji: "🍋", keywords: ["lemon", "chanh", "quả chanh"] },
  {
    emoji: "🍍",
    keywords: ["pineapple", "dứa", "thơm", "quả dứa", "trái thơm"],
  },
  { emoji: "🥭", keywords: ["mango", "xoài", "quả xoài", "trái xoài"] },
  { emoji: "🍑", keywords: ["peach", "đào", "quả đào"] },
  { emoji: "🍒", keywords: ["cherry", "anh đào", "quả anh đào"] },
  { emoji: "🥥", keywords: ["coconut", "dừa", "quả dừa"] },
  { emoji: "🥕", keywords: ["carrot", "cà rốt", "củ cà rốt"] },
  { emoji: "🌽", keywords: ["corn", "ngô", "bắp", "trái bắp", "bắp ngô"] },
  { emoji: "🍅", keywords: ["tomato", "cà chua", "quả cà chua"] },
  { emoji: "🍄", keywords: ["mushroom", "nấm", "cây nấm"] },
  { emoji: "🍞", keywords: ["bread", "bánh mì"] },
  { emoji: "🧀", keywords: ["cheese", "phô mai", "pho mát"] },
  { emoji: "🥚", keywords: ["egg", "trứng", "quả trứng"] },
  { emoji: "🍪", keywords: ["cookie", "bánh quy"] },
  { emoji: "🍦", keywords: ["ice cream", "icecream", "kem", "que kem"] },
  {
    emoji: "🍰",
    keywords: ["cake", "bánh ngọt", "bánh kem", "bánh sinh nhật"],
  },
  { emoji: "🍬", keywords: ["candy", "kẹo", "viên kẹo"] },
  { emoji: "🥛", keywords: ["milk", "sữa", "ly sữa", "bình sữa"] },
  { emoji: "🍕", keywords: ["pizza", "bánh pizza"] },
  { emoji: "🍔", keywords: ["burger", "hamburger", "bánh mì kẹp"] },

  // --- Vehicles / Phương tiện ---
  { emoji: "🚗", keywords: ["car", "ô tô", "xe hơi", "xe con"] },
  { emoji: "🚌", keywords: ["bus", "xe buýt", "xe bus"] },
  { emoji: "🚑", keywords: ["ambulance", "xe cấp cứu"] },
  { emoji: "🚒", keywords: ["fire truck", "xe cứu hỏa"] },
  { emoji: "🚓", keywords: ["police car", "xe cảnh sát"] },
  { emoji: "🚲", keywords: ["bicycle", "bike", "xe đạp"] },
  { emoji: "🛵", keywords: ["scooter", "motorcycle", "xe máy"] },
  { emoji: "✈️", keywords: ["airplane", "plane", "máy bay", "phi cơ"] },
  { emoji: "🚁", keywords: ["helicopter", "trực thăng", "máy bay trực thăng"] },
  { emoji: "🚀", keywords: ["rocket", "tên lửa", "phi thuyền", "tàu vũ trụ"] },
  { emoji: "🚂", keywords: ["train", "tàu hỏa", "xe lửa"] },
  { emoji: "🚢", keywords: ["ship", "tàu thủy", "thuyền lớn"] },
  { emoji: "⛵", keywords: ["boat", "sailboat", "thuyền", "thuyền buồm"] },

  // --- Nature & Sky / Thiên nhiên & Bầu trời ---
  { emoji: "☀️", keywords: ["sun", "mặt trời", "ông mặt trời", "ánh nắng"] },
  { emoji: "🌙", keywords: ["moon", "mặt trăng", "ông trăng"] },
  { emoji: "⭐", keywords: ["star", "ngôi sao", "sao"] },
  { emoji: "☁️", keywords: ["cloud", "mây", "đám mây"] },
  { emoji: "🌧️", keywords: ["rain", "mưa", "cơn mưa"] },
  { emoji: "🌈", keywords: ["rainbow", "cầu vồng"] },
  { emoji: "🔥", keywords: ["fire", "lửa", "ngọn lửa"] },
  { emoji: "💧", keywords: ["water", "nước", "giọt nước"] },
  { emoji: "🌳", keywords: ["tree", "cây", "cây xanh"] },
  { emoji: "🌸", keywords: ["flower", "hoa", "bông hoa"] },
  { emoji: "🍁", keywords: ["leaf", "lá", "chiếc lá"] },

  // --- Everyday Objects & School / Đồ dùng & Trường học ---
  { emoji: "📚", keywords: ["book", "sách", "cuốn sách", "vở"] },
  { emoji: "✏️", keywords: ["pencil", "pen", "bút", "bút chì", "cây bút"] },
  { emoji: "🎒", keywords: ["backpack", "bag", "cặp sách", "ba lô"] },
  { emoji: "⏰", keywords: ["clock", "đồng hồ", "báo thức"] },
  {
    emoji: "⚽",
    keywords: ["ball", "soccer", "bóng", "quả bóng", "trái banh"],
  },
  { emoji: "👑", keywords: ["crown", "vương miện"] },
  { emoji: "🎉", keywords: ["party hat", "mũ", "nón", "mũ sinh nhật"] },
  { emoji: "🕶️", keywords: ["sunglasses", "glasses", "kính râm", "kính mát"] },
];

function removeVietnameseTones(str) {
  if (!str) return "";
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase();
}

/**
 * Tự động tìm icon Emoji phù hợp nhất dựa trên từ tiếng Việt hoặc tiếng Anh
 * @param {string} vn - Từ tiếng Việt
 * @param {string} en - Từ tiếng Anh
 * @returns {string} Emoji phù hợp, hoặc '⭐' nếu không tìm thấy
 */
export function autoDetectEmoji(vn = "", en = "") {
  const cleanVN = vn.trim().toLowerCase();
  const cleanEN = en.trim().toLowerCase();
  const noToneVN = removeVietnameseTones(cleanVN);

  if (!cleanVN && !cleanEN) return "⭐";

  // 1. Tìm match chính xác hoặc từ chứa (cả có dấu và không dấu)
  for (const entry of EMOJI_DICTIONARY) {
    for (const kw of entry.keywords) {
      const cleanKW = kw.toLowerCase();
      const noToneKW = removeVietnameseTones(cleanKW);

      if (
        (cleanEN && (cleanEN === cleanKW || cleanEN.includes(cleanKW))) ||
        (cleanVN && (cleanVN === cleanKW || cleanVN.includes(cleanKW))) ||
        (noToneVN && (noToneVN === noToneKW || noToneVN.includes(noToneKW)))
      ) {
        return entry.emoji;
      }
    }
  }

  // 2. Tách từ đơn lẻ (bỏ bớt tiền tố con, quả, trái, chiếc, xe...)
  const wordsEN = cleanEN.split(/\s+/);
  const strippedVN = cleanVN.replace(
    /^(con|quả|trái|chiếc|xe|chú|bạn|cây|đồ)\s+/i,
    "",
  );
  const wordsVN = strippedVN.split(/\s+/);
  const wordsNoToneVN = removeVietnameseTones(strippedVN).split(/\s+/);

  for (const entry of EMOJI_DICTIONARY) {
    for (const kw of entry.keywords) {
      const cleanKW = kw.toLowerCase();
      const noToneKW = removeVietnameseTones(cleanKW);
      if (
        wordsEN.includes(cleanKW) ||
        wordsVN.includes(cleanKW) ||
        wordsNoToneVN.includes(noToneKW)
      ) {
        return entry.emoji;
      }
    }
  }

  return "⭐"; // Biểu tượng mặc định nếu chưa tìm thấy
}
