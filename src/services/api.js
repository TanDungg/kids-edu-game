// API Service for Syncing Game State with Hugging Face Space & Supabase

const DEFAULT_BACKEND_URL = localStorage.getItem('kids_backend_url') || '';

export const apiService = {
  getBackendUrl() {
    return localStorage.getItem('kids_backend_url') || '';
  },

  setBackendUrl(url) {
    let cleanUrl = url.trim();
    if (cleanUrl.endsWith('/')) {
      cleanUrl = cleanUrl.slice(0, -1);
    }
    localStorage.setItem('kids_backend_url', cleanUrl);
    return cleanUrl;
  },

  async checkServerHealth() {
    const baseUrl = this.getBackendUrl();
    if (!baseUrl) return { online: false, message: 'Chưa cấu hình URL Server' };

    try {
      const res = await fetch(`${baseUrl}/health`, { method: 'GET' });
      if (res.ok) {
        return { online: true, message: 'Server Hugging Face đang hoạt động tốt!' };
      }
      return { online: false, message: 'Server phản hồi lỗi' };
    } catch {
      return { online: false, message: 'Không thể kết nối tới Server' };
    }
  },

  async syncProgress(playerData) {
    const baseUrl = this.getBackendUrl();
    if (!baseUrl) return null; // Offline mode

    try {
      const res = await fetch(`${baseUrl}/api/player/sync`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          player_id: 'kid_demo_01',
          name: 'Bé Thám Hiểm',
          stars: playerData.stars,
          coins: playerData.coins,
          level: playerData.level,
          pet_data: playerData.pet,
          stats_data: playerData.stats
        })
      });
      return await res.json();
    } catch (err) {
      console.warn('Sync failed, saved locally:', err);
      return null;
    }
  },

  async logActivity(subject, isCorrect) {
    const baseUrl = this.getBackendUrl();
    if (!baseUrl) return null;

    try {
      const res = await fetch(`${baseUrl}/api/logs/record`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          player_id: 'kid_demo_01',
          subject: subject,
          is_correct: isCorrect,
          score_earned: 1
        })
      });
      return await res.json();
    } catch (err) {
      console.warn('Logging failed:', err);
      return null;
    }
  }
};
