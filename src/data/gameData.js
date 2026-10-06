// Data for Kids Educational Adventure Game
// Comprehensive, Rich Default Library for Kids Edu Game

export const LANGUAGE_LEVELS = [
  // --- Động vật (Animals) ---
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
    hintEN: "Man's best friend that barks woof woof!"
  },
  {
    id: 3,
    vn: 'Cá',
    en: 'Fish',
    emoji: '🐟',
    theme: 'Động vật',
    color: '#38bdf8',
    letters: ['C', 'Á', 'F', 'I', 'S', 'H'],
    targetVN: 'CÁ',
    targetEN: 'FISH',
    hintVN: 'Bơi lội tung tăng dưới làn nước trong xanh!',
    hintEN: 'Swims happily in the blue water!'
  },
  {
    id: 4,
    vn: 'Voi',
    en: 'Elephant',
    emoji: '🐘',
    theme: 'Động vật',
    color: '#94a3b8',
    letters: ['V', 'O', 'I', 'E', 'L', 'P', 'H', 'N', 'T'],
    targetVN: 'VOI',
    targetEN: 'ELEPHANT',
    hintVN: 'Có đôi tai to như cái quạt và chiếc vòi dài!',
    hintEN: 'A giant gentle animal with a long trunk!'
  },
  {
    id: 5,
    vn: 'Hổ',
    en: 'Tiger',
    emoji: '🐯',
    theme: 'Động vật',
    color: '#ea580c',
    letters: ['H', 'Ổ', 'T', 'I', 'G', 'E', 'R'],
    targetVN: 'HỔ',
    targetEN: 'TIGER',
    hintVN: 'Chúa sơn lâm dũng mãnh có bộ lông vằn cam đen!',
    hintEN: 'The mighty king of the jungle with stripes!'
  },
  {
    id: 6,
    vn: 'Khỉ',
    en: 'Monkey',
    emoji: '🐒',
    theme: 'Động vật',
    color: '#d97706',
    letters: ['K', 'H', 'Ỉ', 'M', 'O', 'N', 'K', 'E', 'Y'],
    targetVN: 'KHỈ',
    targetEN: 'MONKEY',
    hintVN: 'Rất thích ăn chuối và leo trèo thoăn thoắt!',
    hintEN: 'Loves bananas and swinging on tree branches!'
  },
  {
    id: 7,
    vn: 'Thỏ',
    en: 'Rabbit',
    emoji: '🐰',
    theme: 'Động vật',
    color: '#f472b6',
    letters: ['T', 'H', 'Ỏ', 'R', 'A', 'B', 'I', 'T'],
    targetVN: 'THỎ',
    targetEN: 'RABBIT',
    hintVN: 'Có đôi tai dài dựng đứng và thích ăn cà rốt!',
    hintEN: 'Has long ears and loves crunching carrots!'
  },
  {
    id: 8,
    vn: 'Gấu',
    en: 'Bear',
    emoji: '🐻',
    theme: 'Động vật',
    color: '#78350f',
    letters: ['G', 'Ấ', 'U', 'B', 'E', 'A', 'R'],
    targetVN: 'GẤU',
    targetEN: 'BEAR',
    hintVN: 'Bạn lông xù to lớn rất mê mật ong ngọt ngào!',
    hintEN: 'A big furry friend that adores sweet honey!'
  },
  {
    id: 9,
    vn: 'Ngựa',
    en: 'Horse',
    emoji: '🐴',
    theme: 'Động vật',
    color: '#ca8a04',
    letters: ['N', 'G', 'Ự', 'A', 'H', 'O', 'R', 'S', 'E'],
    targetVN: 'NGỰA',
    targetEN: 'HORSE',
    hintVN: 'Chạy phi nước đại phi thường trên thảo nguyên xanh!',
    hintEN: 'Gallops fast across the green meadow!'
  },
  {
    id: 10,
    vn: 'Sư tử',
    en: 'Lion',
    emoji: '🦁',
    theme: 'Động vật',
    color: '#eab308',
    letters: ['S', 'Ư', 'T', 'Ử', 'L', 'I', 'O', 'N'],
    targetVN: 'SƯ TỬ',
    targetEN: 'LION',
    hintVN: 'Vị vua rừng rậm với chiếc bờm vàng oai vệ!',
    hintEN: 'The king of beasts with a majestic golden mane!'
  },
  {
    id: 11,
    vn: 'Gà',
    en: 'Chicken',
    emoji: '🐔',
    theme: 'Động vật',
    color: '#dc2626',
    letters: ['G', 'À', 'C', 'H', 'I', 'K', 'E', 'N'],
    targetVN: 'GÀ',
    targetEN: 'CHICKEN',
    hintVN: 'Gáy ò ó o gọi mặt trời thức giấc mỗi sớm mai!',
    hintEN: 'Wakes up early and crows cock-a-doodle-doo!'
  },
  {
    id: 12,
    vn: 'Vịt',
    en: 'Duck',
    emoji: '🦆',
    theme: 'Động vật',
    color: '#16a34a',
    letters: ['V', 'Ị', 'T', 'D', 'U', 'C', 'K'],
    targetVN: 'VỊT',
    targetEN: 'DUCK',
    hintVN: 'Kêu cạp cạp và bơi lội vui vẻ dưới hồ nước!',
    hintEN: 'Quacks quack-quack and paddles in the pond!'
  },
  {
    id: 13,
    vn: 'Heo',
    en: 'Pig',
    emoji: '🐷',
    theme: 'Động vật',
    color: '#f472b6',
    letters: ['H', 'E', 'O', 'P', 'I', 'G'],
    targetVN: 'HEO',
    targetEN: 'PIG',
    hintVN: 'Bụng tròn ủn ỉn, mũi hồng hào đáng yêu!',
    hintEN: 'A cute pink buddy with a curly little tail!'
  },
  {
    id: 14,
    vn: 'Bò',
    en: 'Cow',
    emoji: '🐮',
    theme: 'Động vật',
    color: '#475569',
    letters: ['B', 'Ò', 'C', 'O', 'W'],
    targetVN: 'BÒ',
    targetEN: 'COW',
    hintVN: 'Cho bé dòng sữa tươi thơm lành bổ dưỡng!',
    hintEN: 'Gives sweet healthy fresh milk and says moo!'
  },
  {
    id: 15,
    vn: 'Cá heo',
    en: 'Dolphin',
    emoji: '🐬',
    theme: 'Động vật',
    color: '#0284c7',
    letters: ['C', 'Á', 'H', 'E', 'O', 'D', 'O', 'L', 'P', 'H', 'I', 'N'],
    targetVN: 'CÁ HEO',
    targetEN: 'DOLPHIN',
    hintVN: 'Bạn biển thông minh thích nhảy múa trên mặt sóng!',
    hintEN: 'A smart ocean friend leaping through the waves!'
  },
  {
    id: 16,
    vn: 'Rùa',
    en: 'Turtle',
    emoji: '🐢',
    theme: 'Động vật',
    color: '#15803d',
    letters: ['R', 'Ù', 'A', 'T', 'U', 'R', 'T', 'L', 'E'],
    targetVN: 'RÙA',
    targetEN: 'TURTLE',
    hintVN: 'Mang chiếc mai cứng cáp trên lưng và đi chậm rãi!',
    hintEN: 'Carries a strong shell home and moves slowly!'
  },
  {
    id: 17,
    vn: 'Ong',
    en: 'Bee',
    emoji: '🐝',
    theme: 'Động vật',
    color: '#ca8a04',
    letters: ['O', 'N', 'G', 'B', 'E', 'E'],
    targetVN: 'ONG',
    targetEN: 'BEE',
    hintVN: 'Bay lượn vo ve chăm chỉ hút mật hoa thơm!',
    hintEN: 'Buzzes around making sweet delicious honey!'
  },
  {
    id: 18,
    vn: 'Bướm',
    en: 'Butterfly',
    emoji: '🦋',
    theme: 'Động vật',
    color: '#8b5cf6',
    letters: ['B', 'Ư', 'Ớ', 'M', 'B', 'U', 'T', 'E', 'R', 'F', 'L', 'Y'],
    targetVN: 'BƯỚM',
    targetEN: 'BUTTERFLY',
    hintVN: 'Đôi cánh rực rỡ sắc màu bay lượn trong vườn hoa!',
    hintEN: 'Flutters colorful wings gracefully over flowers!'
  },
  {
    id: 19,
    vn: 'Cánh cụt',
    en: 'Penguin',
    emoji: '🐧',
    theme: 'Động vật',
    color: '#0f172a',
    letters: ['C', 'Á', 'N', 'H', 'C', 'Ụ', 'T', 'P', 'E', 'N', 'G', 'U', 'I', 'N'],
    targetVN: 'CÁNH CỤT',
    targetEN: 'PENGUIN',
    hintVN: 'Sống ở vùng băng tuyết giá lạnh, đi lạch bạch!',
    hintEN: 'Waddles cutely on the cold antarctic ice!'
  },

  // --- Trái cây & Rau củ (Fruits & Vegetables) ---
  {
    id: 20,
    vn: 'Táo',
    en: 'Apple',
    emoji: '🍎',
    theme: 'Trái cây',
    color: '#ef4444',
    letters: ['T', 'Á', 'O', 'A', 'P', 'P', 'L', 'E'],
    targetVN: 'TÁO',
    targetEN: 'APPLE',
    hintVN: 'Trái cây giòn ngọt màu đỏ thơm ngon!',
    hintEN: 'A sweet red crispy fruit that keeps doctors away!'
  },
  {
    id: 21,
    vn: 'Chuối',
    en: 'Banana',
    emoji: '🍌',
    theme: 'Trái cây',
    color: '#eab308',
    letters: ['C', 'H', 'U', 'Ố', 'I', 'B', 'A', 'N', 'A'],
    targetVN: 'CHUỐI',
    targetEN: 'BANANA',
    hintVN: 'Vỏ màu vàng cong cong, thơm bùi ngọt dịu!',
    hintEN: 'A curved yellow sweet fruit loved by monkeys!'
  },
  {
    id: 22,
    vn: 'Cam',
    en: 'Orange',
    emoji: '🍊',
    theme: 'Trái cây',
    color: '#f97316',
    letters: ['C', 'A', 'M', 'O', 'R', 'A', 'N', 'G', 'E'],
    targetVN: 'CAM',
    targetEN: 'ORANGE',
    hintVN: 'Tròn xoe mọng nước, giàu vitamin C cho bé khỏe!',
    hintEN: 'Juicy round fruit loaded with healthy vitamin C!'
  },
  {
    id: 23,
    vn: 'Dưa hấu',
    en: 'Watermelon',
    emoji: '🍉',
    theme: 'Trái cây',
    color: '#10b981',
    letters: ['D', 'Ư', 'A', 'H', 'Ấ', 'U', 'W', 'A', 'T', 'E', 'R', 'M', 'L', 'O', 'N'],
    targetVN: 'DƯA HẤU',
    targetEN: 'WATERMELON',
    hintVN: 'Vỏ xanh ruột đỏ mát lạnh giải khát ngày hè!',
    hintEN: 'Green on the outside, red and sweet inside!'
  },
  {
    id: 24,
    vn: 'Dâu tây',
    en: 'Strawberry',
    emoji: '🍓',
    theme: 'Trái cây',
    color: '#f43f5e',
    letters: ['D', 'Â', 'U', 'T', 'Â', 'Y', 'S', 'T', 'R', 'A', 'W', 'B', 'E', 'R', 'Y'],
    targetVN: 'DÂU TÂY',
    targetEN: 'STRAWBERRY',
    hintVN: 'Quả tim nhỏ màu đỏ rực lấm tấm hạt xinh xắn!',
    hintEN: 'A lovely red berry with tiny seeds on its skin!'
  },
  {
    id: 25,
    vn: 'Nho',
    en: 'Grape',
    emoji: '🍇',
    theme: 'Trái cây',
    color: '#8b5cf6',
    letters: ['N', 'H', 'O', 'G', 'R', 'A', 'P', 'E'],
    targetVN: 'NHO',
    targetEN: 'GRAPE',
    hintVN: 'Từng chùm quả tròn màu tím ngọt ngào mọng nước!',
    hintEN: 'Clusters of juicy purple or green round berries!'
  },
  {
    id: 26,
    vn: 'Xoài',
    en: 'Mango',
    emoji: '🥭',
    theme: 'Trái cây',
    color: '#f59e0b',
    letters: ['X', 'O', 'À', 'I', 'M', 'A', 'N', 'G', 'O'],
    targetVN: 'XOÀI',
    targetEN: 'MANGO',
    hintVN: 'Vua của các loại quả nhiệt đới vàng ươm ngọt lịm!',
    hintEN: 'A tropical sweet and fragrant golden fruit!'
  },
  {
    id: 27,
    vn: 'Cà rốt',
    en: 'Carrot',
    emoji: '🥕',
    theme: 'Rau củ',
    color: '#f97316',
    letters: ['C', 'À', 'R', 'Ố', 'T', 'C', 'A', 'R', 'O', 'T'],
    targetVN: 'CÀ RỐT',
    targetEN: 'CARROT',
    hintVN: 'Củ dài màu cam tươi sáng, bạn thỏ thích mê!',
    hintEN: 'Crunchy orange root vegetable that rabbits love!'
  },
  {
    id: 28,
    vn: 'Bắp ngô',
    en: 'Corn',
    emoji: '🌽',
    theme: 'Rau củ',
    color: '#eab308',
    letters: ['B', 'Ắ', 'P', 'N', 'G', 'Ô', 'C', 'O', 'R', 'N'],
    targetVN: 'BẮP NGÔ',
    targetEN: 'CORN',
    hintVN: 'Hạt vàng óng ả xếp đều tăm tắp, luộc thơm lừng!',
    hintEN: 'Rows of golden sweet kernels on a cob!'
  },
  {
    id: 29,
    vn: 'Cà chua',
    en: 'Tomato',
    emoji: '🍅',
    theme: 'Rau củ',
    color: '#ef4444',
    letters: ['C', 'À', 'C', 'H', 'U', 'A', 'T', 'O', 'M', 'A', 'T', 'O'],
    targetVN: 'CÀ CHUA',
    targetEN: 'TOMATO',
    hintVN: 'Quả tròn màu đỏ tươi giúp bé sáng mắt!',
    hintEN: 'A bright red round vegetable delicious in salads!'
  },

  // --- Phương tiện giao thông (Vehicles) ---
  {
    id: 30,
    vn: 'Máy bay',
    en: 'Airplane',
    emoji: '✈️',
    theme: 'Phương tiện',
    color: '#0284c7',
    letters: ['M', 'Á', 'Y', 'B', 'A', 'Y', 'A', 'I', 'R', 'P', 'L', 'N', 'E'],
    targetVN: 'MÁY BAY',
    targetEN: 'AIRPLANE',
    hintVN: 'Dang rộng đôi cánh bay vút lượn trên mây xanh!',
    hintEN: 'Soars high in the blue sky carrying passengers!'
  },
  {
    id: 31,
    vn: 'Ô tô',
    en: 'Car',
    emoji: '🚗',
    theme: 'Phương tiện',
    color: '#dc2626',
    letters: ['Ô', 'T', 'Ô', 'C', 'A', 'R'],
    targetVN: 'Ô TÔ',
    targetEN: 'CAR',
    hintVN: 'Chạy bon bon trên 4 bánh xe chở cả gia đình!',
    hintEN: 'Vrooms down the road on four rolling wheels!'
  },
  {
    id: 32,
    vn: 'Xe buýt',
    en: 'Bus',
    emoji: '🚌',
    theme: 'Phương tiện',
    color: '#facc15',
    letters: ['X', 'E', 'B', 'U', 'Ý', 'T', 'B', 'U', 'S'],
    targetVN: 'XE BUÝT',
    targetEN: 'BUS',
    hintVN: 'Xe to dài đón nhiều bạn nhỏ đến trường mỗi ngày!',
    hintEN: 'A big friendly yellow vehicle carrying kids to school!'
  },
  {
    id: 33,
    vn: 'Tàu hỏa',
    en: 'Train',
    emoji: '🚂',
    theme: 'Phương tiện',
    color: '#334155',
    letters: ['T', 'À', 'U', 'H', 'Ỏ', 'A', 'T', 'R', 'A', 'I', 'N'],
    targetVN: 'TÀU HỎA',
    targetEN: 'TRAIN',
    hintVN: 'Chạy xình xịch tu tu trên đường ray dài dằng dặc!',
    hintEN: 'Choo-choos along metal tracks across mountains!'
  },
  {
    id: 34,
    vn: 'Tên lửa',
    en: 'Rocket',
    emoji: '🚀',
    theme: 'Phương tiện',
    color: '#9333ea',
    letters: ['T', 'Ê', 'N', 'L', 'Ử', 'A', 'R', 'O', 'C', 'K', 'E', 'T'],
    targetVN: 'TÊN LỬA',
    targetEN: 'ROCKET',
    hintVN: 'Phun lửa cực mạnh phóng vút vào vũ trụ bao la!',
    hintEN: 'Blasts off with fiery power straight into space!'
  },
  {
    id: 35,
    vn: 'Xe đạp',
    en: 'Bicycle',
    emoji: '🚲',
    theme: 'Phương tiện',
    color: '#059669',
    letters: ['X', 'E', 'Đ', 'Ạ', 'P', 'B', 'I', 'K', 'E', 'C', 'L'],
    targetVN: 'XE ĐẠP',
    targetEN: 'BICYCLE',
    hintVN: 'Dùng hai bàn chân đạp đều để xe lăn bánh!',
    hintEN: 'Two pedals and two wheels for a fun breezy ride!'
  },
  {
    id: 36,
    vn: 'Tàu thủy',
    en: 'Ship',
    emoji: '🚢',
    theme: 'Phương tiện',
    color: '#2563eb',
    letters: ['T', 'À', 'U', 'T', 'H', 'Ủ', 'Y', 'S', 'H', 'I', 'P'],
    targetVN: 'TÀU THỦY',
    targetEN: 'SHIP',
    hintVN: 'Chiếc tàu khổng lồ rẽ sóng vượt đại dương bao la!',
    hintEN: 'A massive boat sailing across deep blue oceans!'
  },

  // --- Thiên nhiên & Bầu trời (Nature & Sky) ---
  {
    id: 37,
    vn: 'Mặt trời',
    en: 'Sun',
    emoji: '☀️',
    theme: 'Thiên nhiên',
    color: '#f59e0b',
    letters: ['M', 'Ặ', 'T', 'T', 'R', 'Ờ', 'I', 'S', 'U', 'N'],
    targetVN: 'MẶT TRỜI',
    targetEN: 'SUN',
    hintVN: 'Tỏa ánh nắng ấm áp chiếu sáng ban ngày!',
    hintEN: 'Shines bright and warm in the daytime sky!'
  },
  {
    id: 38,
    vn: 'Mặt trăng',
    en: 'Moon',
    emoji: '🌙',
    theme: 'Thiên nhiên',
    color: '#eab308',
    letters: ['M', 'Ặ', 'T', 'T', 'R', 'Ă', 'N', 'G', 'M', 'O', 'N'],
    targetVN: 'MẶT TRĂNG',
    targetEN: 'MOON',
    hintVN: 'Sáng dịu dàng soi sáng màn đêm cùng ngàn vì sao!',
    hintEN: 'Glows gently in the starry night sky!'
  },
  {
    id: 39,
    vn: 'Ngôi sao',
    en: 'Star',
    emoji: '⭐',
    theme: 'Thiên nhiên',
    color: '#facc15',
    letters: ['S', 'A', 'O', 'S', 'T', 'A', 'R'],
    targetVN: 'SAO',
    targetEN: 'STAR',
    hintVN: 'Lấp lánh lấp lánh như viên kim cương trên trời cao!',
    hintEN: 'Twinkles like a tiny diamond high in the sky!'
  },
  {
    id: 40,
    vn: 'Cầu vồng',
    en: 'Rainbow',
    emoji: '🌈',
    theme: 'Thiên nhiên',
    color: '#ec4899',
    letters: ['C', 'Ầ', 'U', 'V', 'Ồ', 'N', 'G', 'R', 'A', 'I', 'N', 'B', 'O', 'W'],
    targetVN: 'CẦU VỒNG',
    targetEN: 'RAINBOW',
    hintVN: 'Dải màu 7 sắc rực rỡ xuất hiện sau cơn mưa rào!',
    hintEN: 'Seven beautiful colorful arches after the rain!'
  },
  {
    id: 41,
    vn: 'Đám mây',
    en: 'Cloud',
    emoji: '☁️',
    theme: 'Thiên nhiên',
    color: '#38bdf8',
    letters: ['Đ', 'Á', 'M', 'M', 'Â', 'Y', 'C', 'L', 'O', 'U', 'D'],
    targetVN: 'ĐÁM MÂY',
    targetEN: 'CLOUD',
    hintVN: 'Bồng bềnh trắng như kẹo bông trôi trên trời cao!',
    hintEN: 'Fluffy white cotton balls floating in the air!'
  },
  {
    id: 42,
    vn: 'Bông hoa',
    en: 'Flower',
    emoji: '🌸',
    theme: 'Thiên nhiên',
    color: '#f472b6',
    letters: ['B', 'Ô', 'N', 'G', 'H', 'O', 'A', 'F', 'L', 'O', 'W', 'E', 'R'],
    targetVN: 'BÔNG HOA',
    targetEN: 'FLOWER',
    hintVN: 'Nở rộ thơm ngát đón ong bướm bay về thưởng thức!',
    hintEN: 'Blooms beautifully in gardens with sweet scent!'
  },

  // --- Đồ ăn & Thức uống (Food & Drinks) ---
  {
    id: 43,
    vn: 'Bánh mì',
    en: 'Bread',
    emoji: '🍞',
    theme: 'Đồ ăn',
    color: '#d97706',
    letters: ['B', 'Á', 'N', 'H', 'M', 'Ì', 'B', 'R', 'E', 'A', 'D'],
    targetVN: 'BÁNH MÌ',
    targetEN: 'BREAD',
    hintVN: 'Bánh nướng vàng giòn thơm phức cho bữa sáng!',
    hintEN: 'Golden crispy baked loaf perfect for breakfast!'
  },
  {
    id: 44,
    vn: 'Kem',
    en: 'Ice cream',
    emoji: '🍦',
    theme: 'Đồ ăn',
    color: '#fb7185',
    letters: ['K', 'E', 'M', 'I', 'C', 'E', 'C', 'R', 'A', 'M'],
    targetVN: 'KEM',
    targetEN: 'ICE CREAM',
    hintVN: 'Mát lạnh ngọt ngào làm bé tan biến cơn nóng!',
    hintEN: 'A sweet cold delicious dessert on a sunny day!'
  },
  {
    id: 45,
    vn: 'Sữa tươi',
    en: 'Milk',
    emoji: '🥛',
    theme: 'Đồ ăn',
    color: '#0284c7',
    letters: ['S', 'Ữ', 'A', 'M', 'I', 'L', 'K'],
    targetVN: 'SỮA',
    targetEN: 'MILK',
    hintVN: 'Màu trắng ngà, uống mỗi ngày giúp bé cao lớn!',
    hintEN: 'Healthy creamy white drink that builds strong bones!'
  },
  {
    id: 46,
    vn: 'Pizza',
    en: 'Pizza',
    emoji: '🍕',
    theme: 'Đồ ăn',
    color: '#ea580c',
    letters: ['P', 'I', 'Z', 'Z', 'A'],
    targetVN: 'PIZZA',
    targetEN: 'PIZZA',
    hintVN: 'Bánh tròn nướng phủ đầy phô mai béo ngậy!',
    hintEN: 'Cheesy round pie baked with yummy toppings!'
  },

  // --- Đồ vật & Học tập (Objects & School) ---
  {
    id: 47,
    vn: 'Sách',
    en: 'Book',
    emoji: '📚',
    theme: 'Đồ vật',
    color: '#3b82f6',
    letters: ['S', 'Á', 'C', 'H', 'B', 'O', 'O', 'K'],
    targetVN: 'SÁCH',
    targetEN: 'BOOK',
    hintVN: 'Chứa đựng ngàn câu chuyện cổ tích và tri thức kỳ diệu!',
    hintEN: 'Pages of wonderful stories and knowledge!'
  },
  {
    id: 48,
    vn: 'Bút',
    en: 'Pen',
    emoji: '✏️',
    theme: 'Đồ vật',
    color: '#eab308',
    letters: ['B', 'Ú', 'T', 'P', 'E', 'N'],
    targetVN: 'BÚT',
    targetEN: 'PEN',
    hintVN: 'Giúp bé viết chữ đẹp và vẽ những bức tranh rực rỡ!',
    hintEN: 'Used for writing neat letters and drawing pictures!'
  },
  {
    id: 49,
    vn: 'Đồng hồ',
    en: 'Clock',
    emoji: '⏰',
    theme: 'Đồ vật',
    color: '#dc2626',
    letters: ['Đ', 'Ồ', 'N', 'G', 'H', 'Ồ', 'C', 'L', 'O', 'C', 'K'],
    targetVN: 'ĐỒNG HỒ',
    targetEN: 'CLOCK',
    hintVN: 'Kêu tích tắc nhắc nhở bé dậy đúng giờ đi học!',
    hintEN: 'Ticks and tocks telling the exact time all day!'
  },
  {
    id: 50,
    vn: 'Bóng',
    en: 'Ball',
    emoji: '⚽',
    theme: 'Đồ chơi',
    color: '#1e293b',
    letters: ['B', 'Ó', 'N', 'G', 'B', 'A', 'L', 'L'],
    targetVN: 'BÓNG',
    targetEN: 'BALL',
    hintVN: 'Quả tròn lăn lông lốc để bé đá vui cùng bạn bè!',
    hintEN: 'A round bouncy toy to kick, throw and catch!'
  }
];

export const MATH_LEVELS = [
  // --- Nhóm 1: Đếm số lượng trực quan (Counting 1 to 10) ---
  {
    id: 1,
    type: 'count',
    title: 'Đếm Dâu Tây',
    promptVN: 'Bé hãy chạm vào từng quả dâu tây đỏ mọng để đếm nhé!',
    promptEN: 'Tap each juicy strawberry to count them!',
    itemEmoji: '🍓',
    targetCount: 3,
    options: [2, 3, 4, 5],
    answer: 3
  },
  {
    id: 2,
    type: 'count',
    title: 'Đếm Chú Ong',
    promptVN: 'Có bao nhiêu chú ong chăm chỉ đang bay tìm mật?',
    promptEN: 'How many busy bees are buzzing around?',
    itemEmoji: '🐝',
    targetCount: 5,
    options: [3, 4, 5, 6],
    answer: 5
  },
  {
    id: 3,
    type: 'count',
    title: 'Đếm Quả Táo Đỏ',
    promptVN: 'Bé đếm xem trên cây có bao nhiêu quả táo giòn ngon nào?',
    promptEN: 'Count the sweet red apples on the tree!',
    itemEmoji: '🍎',
    targetCount: 4,
    options: [3, 4, 5, 6],
    answer: 4
  },
  {
    id: 4,
    type: 'count',
    title: 'Đếm Vịt Vàng Bơi Lội',
    promptVN: 'Có mấy chú vịt con màu vàng đang bơi dưới ao?',
    promptEN: 'How many yellow ducklings are swimming in the pond?',
    itemEmoji: '🦆',
    targetCount: 6,
    options: [4, 5, 6, 7],
    answer: 6
  },
  {
    id: 5,
    type: 'count',
    title: 'Đếm Ngôi Sao Lấp Lánh',
    promptVN: 'Bé đếm xem bầu trời đêm có mấy ngôi sao sáng lấp lánh?',
    promptEN: 'Count the bright twinkling stars in the sky!',
    itemEmoji: '⭐',
    targetCount: 7,
    options: [5, 6, 7, 8],
    answer: 7
  },
  {
    id: 6,
    type: 'count',
    title: 'Đếm Cà Rốt Của Thỏ',
    promptVN: 'Bạn thỏ thu hoạch được bao nhiêu củ cà rốt ngon lành?',
    promptEN: 'How many crunchy carrots did bunny harvest?',
    itemEmoji: '🥕',
    targetCount: 8,
    options: [6, 7, 8, 9],
    answer: 8
  },
  {
    id: 7,
    type: 'count',
    title: 'Đếm Nấm Rừng',
    promptVN: 'Bé đếm xem trong rừng có bao nhiêu cây nấm đốm đỏ?',
    promptEN: 'Count the red mushrooms growing in the forest!',
    itemEmoji: '🍄',
    targetCount: 2,
    options: [1, 2, 3, 4],
    answer: 2
  },

  // --- Nhóm 2: Phép cộng kẹo ngọt & trái cây (Addition) ---
  {
    id: 8,
    type: 'addition',
    title: 'Phép Cộng Quả Chuối',
    promptVN: '2 quả chuối thêm 1 quả chuối là tất cả mấy quả?',
    promptEN: '2 bananas plus 1 banana equals how many?',
    num1: 2,
    num2: 1,
    itemEmoji: '🍌',
    options: [2, 3, 4],
    answer: 3
  },
  {
    id: 9,
    type: 'addition',
    title: 'Phép Cộng Cam Mọng Nước',
    promptVN: '3 quả cam thêm 2 quả cam là có mấy quả?',
    promptEN: '3 oranges plus 2 oranges equals?',
    num1: 3,
    num2: 2,
    itemEmoji: '🍊',
    options: [4, 5, 6],
    answer: 5
  },
  {
    id: 10,
    type: 'addition',
    title: 'Kẹo Ngọt Cho Bé',
    promptVN: '4 viên kẹo thêm 3 viên kẹo là mấy viên kẹo?',
    promptEN: '4 candies plus 3 candies equals how many?',
    num1: 4,
    num2: 3,
    itemEmoji: '🍬',
    options: [6, 7, 8],
    answer: 7
  },
  {
    id: 11,
    type: 'addition',
    title: 'Táo Giòn Của Mẹ',
    promptVN: '5 quả táo thêm 3 quả táo là có tất cả mấy quả?',
    promptEN: '5 apples plus 3 apples equals?',
    num1: 5,
    num2: 3,
    itemEmoji: '🍎',
    options: [7, 8, 9],
    answer: 8
  },
  {
    id: 12,
    type: 'addition',
    title: 'Kem Cầu Vồng Mát Lạnh',
    promptVN: '1 que kem thêm 1 que kem là mấy que kem?',
    promptEN: '1 ice cream plus 1 ice cream equals?',
    num1: 1,
    num2: 1,
    itemEmoji: '🍦',
    options: [1, 2, 3],
    answer: 2
  },
  {
    id: 13,
    type: 'addition',
    title: 'Bánh Quy Thơm Lừng',
    promptVN: '4 chiếc bánh quy thêm 4 chiếc bánh quy là mấy chiếc?',
    promptEN: '4 cookies plus 4 cookies equals?',
    num1: 4,
    num2: 4,
    itemEmoji: '🍪',
    options: [7, 8, 9],
    answer: 8
  },
  {
    id: 14,
    type: 'addition',
    title: 'Dưa Hấu Mát Ngọt',
    promptVN: '6 miếng dưa hấu thêm 3 miếng dưa hấu là mấy miếng?',
    promptEN: '6 watermelons plus 3 watermelons equals?',
    num1: 6,
    num2: 3,
    itemEmoji: '🍉',
    options: [8, 9, 10],
    answer: 9
  },
  {
    id: 15,
    type: 'addition',
    title: 'Ngôi Sao Sáng Ngời',
    promptVN: '5 ngôi sao thêm 5 ngôi sao là được mấy ngôi sao?',
    promptEN: '5 stars plus 5 stars equals?',
    num1: 5,
    num2: 5,
    itemEmoji: '⭐',
    options: [8, 9, 10],
    answer: 10
  },

  // --- Nhóm 3: So sánh lớn hơn / bé hơn trực quan (Comparison) ---
  {
    id: 16,
    type: 'compare',
    title: 'So Sánh Nấm Rừng',
    promptVN: 'Bên nào có NHIỀU nấm hơn bé ơi?',
    promptEN: 'Which side has MORE mushrooms?',
    sideA: { count: 3, emoji: '🍄' },
    sideB: { count: 6, emoji: '🍄' },
    options: ['Bên Trái (3)', 'Bên Phải (6)'],
    answer: 'Bên Phải (6)'
  },
  {
    id: 17,
    type: 'compare',
    title: 'So Sánh Kẹo Ngọt',
    promptVN: 'Bên nào có ÍT kẹo hơn?',
    promptEN: 'Which side has FEWER candies?',
    sideA: { count: 2, emoji: '🍬' },
    sideB: { count: 5, emoji: '🍬' },
    options: ['Bên Trái (2)', 'Bên Phải (5)'],
    answer: 'Bên Trái (2)'
  },
  {
    id: 18,
    type: 'compare',
    title: 'So Sánh Dâu Tây',
    promptVN: 'Bên nào có NHIỀU dâu tây hơn?',
    promptEN: 'Which side has MORE strawberries?',
    sideA: { count: 7, emoji: '🍓' },
    sideB: { count: 4, emoji: '🍓' },
    options: ['Bên Trái (7)', 'Bên Phải (4)'],
    answer: 'Bên Trái (7)'
  },
  {
    id: 19,
    type: 'compare',
    title: 'So Sánh Cá Bơi',
    promptVN: 'Bên nào có NHIỀU chú cá bơi hơn?',
    promptEN: 'Which side has MORE fish swimming?',
    sideA: { count: 5, emoji: '🐟' },
    sideB: { count: 8, emoji: '🐟' },
    options: ['Bên Trái (5)', 'Bên Phải (8)'],
    answer: 'Bên Phải (8)'
  },
  {
    id: 20,
    type: 'compare',
    title: 'So Sánh Quả Táo',
    promptVN: 'Bên nào có ÍT quả táo hơn?',
    promptEN: 'Which side has FEWER apples?',
    sideA: { count: 3, emoji: '🍎' },
    sideB: { count: 1, emoji: '🍎' },
    options: ['Bên Trái (3)', 'Bên Phải (1)'],
    answer: 'Bên Phải (1)'
  }
];

export const LOGIC_LEVELS = [
  // --- Nhóm 1: Chuỗi quy luật màu sắc & hình khối (Patterns) ---
  {
    id: 1,
    type: 'pattern',
    title: 'Quy Luật Màu Sắc',
    promptVN: 'Hình tiếp theo trong chuỗi là hình tròn màu gì nhỉ?',
    promptEN: 'What color circle comes next in the pattern?',
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
    type: 'pattern',
    title: 'Quy Luật Ngày & Đêm',
    promptVN: 'Sau Mặt Trời và Mặt Trăng tiếp theo là gì?',
    promptEN: 'What comes after Sun and Moon?',
    sequence: ['☀️', '🌙', '☀️', '🌙', '☀️'],
    options: ['🌙', '☀️', '⭐', '☁️'],
    answer: '🌙',
    hint: 'Mặt trời tỏa nắng ban ngày, mặt trăng sáng ban đêm...'
  },
  {
    id: 4,
    type: 'pattern',
    title: 'Quy Luật Thú Cưng',
    promptVN: 'Bạn nhỏ tiếp theo là ai nào?',
    promptEN: 'Who is next in the animal train?',
    sequence: ['🐶', '🐱', '🐶', '🐱'],
    options: ['🐶', '🐱', '🐭', '🐰'],
    answer: '🐶',
    hint: 'Cún con rồi đến Miu Miu...'
  },
  {
    id: 5,
    type: 'pattern',
    title: 'Quy Luật Bầu Trời',
    promptVN: 'Biểu tượng tiếp theo của chuỗi là gì?',
    promptEN: 'What symbol completes the sky sequence?',
    sequence: ['⭐', '💖', '⭐', '💖', '⭐'],
    options: ['💖', '⭐', '🌸', '✨'],
    answer: '💖',
    hint: 'Ngôi sao vàng rồi đến trái tim hồng...'
  },
  {
    id: 6,
    type: 'pattern',
    title: 'Quy Luật Xe Cộ',
    promptVN: 'Xe tiếp theo chạy qua là xe gì nhỉ?',
    promptEN: 'Which vehicle comes next?',
    sequence: ['🚗', '✈️', '🚗', '✈️', '🚗'],
    options: ['✈️', '🚗', '🚂', '🚲'],
    answer: '✈️',
    hint: 'Ô tô trên đường rồi đến máy bay trên trời...'
  },
  {
    id: 7,
    type: 'pattern',
    title: 'Quy Luật 3 Bước',
    promptVN: 'Hình tiếp theo trong chuỗi 3 bước là hình gì?',
    promptEN: 'Complete the 3-step geometric pattern:',
    sequence: ['🔴', '🟢', '🔵', '🔴', '🟢'],
    options: ['🔵', '🔴', '🟢', '🟡'],
    answer: '🔵',
    hint: 'Chuỗi lặp lại 3 màu: Đỏ, Xanh lá rồi đến Xanh dương...'
  },

  // --- Nhóm 2: Tìm điểm khác biệt (Odd one out) ---
  {
    id: 8,
    type: 'odd_one_out',
    title: 'Tìm Bạn Khác Biệt',
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
    id: 9,
    type: 'odd_one_out',
    title: 'Tìm Vật Không Ăn Được',
    promptVN: 'Vật nào KHÔNG PHẢI là thức ăn?',
    promptEN: 'Which item is NOT edible food?',
    items: [
      { emoji: '🍕', name: 'Bánh Pizza', isOdd: false },
      { emoji: '🍎', name: 'Quả Táo', isOdd: false },
      { emoji: '🚗', name: 'Xe Ô Tô', isOdd: true },
      { emoji: '🍞', name: 'Bánh Mì', isOdd: false }
    ],
    answer: '🚗'
  },
  {
    id: 10,
    type: 'odd_one_out',
    title: 'Tìm Loài Không Sống Dưới Nước',
    promptVN: 'Bạn nào KHÔNG PHẢI là loài sống dưới nước?',
    promptEN: 'Which animal does NOT live underwater?',
    items: [
      { emoji: '🐟', name: 'Cá biển', isOdd: false },
      { emoji: '🐬', name: 'Cá heo', isOdd: false },
      { emoji: '🐱', name: 'Mèo con', isOdd: true },
      { emoji: '🦀', name: 'Con cua', isOdd: false }
    ],
    answer: '🐱'
  },
  {
    id: 11,
    type: 'odd_one_out',
    title: 'Phương Tiện Không Có Bánh Xe',
    promptVN: 'Phương tiện nào KHÔNG CẦN bánh xe để di chuyển?',
    promptEN: 'Which vehicle has NO wheels?',
    items: [
      { emoji: '🚗', name: 'Xe Ô Tô', isOdd: false },
      { emoji: '🚌', name: 'Xe Buýt', isOdd: false },
      { emoji: '⛵', name: 'Thuyền Buồm', isOdd: true },
      { emoji: '🚲', name: 'Xe Đạp', isOdd: false }
    ],
    answer: '⛵'
  },
  {
    id: 12,
    type: 'odd_one_out',
    title: 'Màu Sắc Khác Biệt',
    promptVN: 'Trái cây nào KHÔNG PHẢI màu đỏ?',
    promptEN: 'Which fruit is NOT red?',
    items: [
      { emoji: '🍎', name: 'Quả Táo Đỏ', isOdd: false },
      { emoji: '🍓', name: 'Dâu Tây Đỏ', isOdd: false },
      { emoji: '🍌', name: 'Quả Chuối Vàng', isOdd: true },
      { emoji: '🍅', name: 'Cà Chua Đỏ', isOdd: false }
    ],
    answer: '🍌'
  },

  // --- Nhóm 3: So sánh kích thước & độ lớn (Size & Logic) ---
  {
    id: 13,
    type: 'size_order',
    title: 'Bạn Nào To Nhất',
    promptVN: 'Chọn con vật TO NHẤT trong các bạn dưới đây?',
    promptEN: 'Who is the BIGGEST animal?',
    items: [
      { emoji: '🐜', name: 'Kiến nhỏ', size: 1 },
      { emoji: '🐰', name: 'Thỏ con', size: 2 },
      { emoji: '🐘', name: 'Voi khổng lồ', size: 3 }
    ],
    answer: '🐘'
  },
  {
    id: 14,
    type: 'size_order',
    title: 'Quả Nào Nhỏ Nhất',
    promptVN: 'Quả nào BÉ NHẤT trong các loại quả sau?',
    promptEN: 'Which fruit is the SMALLEST?',
    items: [
      { emoji: '🍉', name: 'Dưa hấu to', size: 3 },
      { emoji: '🍊', name: 'Quả cam', size: 2 },
      { emoji: '🍓', name: 'Quả dâu tây', size: 1 }
    ],
    answer: '🍓'
  },
  {
    id: 15,
    type: 'size_order',
    title: 'Xe Nào Chở Được Nhiều Người Nhất',
    promptVN: 'Phương tiện nào CHỞ ĐƯỢC NHIỀU NGƯỜI nhất?',
    promptEN: 'Which vehicle carries the MOST passengers?',
    items: [
      { emoji: '🚲', name: 'Xe đạp (1 người)', size: 1 },
      { emoji: '🚗', name: 'Xe ô tô con (4 người)', size: 2 },
      { emoji: '🚂', name: 'Đoàn tàu hỏa (hàng trăm người)', size: 3 }
    ],
    answer: '🚂'
  }
];

export const PET_SHOP_ITEMS = [
  // Thức ăn (Food)
  { id: 'cookie', name: 'Bánh Quy Ngọt', type: 'food', emoji: '🍪', price: 10, hungerBoost: 25 },
  { id: 'icecream', name: 'Kem Cầu Vồng', type: 'food', emoji: '🍦', price: 15, hungerBoost: 35 },
  { id: 'milk', name: 'Bình Sữa Bò', type: 'food', emoji: '🍼', price: 8, hungerBoost: 20 },
  { id: 'fish_can', name: 'Hộp Cá Ngừ', type: 'food', emoji: '🐟', price: 18, hungerBoost: 40 },
  { id: 'bone', name: 'Xương Ngon Giòn', type: 'food', emoji: '🍖', price: 16, hungerBoost: 35 },
  { id: 'donut', name: 'Bánh Donut Dâu', type: 'food', emoji: '🍩', price: 12, hungerBoost: 25 },
  { id: 'apple_pie', name: 'Bánh Táo Nướng', type: 'food', emoji: '🥧', price: 20, hungerBoost: 45 },
  // Mũ & Phụ kiện (Hats & Accessories)
  { id: 'party_hat', name: 'Mũ Sinh Nhật', type: 'hat', emoji: '🎉', price: 30 },
  { id: 'crown', name: 'Vương Miện Vàng', type: 'hat', emoji: '👑', price: 50 },
  { id: 'sunglasses', name: 'Kính Mát Siêu Ngầu', type: 'hat', emoji: '🕶️', price: 25 },
  { id: 'graduation_cap', name: 'Mũ Tiến Sĩ Trí Tuệ', type: 'hat', emoji: '🎓', price: 60 },
  { id: 'bow', name: 'Nơ Hồng Xinh Xắn', type: 'hat', emoji: '🎀', price: 20 }
];

export const INITIAL_PETS = [
  { id: 'cat', name: 'Bé Miu Miu', emoji: '🐱', sound: 'Meo meo~', hunger: 80, happiness: 90 },
  { id: 'dog', name: 'Chú Cún Corgi', emoji: '🐶', sound: 'Gâu gâu!', hunger: 75, happiness: 85 },
  { id: 'bunny', name: 'Bé Thỏ Trắng', emoji: '🐰', sound: 'Khịt khịt~', hunger: 85, happiness: 90 },
  { id: 'panda', name: 'Gấu Trúc Po', emoji: '🐼', sound: 'Ủn ỉn~', hunger: 70, happiness: 80 },
  { id: 'penguin', name: 'Cánh Cụt Pingu', emoji: '🐧', sound: 'Quác quác!', hunger: 65, happiness: 85 },
  { id: 'dragon', name: 'Rồng Con Lửa', emoji: '🐲', sound: 'Rooaar!', hunger: 60, happiness: 75 }
];
