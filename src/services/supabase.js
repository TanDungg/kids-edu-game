import { createClient } from '@supabase/supabase-js';

const SUPABASE_PROJECT_URL = 'https://lncweytdvhxskpbotjac.supabase.co';
const DEFAULT_SUPABASE_KEY = 'sb_publishable_5-sAqi9LF29Im-yVaOsV6g_Dr0dQT-s';

class SupabaseService {
  constructor() {
    this.client = null;
    this.url = SUPABASE_PROJECT_URL;
    let savedKey = localStorage.getItem('kids_supabase_anon_key');
    if (savedKey && savedKey.startsWith('sb_secret_')) {
      localStorage.removeItem('kids_supabase_anon_key');
      savedKey = null;
    }
    this.key = savedKey || DEFAULT_SUPABASE_KEY;
    if (this.key) {
      this.init(this.key);
    }
  }

  init(key) {
    if (!key) return null;
    try {
      this.key = key.trim();
      if (!this.key.startsWith('sb_secret_')) {
        localStorage.setItem('kids_supabase_anon_key', this.key);
      }
      this.client = createClient(this.url, this.key);
      return this.client;
    } catch (err) {
      console.error('Failed to init Supabase client:', err);
      return null;
    }
  }

  isReady() {
    return this.client !== null && !!this.key;
  }

  async testConnection() {
    if (!this.client) return { ok: false, message: 'Chưa có kết nối Supabase API Key' };
    try {
      const { data, error } = await this.client.from('game_progress').select('player_id').limit(1);
      if (error) {
        return { ok: false, message: `Lỗi: ${error.message}` };
      }
      return { ok: true, message: '🟢 Kết nối Supabase thành công 100%!' };
    } catch (err) {
      return { ok: false, message: `Không thể kết nối: ${err.message}` };
    }
  }

  // ================= 1. TỪ VỰNG (VOCABULARY) =================
  async fetchVocabulary() {
    if (!this.client) return null;
    try {
      const { data, error } = await this.client.from('game_vocabulary').select('*').order('id', { ascending: true });
      return (data || []).map(v => ({
        id: v.id,
        vn: v.vn,
        en: v.en,
        emoji: v.emoji || '⭐',
        theme: v.theme || 'Tổng hợp',
        targetVN: v.target_vn || (v.vn ? v.vn.toUpperCase().replace(/\s+/g, '') : ''),
        targetEN: v.target_en || (v.en ? v.en.toUpperCase().replace(/\s+/g, '') : ''),
        hintVN: v.hint_vn || `Đây là "${v.vn}"`,
        hintEN: v.hint_en || `This is "${v.en}"`
      }));
    } catch (e) {
      console.warn('Fetch vocabulary failed:', e);
      return null;
    }
  }

  async insertVocabulary(item) {
    if (!this.client) return null;
    try {
      const payload = {
        vn: item.vn,
        en: item.en,
        emoji: item.emoji || '⭐',
        theme: item.theme || 'Tổng hợp',
        target_vn: item.vn.toUpperCase(),
        target_en: item.en.toUpperCase(),
        hint_vn: item.hintVN || `Đây là "${item.vn}"`,
        hint_en: item.hintEN || `This is "${item.en}"`
      };
      const { data, error } = await this.client.from('game_vocabulary').insert([payload]).select().single();
      if (error) throw error;
      return data;
    } catch (e) {
      console.warn('Insert vocabulary error:', e);
      return null;
    }
  }

  async deleteVocabulary(id) {
    if (!this.client) return;
    try {
      await this.client.from('game_vocabulary').delete().eq('id', id);
    } catch (e) {
      console.warn('Delete vocabulary error:', e);
    }
  }

  // ================= 2. TOÁN HỌC (MATH) =================
  async fetchMath() {
    if (!this.client) return null;
    try {
      const { data, error } = await this.client.from('game_math').select('*').order('id', { ascending: true });
      if (error) return null;
      return data.map(m => ({
        id: m.id,
        type: m.type,
        title: m.title,
        promptVN: m.prompt_vn,
        promptEN: m.prompt_en,
        itemEmoji: m.item_emoji,
        targetCount: m.target_count,
        num1: m.num1,
        num2: m.num2,
        options: m.options,
        answer: isNaN(Number(m.answer)) ? m.answer : Number(m.answer)
      }));
    } catch (e) {
      return null;
    }
  }

  async insertMath(item) {
    if (!this.client) return null;
    try {
      const payload = {
        type: item.type,
        title: item.title,
        prompt_vn: item.promptVN,
        prompt_en: item.promptEN,
        item_emoji: item.itemEmoji,
        target_count: item.targetCount,
        num1: item.num1,
        num2: item.num2,
        options: item.options,
        answer: String(item.answer)
      };
      const { data, error } = await this.client.from('game_math').insert([payload]).select().single();
      if (error) throw error;
      return data;
    } catch (e) {
      console.warn('Insert math error:', e);
      return null;
    }
  }

  async deleteMath(id) {
    if (!this.client) return;
    try {
      await this.client.from('game_math').delete().eq('id', id);
    } catch (e) {
      console.warn('Delete math error:', e);
    }
  }

  // ================= 3. LOGIC =================
  async fetchLogic() {
    if (!this.client) return null;
    try {
      const { data, error } = await this.client.from('game_logic').select('*').order('id', { ascending: true });
      if (error) return null;
      return data.map(l => ({
        id: l.id,
        type: l.type,
        title: l.title,
        promptVN: l.prompt_vn,
        promptEN: l.prompt_en,
        sequence: l.sequence,
        options: l.options,
        answer: l.answer,
        hint: l.hint
      }));
    } catch (e) {
      return null;
    }
  }

  async insertLogic(item) {
    if (!this.client) return null;
    try {
      const payload = {
        type: item.type,
        title: item.title,
        prompt_vn: item.promptVN,
        prompt_en: item.promptEN,
        sequence: item.sequence,
        options: item.options,
        answer: item.answer,
        hint: item.hint
      };
      const { data, error } = await this.client.from('game_logic').insert([payload]).select().single();
      if (error) throw error;
      return data;
    } catch (e) {
      console.warn('Insert logic error:', e);
      return null;
    }
  }

  async deleteLogic(id) {
    if (!this.client) return;
    try {
      await this.client.from('game_logic').delete().eq('id', id);
    } catch (e) {
      console.warn('Delete logic error:', e);
    }
  }

  // ================= 4. THÚ CƯNG (PETS) =================
  async fetchPets() {
    if (!this.client) return null;
    try {
      const { data, error } = await this.client.from('game_pets').select('*').order('created_at', { ascending: true });
      if (error) return null;
      return data;
    } catch (e) {
      return null;
    }
  }

  async insertPet(item) {
    if (!this.client) return null;
    try {
      const { data, error } = await this.client.from('game_pets').upsert([item]).select().single();
      if (error) throw error;
      return data;
    } catch (e) {
      return null;
    }
  }

  async deletePet(id) {
    if (!this.client) return;
    try {
      await this.client.from('game_pets').delete().eq('id', id);
    } catch (e) {
      console.warn('Delete pet error:', e);
    }
  }

  // ================= 5. CỬA HÀNG (SHOP) =================
  async fetchShop() {
    if (!this.client) return null;
    try {
      const { data, error } = await this.client.from('game_shop').select('*').order('price', { ascending: true });
      if (error) return null;
      return data.map(s => ({
        id: s.id,
        name: s.name,
        type: s.type,
        emoji: s.emoji,
        price: s.price,
        hungerBoost: s.hunger_boost
      }));
    } catch (e) {
      return null;
    }
  }

  async insertShop(item) {
    if (!this.client) return null;
    try {
      const payload = {
        id: item.id,
        name: item.name,
        type: item.type,
        emoji: item.emoji,
        price: item.price,
        hunger_boost: item.hungerBoost
      };
      const { data, error } = await this.client.from('game_shop').upsert([payload]).select().single();
      if (error) throw error;
      return data;
    } catch (e) {
      return null;
    }
  }

  async deleteShop(id) {
    if (!this.client) return;
    try {
      await this.client.from('game_shop').delete().eq('id', id);
    } catch (e) {
      console.warn('Delete shop item error:', e);
    }
  }

  // ================= 6. TIẾN ĐỘ & NHẬT KÝ =================
  async syncProgress(playerData, explicitUserId) {
    if (!this.client) return null;
    const playerId = explicitUserId || this.currentUser?.id || 'kid_demo_01';
    try {
      const meta = this.currentUser?.user_metadata || {};
      await this.ensurePlayerProfile(playerId, meta.full_name || 'Bé Thám Hiểm', {
        email: this.currentUser?.email,
        avatar_url: meta.avatar_url,
        birth_date: meta.birth_date,
        address: meta.address,
        phone: meta.phone,
        hobby: meta.hobby,
        role: meta.role || 'user'
      });
      const payload = {
        player_id: playerId,
        stars: playerData.stars,
        coins: playerData.coins,
        level: playerData.level,
        pet_data: playerData.pet,
        stats_data: playerData.stats,
        updated_at: new Date().toISOString()
      };
      await this.client.from('game_progress').upsert(payload);
    } catch (err) {
      console.warn('Sync progress warning:', err);
    }
  }

  async logActivity(subject, isCorrect, explicitUserId) {
    if (!this.client) return null;
    const playerId = explicitUserId || this.currentUser?.id || 'kid_demo_01';
    try {
      await this.client.from('learning_logs').insert({
        player_id: playerId,
        subject: subject,
        is_correct: isCorrect,
        score_earned: 1
      });
    } catch (err) {
      console.warn('Log activity warning:', err);
    }
  }

  // ================= 7. XÁC THỰC NGƯỜI DÙNG (AUTH & GOOGLE) =================
  async getSession() {
    if (!this.client) return null;
    try {
      const { data: { session } } = await this.client.auth.getSession();
      this.currentUser = session?.user || null;
      return session;
    } catch {
      return null;
    }
  }

  async getCurrentUser() {
    if (!this.client) return null;
    try {
      const { data: { user } } = await this.client.auth.getUser();
      this.currentUser = user || null;
      return user || null;
    } catch {
      return null;
    }
  }

  onAuthStateChange(callback) {
    if (!this.client) return { unsubscribe: () => {} };
    const { data: { subscription } } = this.client.auth.onAuthStateChange((event, session) => {
      this.currentUser = session?.user || null;
      if (typeof callback === 'function') {
        callback(event, session);
      }
    });
    return subscription;
  }

  async signUp({ email, password, fullName, role = 'user' }) {
    if (!this.client) throw new Error('Chưa kết nối Supabase API');
    const avatarUrl = `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(email)}`;
    const { data, error } = await this.client.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName || 'Bé Thám Hiểm',
          role: role,
          avatar_url: avatarUrl
        }
      }
    });
    if (error) throw error;
    if (data?.user) {
      this.currentUser = data.user;
      await this.ensurePlayerProfile(data.user.id, fullName || email, {
        email: email,
        avatar_url: avatarUrl,
        role: role
      });
    }
    return data;
  }

  async signInWithPassword({ email, password }) {
    if (!this.client) throw new Error('Chưa kết nối Supabase API');
    const { data, error } = await this.client.auth.signInWithPassword({
      email,
      password
    });
    if (error) throw error;
    if (data?.user) {
      this.currentUser = data.user;
      const meta = data.user.user_metadata || {};
      await this.ensurePlayerProfile(data.user.id, meta.full_name || email, {
        email: data.user.email,
        avatar_url: meta.avatar_url,
        birth_date: meta.birth_date,
        address: meta.address,
        phone: meta.phone,
        hobby: meta.hobby,
        role: meta.role || 'user'
      });
    }
    return data;
  }

  async signInWithGoogle() {
    if (!this.client) throw new Error('Chưa kết nối Supabase API');
    const redirectUrl = window.location.origin + window.location.pathname;
    const { data, error } = await this.client.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectUrl
      }
    });
    if (error) throw error;
    return data;
  }

  async signOut() {
    if (!this.client) return;
    try {
      await this.client.auth.signOut();
      this.currentUser = null;
    } catch (err) {
      console.warn('Sign out warning:', err);
    }
  }

  async updateUserProfile(profileData) {
    if (!this.client) throw new Error('Chưa kết nối Supabase API');
    
    // 1. Cập nhật Auth Metadata trên Supabase Auth
    const authDataPayload = {
      full_name: profileData.full_name || profileData.name,
      avatar_url: profileData.avatar_url || profileData.avatar,
      birth_date: profileData.birth_date || profileData.birthDate,
      address: profileData.address,
      phone: profileData.phone,
      hobby: profileData.hobby
    };

    const { data, error } = await this.client.auth.updateUser({
      data: authDataPayload
    });
    if (error) throw error;

    // 2. Ghi trực tiếp xuống bảng public.players trong Database
    if (data?.user) {
      this.currentUser = data.user;
      await this.ensurePlayerProfile(data.user.id, authDataPayload.full_name || data.user.email, {
        email: data.user.email,
        avatar_url: authDataPayload.avatar_url,
        birth_date: authDataPayload.birth_date,
        address: authDataPayload.address,
        phone: authDataPayload.phone,
        hobby: authDataPayload.hobby,
        role: data.user.user_metadata?.role || 'user'
      });
    }
    return data;
  }

  async ensurePlayerProfile(userId, name, extraData = {}) {
    if (!this.client || !userId) return;
    try {
      const meta = this.currentUser?.user_metadata || {};
      const payload = {
        id: userId,
        name: name || meta.full_name || 'Bé Thám Hiểm',
        email: extraData.email || this.currentUser?.email || null,
        avatar_url: extraData.avatar_url || extraData.avatar || meta.avatar_url || null,
        birth_date: extraData.birth_date || extraData.birthDate || meta.birth_date || null,
        address: extraData.address !== undefined ? extraData.address : (meta.address || null),
        phone: extraData.phone !== undefined ? extraData.phone : (meta.phone || null),
        hobby: extraData.hobby !== undefined ? extraData.hobby : (meta.hobby || null),
        role: extraData.role || meta.role || 'user',
        updated_at: new Date().toISOString()
      };

      // Làm sạch các trường undefined
      Object.keys(payload).forEach(key => {
        if (payload[key] === undefined) delete payload[key];
      });

      const { error } = await this.client.from('players').upsert(payload);
      if (error) {
        // Dự phòng nếu database chưa chạy script migration bổ sung cột
        console.warn('Upsert player full profile warning (thử lại với bảng cơ bản):', error.message);
        await this.client.from('players').upsert({
          id: userId,
          name: name || meta.full_name || 'Bé Thám Hiểm'
        });
      }
    } catch (e) {
      console.warn('Ensure player profile warning:', e);
    }
  }

  async adminUpdatePlayer(playerId, profileData, progressData) {
    if (!this.client || !playerId) throw new Error('Thiếu thông tin người chơi');
    
    // 1. Cập nhật thông tin vào bảng public.players
    if (profileData) {
      const payload = {
        id: playerId,
        name: profileData.name || 'Bé Thám Hiểm',
        email: profileData.email || null,
        avatar_url: profileData.avatarUrl || profileData.avatar_url || null,
        birth_date: profileData.birthDate || profileData.birth_date || null,
        address: profileData.address || null,
        phone: profileData.phone || null,
        hobby: profileData.hobby || null,
        updated_at: new Date().toISOString()
      };
      Object.keys(payload).forEach(key => {
        if (payload[key] === undefined) delete payload[key];
      });

      const { error: pErr } = await this.client.from('players').upsert(payload);
      if (pErr) {
        console.warn('Admin update players table warning:', pErr.message);
        await this.client.from('players').upsert({
          id: playerId,
          name: profileData.name || 'Bé Thám Hiểm'
        });
      }
    }

    // 2. Cập nhật tiến độ vào bảng game_progress nếu có
    if (progressData) {
      await this.syncProgress(progressData, playerId);
    }

    return true;
  }

  async deletePlayer(playerId) {
    if (!this.client || !playerId) return;
    try {
      await this.client.from('learning_logs').delete().eq('player_id', playerId);
      await this.client.from('game_progress').delete().eq('player_id', playerId);
      await this.client.from('players').delete().eq('id', playerId);
    } catch (e) {
      console.warn('Delete player error:', e);
    }
  }

  async fetchPlayerProgress(userId) {
    if (!this.client || !userId) return null;
    try {
      const { data, error } = await this.client
        .from('game_progress')
        .select('*')
        .eq('player_id', userId)
        .maybeSingle();
      if (error) {
        console.warn('Fetch progress warning:', error);
        return null;
      }
      return data;
    } catch {
      return null;
    }
  }

  async resetPasswordForEmail(email) {
    if (!this.client) throw new Error('Chưa kết nối Supabase API');
    const redirectUrl = window.location.origin + window.location.pathname;
    const { data, error } = await this.client.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: redirectUrl
    });
    if (error) throw error;
    return data;
  }

  async updateUserPassword(newPassword) {
    if (!this.client) throw new Error('Chưa kết nối Supabase API');
    const { data, error } = await this.client.auth.updateUser({
      password: newPassword
    });
    if (error) throw error;
    return data;
  }

  // ================= 8. THỐNG KÊ QUẢN TRỊ & BIỂU ĐỒ =================
  async fetchAllPlayersWithProgress() {
    if (!this.client) return { players: [], logs: [] };
    try {
      const [pRes, progRes, lRes] = await Promise.all([
        this.client.from('players').select('*').order('created_at', { ascending: false }),
        this.client.from('game_progress').select('*'),
        this.client.from('learning_logs').select('*').order('created_at', { ascending: false }).limit(100)
      ]);

      const players = pRes.data || [];
      const progress = progRes.data || [];
      const logs = lRes.data || [];

      const progressMap = {};
      progress.forEach(p => {
        progressMap[p.player_id] = p;
      });

      const mergedPlayers = players.map(pl => {
        const prog = progressMap[pl.id] || {};
        return {
          id: pl.id,
          name: pl.name || 'Bé Thám Hiểm',
          email: pl.email || '',
          avatarUrl: pl.avatar_url || '',
          birthDate: pl.birth_date || '',
          address: pl.address || '',
          phone: pl.phone || '',
          hobby: pl.hobby || '',
          role: pl.role || 'user',
          stars: prog.stars !== undefined ? prog.stars : 5,
          coins: prog.coins !== undefined ? prog.coins : 30,
          level: prog.level !== undefined ? prog.level : 1,
          pet: prog.pet_data || null,
          stats: prog.stats_data || null,
          createdAt: pl.created_at || null,
          updatedAt: prog.updated_at || pl.updated_at || pl.created_at || new Date().toISOString()
        };
      });

      return {
        players: mergedPlayers,
        logs: logs
      };
    } catch (e) {
      console.warn('Fetch all players warning:', e);
      return { players: [], logs: [] };
    }
  }
}

export const supabaseService = new SupabaseService();
