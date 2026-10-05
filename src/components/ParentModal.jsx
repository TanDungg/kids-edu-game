import React, { useState, useEffect } from 'react';
import { X, Lock, CheckCircle, BarChart3, Database, Cloud, RefreshCcw } from 'lucide-react';
import { sounds } from '../utils/sound';
import { supabaseService } from '../services/supabase';

export default function ParentModal({ isOpen, onClose, stats, onResetData }) {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [num1] = useState(Math.floor(Math.random() * 6) + 5); // 5 - 10
  const [num2] = useState(Math.floor(Math.random() * 5) + 3); // 3 - 7
  const [parentInput, setParentInput] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Supabase direct connection states
  const [supabaseKey, setSupabaseKey] = useState(() => localStorage.getItem('kids_supabase_anon_key') || '');
  const [dbStatus, setDbStatus] = useState({ ok: false });
  const [isCheckingDb, setIsCheckingDb] = useState(false);
  const [dbMessage, setDbMessage] = useState('');

  useEffect(() => {
    if (isUnlocked && supabaseKey) {
      checkSupabase();
    }
  }, [isUnlocked]);

  const checkSupabase = async () => {
    setIsCheckingDb(true);
    supabaseService.init(supabaseKey);
    const res = await supabaseService.testConnection();
    setDbStatus(res);
    setDbMessage(res.message);
    setIsCheckingDb(false);
  };

  const handleTestConnection = async () => {
    sounds.playClick();
    await checkSupabase();
    if (dbStatus.ok) {
      sounds.playSuccess();
    }
  };

  if (!isOpen) return null;

  const handleUnlock = (e) => {
    e.preventDefault();
    if (parseInt(parentInput, 10) === num1 + num2) {
      sounds.playSuccess();
      setIsUnlocked(true);
      setErrorMessage('');
    } else {
      sounds.playError();
      setErrorMessage('Kết quả chưa đúng, vui lòng thử lại.');
    }
  };

  const handleClose = () => {
    sounds.playClick();
    setIsUnlocked(false);
    setParentInput('');
    setErrorMessage('');
    onClose();
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(15, 23, 42, 0.65)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 100,
      padding: '16px'
    }}>
      <div 
        className="kid-card animate-pop-in"
        style={{
          width: '100%',
          maxWidth: '560px',
          background: '#ffffff',
          borderRadius: '24px',
          padding: '24px',
          position: 'relative',
          maxHeight: '90vh',
          overflowY: 'auto'
        }}
      >
        {/* Close Button */}
        <button 
          onClick={handleClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: '#f1f5f9',
            border: 'none',
            borderRadius: '50%',
            width: '36px',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
          }}
        >
          <X size={20} color="#64748b" />
        </button>

        {/* LOCKED STATE: Math Security Gate */}
        {!isUnlocked ? (
          <div style={{ textAlign: 'center', padding: '20px 8px' }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: '#ede9fe',
              color: '#7c3aed',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px'
            }}>
              <Lock size={32} />
            </div>

            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '22px', fontWeight: 800, color: '#1e293b' }}>
              Khu Vực Dành Cho Phụ Huynh
            </h3>
            <p style={{ color: '#64748b', fontSize: '14px', marginTop: '6px', marginBottom: '20px' }}>
              Để tiếp tục, xin vui lòng giải phép tính dưới đây:
            </p>

            <form onSubmit={handleUnlock} style={{ maxWidth: '280px', margin: '0 auto' }}>
              <div style={{
                fontSize: '28px',
                fontWeight: 900,
                color: '#4338ca',
                background: '#e0e7ff',
                padding: '12px',
                borderRadius: '16px',
                marginBottom: '16px'
              }}>
                {num1} + {num2} = ?
              </div>

              <input 
                type="number" 
                autoFocus
                placeholder="Nhập kết quả"
                value={parentInput}
                onChange={(e) => setParentInput(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '14px',
                  border: '2px solid #cbd5e1',
                  fontSize: '18px',
                  textAlign: 'center',
                  fontWeight: 700,
                  outline: 'none',
                  marginBottom: '12px'
                }}
              />

              {errorMessage && (
                <div style={{ color: '#dc2626', fontSize: '13px', fontWeight: 700, marginBottom: '12px' }}>
                  {errorMessage}
                </div>
              )}

              <button type="submit" className="btn-kid btn-purple" style={{ width: '100%', padding: '12px', fontSize: '16px' }}>
                Xác nhận mở khóa
              </button>
            </form>
          </div>
        ) : (
          /* UNLOCKED STATE: Learning Analytics & Architecture Info */
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
              <BarChart3 size={24} color="#7c3aed" />
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '22px', fontWeight: 800, color: '#1e293b' }}>
                Báo Cáo Học Tập Của Bé
              </h3>
            </div>

            {/* Subject Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '24px' }}>
              <div style={{ background: '#fdf2f8', padding: '12px', borderRadius: '16px', textAlign: 'center', border: '2px solid #fbcfe8' }}>
                <div style={{ fontSize: '12px', fontWeight: 800, color: '#db2777' }}>Ngôn Ngữ</div>
                <div style={{ fontSize: '24px', fontWeight: 900, color: '#9d174d', marginTop: '4px' }}>
                  {stats?.language?.completed || 0}
                </div>
                <div style={{ fontSize: '11px', color: '#be185d', fontWeight: 700 }}>Câu hoàn thành</div>
              </div>

              <div style={{ background: '#ecfdf5', padding: '12px', borderRadius: '16px', textAlign: 'center', border: '2px solid #a7f3d0' }}>
                <div style={{ fontSize: '12px', fontWeight: 800, color: '#059669' }}>Toán Học</div>
                <div style={{ fontSize: '24px', fontWeight: 900, color: '#065f46', marginTop: '4px' }}>
                  {stats?.math?.completed || 0}
                </div>
                <div style={{ fontSize: '11px', color: '#047857', fontWeight: 700 }}>Câu hoàn thành</div>
              </div>

              <div style={{ background: '#f5f3ff', padding: '12px', borderRadius: '16px', textAlign: 'center', border: '2px solid #ddd6fe' }}>
                <div style={{ fontSize: '12px', fontWeight: 800, color: '#7c3aed' }}>Tư Duy Logic</div>
                <div style={{ fontSize: '24px', fontWeight: 900, color: '#4c1d95', marginTop: '4px' }}>
                  {stats?.logic?.completed || 0}
                </div>
                <div style={{ fontSize: '11px', color: '#6d28d9', fontWeight: 700 }}>Câu hoàn thành</div>
              </div>
            </div>

            {/* Direct Supabase Cloud Connection */}
            <div style={{
              background: '#f8fafc',
              border: '2px solid #e2e8f0',
              borderRadius: '16px',
              padding: '16px',
              marginBottom: '20px'
            }}>
              <div style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Database size={16} color="#059669" />
                  <span>Đồng Bộ Đám Mây (Supabase)</span>
                </div>
                <span style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '999px', background: dbStatus.ok ? '#dcfce7' : '#f1f5f9', color: dbStatus.ok ? '#15803d' : '#64748b', fontWeight: 800 }}>
                  {dbStatus.ok ? '🟢 Đã kết nối Supabase' : '⚪ Lưu cục bộ (Offline)'}
                </span>
              </div>

              <div style={{ fontSize: '12px', color: '#475569', marginBottom: '6px' }}>
                <strong>Project URL:</strong> <code>https://lncweytdvhxskpbotjac.supabase.co</code>
              </div>

              <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
                <input
                  type="password"
                  placeholder="Dán anon public key từ Supabase vào đây"
                  value={supabaseKey}
                  onChange={(e) => setSupabaseKey(e.target.value)}
                  style={{
                    flex: 1,
                    padding: '8px 12px',
                    borderRadius: '10px',
                    border: '1px solid #cbd5e1',
                    fontSize: '13px',
                    outline: 'none'
                  }}
                />
                <button
                  type="button"
                  onClick={handleTestConnection}
                  disabled={isCheckingDb}
                  className="btn-kid btn-green"
                  style={{ padding: '8px 14px', fontSize: '12px' }}
                >
                  {isCheckingDb ? 'Đang thử...' : 'Lưu & Kết nối'}
                </button>
              </div>

              {dbMessage && (
                <div style={{ marginTop: '8px', fontSize: '12px', fontWeight: 700, color: dbStatus.ok ? '#16a34a' : '#ea580c' }}>
                  {dbMessage}
                </div>
              )}

              <p style={{ fontSize: '11px', color: '#64748b', lineHeight: 1.5, marginTop: '8px' }}>
                💡 <strong>Cách lấy Key:</strong> Trên Supabase $\rightarrow$ <em>Project Settings</em> (bánh răng) $\rightarrow$ <em>API</em> $\rightarrow$ Copy <em>anon public key</em>.
              </p>
            </div>

            {/* Reset Data Button */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '12px', borderTop: '1px solid #e2e8f0' }}>
              <button
                onClick={() => {
                  if (window.confirm('Bạn có chắc muốn cài đặt lại toàn bộ tiến độ chơi của bé?')) {
                    onResetData();
                    handleClose();
                  }
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#ef4444',
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <RefreshCcw size={14} />
                <span>Cài lại dữ liệu</span>
              </button>

              <button onClick={handleClose} className="btn-kid btn-purple" style={{ padding: '8px 20px', fontSize: '14px' }}>
                Đóng
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
