-- ========================================================
-- SCHEMA CHUẨN BẢO MẬT SUPABASE (BẬT ROW LEVEL SECURITY - RLS)
-- Dán đoạn mã này vào SQL Editor trên Supabase và bấm RUN
-- ========================================================

-- 1. Bảng Thông Tin Bé (Players)
CREATE TABLE IF NOT EXISTS public.players (
  id TEXT PRIMARY KEY,
  name TEXT DEFAULT 'Bé Thám Hiểm',
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.players ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Cho phep truy cap players" ON public.players;
CREATE POLICY "Cho phep truy cap players" 
  ON public.players FOR ALL 
  TO public 
  USING (true) 
  WITH CHECK (true);


-- 2. Bảng Tiến Độ Game (Game Progress: Sao, Xu, Cấp Độ, Thú Cưng)
CREATE TABLE IF NOT EXISTS public.game_progress (
  player_id TEXT PRIMARY KEY REFERENCES public.players(id) ON DELETE CASCADE,
  stars INTEGER DEFAULT 5,
  coins INTEGER DEFAULT 30,
  level INTEGER DEFAULT 1,
  pet_data JSONB DEFAULT '{"id": "cat", "name": "Bé Miu Miu", "hunger": 80, "happiness": 90}'::jsonb,
  stats_data JSONB DEFAULT '{"language": {"completed": 0, "correct": 0}, "math": {"completed": 0, "correct": 0}, "logic": {"completed": 0, "correct": 0}}'::jsonb,
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.game_progress ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Cho phep truy cap game_progress" ON public.game_progress;
CREATE POLICY "Cho phep truy cap game_progress" 
  ON public.game_progress FOR ALL 
  TO public 
  USING (true) 
  WITH CHECK (true);


-- 3. Bảng Nhật Ký Học Tập (Learning Logs cho Phụ Huynh)
CREATE TABLE IF NOT EXISTS public.learning_logs (
  id BIGSERIAL PRIMARY KEY,
  player_id TEXT,
  subject TEXT NOT NULL,
  is_correct BOOLEAN DEFAULT true,
  score_earned INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.learning_logs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Cho phep truy cap learning_logs" ON public.learning_logs;
CREATE POLICY "Cho phep truy cap learning_logs" 
  ON public.learning_logs FOR ALL 
  TO public 
  USING (true) 
  WITH CHECK (true);


-- 4. Khởi tạo dữ liệu mẫu cho bé đầu tiên
INSERT INTO public.players (id, name)
VALUES ('kid_demo_01', 'Bé Thám Hiểm')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.game_progress (player_id, stars, coins, level)
VALUES ('kid_demo_01', 5, 30, 1)
ON CONFLICT (player_id) DO NOTHING;
