-- ========================================================
-- SCHEMA HOÀN CHỈNH CHO GAME GIÁO DỤC TRẺ EM (KIDS EDU GAME)
-- Dán đoạn mã này vào SQL Editor trên Supabase và bấm RUN
-- ========================================================

-- 1. BẢNG TỪ VỰNG NGÔN NGỮ (Language Valley)
CREATE TABLE IF NOT EXISTS public.game_vocabulary (
  id BIGSERIAL PRIMARY KEY,
  vn TEXT NOT NULL,
  en TEXT NOT NULL,
  emoji TEXT NOT NULL DEFAULT '⭐',
  theme TEXT DEFAULT 'Tổng hợp',
  target_vn TEXT,
  target_en TEXT,
  hint_vn TEXT,
  hint_en TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. BẢNG TOÁN HỌC (Math Farm)
CREATE TABLE IF NOT EXISTS public.game_math (
  id BIGSERIAL PRIMARY KEY,
  type TEXT NOT NULL DEFAULT 'count', -- 'count' | 'addition' | 'compare'
  title TEXT NOT NULL,
  prompt_vn TEXT NOT NULL,
  prompt_en TEXT,
  item_emoji TEXT DEFAULT '🍎',
  target_count INTEGER,
  num1 INTEGER,
  num2 INTEGER,
  options JSONB DEFAULT '[]'::jsonb,
  answer TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. BẢNG TƯ DUY & LOGIC (Logic Tower)
CREATE TABLE IF NOT EXISTS public.game_logic (
  id BIGSERIAL PRIMARY KEY,
  type TEXT NOT NULL DEFAULT 'pattern', -- 'pattern' | 'odd_one_out'
  title TEXT NOT NULL,
  prompt_vn TEXT NOT NULL,
  prompt_en TEXT,
  sequence JSONB DEFAULT '[]'::jsonb,
  options JSONB DEFAULT '[]'::jsonb,
  answer TEXT NOT NULL,
  hint TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. BẢNG THÚ CƯNG (Pet Sanctuary)
CREATE TABLE IF NOT EXISTS public.game_pets (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  emoji TEXT NOT NULL,
  sound TEXT NOT NULL,
  hunger INTEGER DEFAULT 80,
  happiness INTEGER DEFAULT 90,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. BẢNG CỬA HÀNG VẬT PHẨM (Shop Items)
CREATE TABLE IF NOT EXISTS public.game_shop (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'food', -- 'food' | 'hat'
  emoji TEXT NOT NULL,
  price INTEGER DEFAULT 10,
  hunger_boost INTEGER DEFAULT 25,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 6. BẢNG HỒ SƠ NGƯỜI CHƠI (Players)
CREATE TABLE IF NOT EXISTS public.players (
  id TEXT PRIMARY KEY,
  name TEXT DEFAULT 'Bé Thám Hiểm',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 7. BẢNG TIẾN ĐỘ CHƠI (Game Progress)
CREATE TABLE IF NOT EXISTS public.game_progress (
  player_id TEXT PRIMARY KEY REFERENCES public.players(id) ON DELETE CASCADE,
  stars INTEGER DEFAULT 5,
  coins INTEGER DEFAULT 30,
  level INTEGER DEFAULT 1,
  pet_data JSONB DEFAULT '{"id": "cat", "name": "Bé Miu Miu", "hunger": 80, "happiness": 90}'::jsonb,
  stats_data JSONB DEFAULT '{"language": {"completed": 0, "correct": 0}, "math": {"completed": 0, "correct": 0}, "logic": {"completed": 0, "correct": 0}}'::jsonb,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 8. BẢNG NHẬT KÝ HỌC TẬP (Learning Logs)
CREATE TABLE IF NOT EXISTS public.learning_logs (
  id BIGSERIAL PRIMARY KEY,
  player_id TEXT,
  subject TEXT NOT NULL,
  is_correct BOOLEAN DEFAULT true,
  score_earned INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- BẬT ROW LEVEL SECURITY (RLS) VÀ CẤP QUYỀN TRUY CẬP CHO CLIENT
ALTER TABLE public.game_vocabulary ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public vocabulary" ON public.game_vocabulary;
CREATE POLICY "Allow public vocabulary" ON public.game_vocabulary FOR ALL TO public USING (true) WITH CHECK (true);

ALTER TABLE public.game_math ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public math" ON public.game_math;
CREATE POLICY "Allow public math" ON public.game_math FOR ALL TO public USING (true) WITH CHECK (true);

ALTER TABLE public.game_logic ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public logic" ON public.game_logic;
CREATE POLICY "Allow public logic" ON public.game_logic FOR ALL TO public USING (true) WITH CHECK (true);

ALTER TABLE public.game_pets ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public pets" ON public.game_pets;
CREATE POLICY "Allow public pets" ON public.game_pets FOR ALL TO public USING (true) WITH CHECK (true);

ALTER TABLE public.game_shop ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public shop" ON public.game_shop;
CREATE POLICY "Allow public shop" ON public.game_shop FOR ALL TO public USING (true) WITH CHECK (true);

ALTER TABLE public.players ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public players" ON public.players;
CREATE POLICY "Allow public players" ON public.players FOR ALL TO public USING (true) WITH CHECK (true);

ALTER TABLE public.game_progress ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public game_progress" ON public.game_progress;
CREATE POLICY "Allow public game_progress" ON public.game_progress FOR ALL TO public USING (true) WITH CHECK (true);

ALTER TABLE public.learning_logs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public learning_logs" ON public.learning_logs;
CREATE POLICY "Allow public learning_logs" ON public.learning_logs FOR ALL TO public USING (true) WITH CHECK (true);

-- NẠP DỮ LIỆU CHÍNH THỨC VÀO DATABASE
-- 1. Nạp từ vựng chính thức
INSERT INTO public.game_vocabulary (vn, en, emoji, theme, target_vn, target_en, hint_vn, hint_en)
VALUES
  ('Hổ', 'Tiger', '🐯', 'Động vật', 'HỔ', 'TIGER', 'Chúa sơn lâm có vằn đen vàng!', 'The king of the jungle with stripes!'),
  ('Sư tử', 'Lion', '🦁', 'Động vật', 'SƯ TỬ', 'LION', 'Có bờm dày và tiếng gầm vang dội!', 'Has a big mane and a loud roar!'),
  ('Voi', 'Elephant', '🐘', 'Động vật', 'VOI', 'ELEPHANT', 'Có vòi dài và đôi tai to như chiếc quạt!', 'Has a long trunk and big ears!'),
  ('Khỉ', 'Monkey', '🐵', 'Động vật', 'KHỈ', 'MONKEY', 'Thông minh leo trèo giỏi và thích ăn chuối!', 'Loves climbing trees and eating bananas!'),
  ('Gấu', 'Bear', '🐻', 'Động vật', 'GẤU', 'BEAR', 'To lớn lông dày thích ăn mật ong!', 'Big furry animal that loves sweet honey!'),
  ('Ngựa vằn', 'Zebra', '🦓', 'Động vật', 'NGỰA VẰN', 'ZEBRA', 'Có những sọc đen trắng đặc biệt!', 'Has black and white stripes!'),
  ('Chuối', 'Banana', '🍌', 'Trái cây', 'CHUỐI', 'BANANA', 'Quả cong cong vỏ vàng thơm ngọt!', 'A yellow curved sweet fruit!'),
  ('Dưa hấu', 'Watermelon', '🍉', 'Trái cây', 'DƯA HẤU', 'WATERMELON', 'Vỏ xanh ruột đỏ mọng nước mát lạnh!', 'Green outside, red and juicy inside!'),
  ('Nho', 'Grape', '🍇', 'Trái cây', 'NHO', 'GRAPE', 'Từng chùm quả mọng tròn màu tím thẫm!', 'Sweet round purple berries in bunches!'),
  ('Ô tô', 'Car', '🚗', 'Phương tiện', 'Ô TÔ', 'CAR', 'Xe 4 bánh chở gia đình đi chơi!', 'Four-wheeled vehicle for trips!'),
  ('Máy bay', 'Airplane', '✈️', 'Phương tiện', 'MÁY BAY', 'AIRPLANE', 'Bay lượn trên bầu trời xanh!', 'Flies high in the sky!'),
  ('Tàu hỏa', 'Train', '🚂', 'Phương tiện', 'TÀU HỎA', 'TRAIN', 'Chạy xình xịch trên đường ray dài!', 'Runs on railroad tracks!')
ON CONFLICT DO NOTHING;

-- 2. Nạp câu hỏi toán học chính thức
INSERT INTO public.game_math (type, title, prompt_vn, prompt_en, item_emoji, target_count, num1, num2, options, answer)
VALUES
  ('count', 'Đếm Số Trái Cây', 'Bé hãy chạm vào từng quả dâu tây để đếm nhé!', 'Tap each strawberry to count them!', '🍓', 4, NULL, NULL, '[2, 3, 4, 5]'::jsonb, '4'),
  ('count', 'Đếm Số Chú Ong', 'Có bao nhiêu chú ong chăm chỉ đang bay?', 'How many busy bees are buzzing around?', '🐝', 5, NULL, NULL, '[4, 5, 6, 7]'::jsonb, '5'),
  ('addition', 'Phép Cộng Vui Nhộn', '3 quả chuối thêm 2 quả chuối là mấy quả?', 'What is 3 bananas plus 2 bananas?', '🍌', NULL, 3, 2, '[4, 5, 6]'::jsonb, '5'),
  ('addition', 'Kẹo Ngọt Cho Bé', '4 viên kẹo thêm 3 viên kẹo là mấy viên kẹo?', '4 candies plus 3 candies equals?', '🍬', NULL, 4, 3, '[6, 7, 8]'::jsonb, '7'),
  ('compare', 'So Sánh Lớn - Nhỏ', 'Bên nào có NHIỀU nấm hơn?', 'Which side has MORE mushrooms?', '🍄', NULL, NULL, NULL, '["Bên Trái (3)", "Bên Phải (6)"]'::jsonb, 'Bên Phải (6)')
ON CONFLICT DO NOTHING;

-- 3. Nạp câu đố logic chính thức
INSERT INTO public.game_logic (type, title, prompt_vn, prompt_en, sequence, options, answer, hint)
VALUES
  ('pattern', 'Quy Luật Màu Sắc', 'Hình tiếp theo trong chuỗi là hình gì nhỉ?', 'What shape comes next in the pattern?', '["🔴", "🟡", "🔴", "🟡", "🔴"]'::jsonb, '["🟡", "🔴", "🟢", "🔵"]'::jsonb, '🟡', 'Quy luật lặp lại: Đỏ rồi đến Vàng...'),
  ('pattern', 'Quy Luật Trái Cây', 'Quả tiếp theo là quả gì bé ơi?', 'Which fruit completes the sequence?', '["🍎", "🍏", "🍎", "🍏"]'::jsonb, '["🍎", "🍌", "🍇", "🍉"]'::jsonb, '🍎', 'Táo đỏ rồi đến táo xanh...'),
  ('odd_one_out', 'Tìm Đồ Vật Khác Biệt', 'Bạn nào KHÔNG PHẢI là loài bay trên trời?', 'Which one CANNOT fly in the sky?', '[]'::jsonb, '["🕊️ Chim bồ câu", "🦋 Bướm xinh", "🐙 Bạch tuộc", "🐝 Chú ong"]'::jsonb, '🐙 Bạch tuộc', 'Bạch tuộc bơi dưới biển sâu!'),
  ('pattern', 'Quy Luật Hình Sao', 'Ngôi sao màu gì tiếp theo?', 'Which star comes next?', '["⭐", "🌟", "⭐", "🌟"]'::jsonb, '["⭐", "🌟", "✨"]'::jsonb, '⭐', 'Lặp lại ngôi sao vàng và ngôi sao lấp lánh!')
ON CONFLICT DO NOTHING;

-- 4. Nạp danh sách thú cưng chính thức
INSERT INTO public.game_pets (id, name, emoji, sound, hunger, happiness)
VALUES
  ('cat', 'Bé Miu Miu', '🐱', 'Meo meo~', 80, 90),
  ('dog', 'Chú Cún Lu', '🐶', 'Gâu gâu!', 70, 85),
  ('dragon', 'Rồng Con Lửa', '🐲', 'Rooaar!', 60, 75)
ON CONFLICT (id) DO NOTHING;

-- 5. Nạp danh mục cửa hàng chính thức
INSERT INTO public.game_shop (id, name, type, emoji, price, hunger_boost)
VALUES
  ('cookie', 'Bánh Quy Ngọt', 'food', '🍪', 10, 25),
  ('icecream', 'Kem Cầu Vồng', 'food', '🍦', 15, 35),
  ('milk', 'Bình Sữa Bò', 'food', '🍼', 8, 20),
  ('party_hat', 'Mũ Sinh Nhật', 'hat', '🎉', 30, 0),
  ('crown', 'Vương Miện Vàng', 'hat', '👑', 50, 0),
  ('sunglasses', 'Kính Mát Siêu Ngầu', 'hat', '🕶️', 25, 0)
ON CONFLICT (id) DO NOTHING;

-- 6. Khởi tạo người chơi mẫu
INSERT INTO public.players (id, name)
VALUES ('kid_demo_01', 'Bé Thám Hiểm')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.game_progress (player_id, stars, coins, level)
VALUES ('kid_demo_01', 5, 30, 1)
ON CONFLICT (player_id) DO NOTHING;
