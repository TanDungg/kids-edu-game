// Data for Kids Educational Adventure Game

export const LANGUAGE_LEVELS = [
  {
    id: 1,
    vn: 'Mèo',
    en: 'Cat',
    emoji: '🐱',
    theme: 'Động vật',
    color: '#f472b6',
    letters: ['M', 'È', 'O', 'C', 'A', 'T'],
    targetVN: 'MÈO',
    targetEN: 'CAT',
    hintVN: 'Bé cưng kêu meo meo rất thích bắt chuột!',
    hintEN: 'A cute furry friend that says meow!'
  },
  {
    id: 2,
    vn: 'Chó',
    en: 'Dog',
    emoji: '🐶',
    theme: 'Động vật',
    color: '#fbbf24',
    letters: ['C', 'H', 'Ó', 'D', 'O', 'G'],
    targetVN: 'CHÓ',
    targetEN: 'DOG',
    hintVN: 'Bạn bốn chân trung thành sủa gâu gâu!',
    hintEN: 'Man\'s best friend that barks woof woof!'
  },
  {
    id: 3,
    vn: 'Táo',
    en: 'Apple',
    emoji: '🍎',
    theme: 'Trái cây',
    color: '#ef4444',
    letters: ['T', 'Á', 'O', 'A', 'P', 'P', 'L', 'E'],
    targetVN: 'TÁO',
    targetEN: 'APPLE',
    hintVN: 'Trái cây giòn ngọt màu đỏ thơm ngon!',
    hintEN: 'A sweet red crispy fruit!'
  },
  {
    id: 4,
    vn: 'Cá',
    en: 'Fish',
    emoji: '🐟',
    theme: 'Động vật',
    color: '#38bdf8',
    letters: ['C', 'Á', 'F', 'I', 'S', 'H'],
    targetVN: 'CÁ',
    targetEN: 'FISH',
    hintVN: 'Bơi lội dưới làn nước trong xanh!',
    hintEN: 'Swims happily in the blue water!'
  },
  {
    id: 5,
    vn: 'Mặt trời',
    en: 'Sun',
    emoji: '☀️',
    theme: 'Thiên nhiên',
    color: '#f59e0b',
    letters: ['M', 'Ặ', 'T', 'T', 'R', 'Ờ', 'I', 'S', 'U', 'N'],
    targetVN: 'MẶT TRỜI',
    targetEN: 'SUN',
    hintVN: 'Tỏa ánh nắng ấm áp chiếu sáng ban ngày!',
    hintEN: 'Shines bright and warm in the sky!'
  },
  {
    id: 6,
    vn: 'Ngôi sao',
    en: 'Star',
    emoji: '⭐',
    theme: 'Thiên nhiên',
    color: '#eab308',
    letters: ['S', 'A', 'O', 'S', 'T', 'A', 'R'],
    targetVN: 'SAO',
    targetEN: 'STAR',
    hintVN: 'Lấp lánh trên bầu trời đêm kỳ diệu!',
    hintEN: 'Twinkles in the magical night sky!'
  }
];

export const MATH_LEVELS = [
  {
    id: 1,
    type: 'count',
    title: 'Đếm Số Trái Cây',
    promptVN: 'Bé hãy chạm vào từng quả dâu tây để đếm nhé!',
    promptEN: 'Tap each strawberry to count them!',
    itemEmoji: '🍓',
    targetCount: 4,
    options: [2, 3, 4, 5],
    answer: 4
  },
  {
    id: 2,
    type: 'count',
    title: 'Đếm Số Chú Ong',
    promptVN: 'Có bao nhiêu chú ong chăm chỉ đang bay?',
    promptEN: 'How many busy bees are buzzing around?',
    itemEmoji: '🐝',
    targetCount: 5,
    options: [4, 5, 6, 7],
    answer: 5
  },
  {
    id: 3,
    type: 'addition',
    title: 'Phép Cộng Vui Nhộn',
    promptVN: '3 quả chuối thêm 2 quả chuối là mấy quả?',
    promptEN: 'What is 3 bananas plus 2 bananas?',
    num1: 3,
    num2: 2,
    itemEmoji: '🍌',
    options: [4, 5, 6],
    answer: 5
  },
  {
    id: 4,
    type: 'addition',
    title: 'Kẹo Ngọt Cho Bé',
    promptVN: '4 viên kẹo thêm 3 viên kẹo là mấy viên kẹo?',
    promptEN: '4 candies plus 3 candies equals?',
    num1: 4,
    num2: 3,
    itemEmoji: '🍬',
    options: [6, 7, 8],
    answer: 7
  },
  {
    id: 5,
    type: 'compare',
    title: 'So Sánh Lớn - Nhỏ',
    promptVN: 'Bên nào có NHIỀU nấm hơn?',
    promptEN: 'Which side has MORE mushrooms?',
    sideA: { count: 3, emoji: '🍄' },
    sideB: { count: 6, emoji: '🍄' },
    options: ['Bên Trái (3)', 'Bên Phải (6)'],
    answer: 'Bên Phải (6)'
  }
];

export const LOGIC_LEVELS = [
  {
    id: 1,
    type: 'pattern',
    title: 'Quy Luật Màu Sắc',
    promptVN: 'Hình tiếp theo trong chuỗi là hình gì nhỉ?',
    promptEN: 'What shape comes next in the pattern?',
    sequence: ['🔴', '🟡', '🔴', '🟡', '🔴'],
    options: ['🟡', '🔴', '🟢', '🔵'],
    answer: '🟡',
    hint: 'Quy luật lặp lại: Đỏ rồi đến Vàng...'
  },
  {
    id: 2,
    type: 'pattern',
    title: 'Quy Luật Trái Cây',
    promptVN: 'Quả tiếp theo là quả gì bé ơi?',
    promptEN: 'Which fruit completes the sequence?',
    sequence: ['🍎', '🍏', '🍎', '🍏'],
    options: ['🍎', '🍌', '🍇', '🍉'],
    answer: '🍎',
    hint: 'Táo đỏ rồi đến táo xanh...'
  },
  {
    id: 3,
    type: 'odd_one_out',
    title: 'Tìm Đồ Vật Khác Biệt',
    promptVN: 'Bạn nào KHÔNG PHẢI là loài bay trên trời?',
    promptEN: 'Which one CANNOT fly in the sky?',
    items: [
      { emoji: '🕊️', name: 'Chim bồ câu', isOdd: false },
      { emoji: '🦋', name: 'Bướm xinh', isOdd: false },
      { emoji: '🐙', name: 'Bạch tuộc', isOdd: true },
      { emoji: '🐝', name: 'Chú ong', isOdd: false }
    ],
    answer: '🐙'
  },
  {
    id: 4,
    type: 'size_order',
    title: 'Sắp Xếp Từ Nhỏ Đến Lớn',
    promptVN: 'Chọn con vật TO NHẤT trong các bạn dưới đây?',
    promptEN: 'Who is the BIGGEST animal?',
    items: [
      { emoji: '🐜', name: 'Kiến nhỏ', size: 1 },
      { emoji: '🐰', name: 'Thỏ con', size: 2 },
      { emoji: '🐘', name: 'Voi khổng lồ', size: 3 }
    ],
    answer: '🐘'
  }
];

export const PET_SHOP_ITEMS = [
  { id: 'cookie', name: 'Bánh Quy Ngọt', type: 'food', emoji: '🍪', price: 10, hungerBoost: 25 },
  { id: 'icecream', name: 'Kem Cầu Vồng', type: 'food', emoji: '🍦', price: 15, hungerBoost: 35 },
  { id: 'milk', name: 'Bình Sữa Bò', type: 'food', emoji: '🍼', price: 8, hungerBoost: 20 },
  { id: 'party_hat', name: 'Mũ Sinh Nhật', type: 'hat', emoji: '🎉', price: 30 },
  { id: 'crown', name: 'Vương Miện Vàng', type: 'hat', emoji: '👑', price: 50 },
  { id: 'sunglasses', name: 'Kính Mát Siêu Ngầu', type: 'hat', emoji: '🕶️', price: 25 }
];

export const INITIAL_PETS = [
  { id: 'cat', name: 'Bé Miu Miu', emoji: '🐱', sound: 'Meo meo~', hunger: 80, happiness: 90 },
  { id: 'dog', name: 'Chú Cún Lu', emoji: '🐶', sound: 'Gâu gâu!', hunger: 70, happiness: 85 },
  { id: 'dragon', name: 'Rồng Con Lửa', emoji: '🐲', sound: 'Rooaar!', hunger: 60, happiness: 75 }
];
