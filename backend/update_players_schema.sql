-- =========================================================================
-- MÃ SQL CẬP NHẬT BẢNG PUBLIC.PLAYERS (SUPABASE SQL EDITOR)
-- Hướng dẫn: Mở Supabase -> Chọn dự án -> SQL Editor -> Dán mã này -> Bấm Run
-- =========================================================================

-- 1. Bổ sung các cột lưu thông tin cá nhân và hồ sơ người chơi / bé
ALTER TABLE public.players ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE public.players ADD COLUMN IF NOT EXISTS avatar_url TEXT;
ALTER TABLE public.players ADD COLUMN IF NOT EXISTS birth_date DATE;
ALTER TABLE public.players ADD COLUMN IF NOT EXISTS address TEXT;
ALTER TABLE public.players ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE public.players ADD COLUMN IF NOT EXISTS hobby TEXT;
ALTER TABLE public.players ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user';
ALTER TABLE public.players ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT now();

-- 2. Cấp quyền Row Level Security (RLS) để Client đọc/ghi hồ sơ an toàn
ALTER TABLE public.players ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public players" ON public.players;
CREATE POLICY "Allow public players" ON public.players FOR ALL TO public USING (true) WITH CHECK (true);

-- 3. Đặt ghi chú mô tả cho bảng
COMMENT ON TABLE public.players IS 'Bảng hồ sơ người dùng, học sinh và các bé tham gia Kids Edu Game';
