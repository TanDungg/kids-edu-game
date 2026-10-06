import React, { useState } from 'react';
import { X, Mail, Lock, User, Sparkles, CheckCircle2, AlertCircle, LogIn, UserPlus, Eye, EyeOff, KeyRound, ArrowLeft } from 'lucide-react';
import confetti from 'canvas-confetti';
import { supabaseService } from '../services/supabase';
import { sounds } from '../utils/sound';

export default function AuthModal({ isOpen, onClose, onAuthSuccess }) {
  const [mode, setMode] = useState('login'); // 'login' | 'register' | 'forgot'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Anti-autofill controls
  const [isEmailReadOnly, setIsEmailReadOnly] = useState(true);
  const [isPasswordReadOnly, setIsPasswordReadOnly] = useState(true);

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setFullName('');
    setErrorMsg('');
    setSuccessMsg('');
    setIsEmailReadOnly(true);
    setIsPasswordReadOnly(true);
  };

  React.useEffect(() => {
    if (isOpen) {
      resetForm();
    }
  }, [isOpen, mode]);

  if (!isOpen) return null;

  const handleTabChange = (newMode) => {
    sounds.playClick();
    setMode(newMode);
    setErrorMsg('');
    setSuccessMsg('');
    setIsEmailReadOnly(true);
    setIsPasswordReadOnly(true);
  };

  const mapErrorMessage = (err) => {
    const raw = err?.message || String(err);
    const lower = raw.toLowerCase();

    if (lower.includes('invalid login credentials') || lower.includes('invalid_credentials')) {
      return 'Email hoặc mật khẩu chưa chính xác! Bé và ba mẹ kiểm tra lại nhé.';
    }
    if (lower.includes('user already registered') || lower.includes('already registered') || lower.includes('already in use')) {
      return 'Email này đã có tài khoản rồi! Vui lòng chuyển sang tab Đăng Nhập.';
    }
    if (lower.includes('unable to validate email address') || lower.includes('invalid format') || lower.includes('invalid email') || lower.includes('email is invalid')) {
      return 'Địa chỉ Email không đúng định dạng! Vui lòng nhập đúng dạng (Ví dụ: ba_me@gmail.com)';
    }
    if (lower.includes('password should be at least 6 characters') || lower.includes('at least 6 characters') || lower.includes('weak_password')) {
      return 'Mật khẩu cần có ít nhất 6 ký tự để bảo vệ tài khoản tốt hơn!';
    }
    if (lower.includes('email not confirmed') || lower.includes('not confirmed')) {
      return 'Tài khoản chưa xác thực qua email. Ba mẹ kiểm tra hộp thư đến (hoặc thư rác) nhé!';
    }
    if (lower.includes('rate limit') || lower.includes('over_email_send_rate_limit') || lower.includes('too many requests')) {
      return 'Hệ thống đang bận xử lý nhiều yêu cầu. Ba mẹ vui lòng chờ khoảng 1 - 2 phút rồi thử lại nhé!';
    }
    if (lower.includes('user not found')) {
      return 'Không tìm thấy tài khoản với email này. Vui lòng bấm sang tab Đăng Ký để tạo mới nhé!';
    }
    if (lower.includes('provider is not enabled') || lower.includes('unsupported provider')) {
      return 'Đăng nhập Google chưa được kích hoạt. Ba mẹ vui lòng dùng Email/Mật khẩu nhé!';
    }
    if (lower.includes('network error') || lower.includes('failed to fetch')) {
      return 'Lỗi kết nối mạng! Ba mẹ kiểm tra lại đường truyền internet nhé.';
    }
    return `Đã xảy ra lỗi: ${raw}`;
  };

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    const trimmedEmail = email.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (mode === 'forgot') {
      if (!trimmedEmail) {
        sounds.playError();
        setErrorMsg('Vui lòng nhập địa chỉ Email của bạn!');
        return;
      }
      if (!emailRegex.test(trimmedEmail)) {
        sounds.playError();
        setErrorMsg('Địa chỉ Email không đúng định dạng! Vui lòng nhập đúng dạng (Ví dụ: ba_me@gmail.com)');
        return;
      }

      setIsLoading(true);
      sounds.playClick();

      try {
        await supabaseService.resetPasswordForEmail(trimmedEmail);
        sounds.playSuccess();
        setSuccessMsg('📧 Đã gửi liên kết khôi phục mật khẩu! Ba mẹ vui lòng kiểm tra hộp thư email (và mục Spam/Thư rác) để tạo mật khẩu mới.');
      } catch (err) {
        sounds.playError();
        setErrorMsg(mapErrorMessage(err));
      } finally {
        setIsLoading(false);
      }
      return;
    }

    if (!trimmedEmail) {
      sounds.playError();
      setErrorMsg('Vui lòng nhập địa chỉ Email của bạn!');
      return;
    }

    if (!emailRegex.test(trimmedEmail)) {
      sounds.playError();
      setErrorMsg('Địa chỉ Email không đúng định dạng! Vui lòng nhập đúng dạng (Ví dụ: ba_me@gmail.com)');
      return;
    }

    if (!password) {
      sounds.playError();
      setErrorMsg('Vui lòng nhập mật khẩu tài khoản!');
      return;
    }

    if (password.length < 6) {
      sounds.playError();
      setErrorMsg('Mật khẩu cần có tối thiểu 6 ký tự!');
      return;
    }

    if (mode === 'register' && !fullName.trim()) {
      sounds.playError();
      setErrorMsg('Vui lòng nhập tên của bé hoặc ba mẹ nhé!');
      return;
    }

    setIsLoading(true);
    sounds.playClick();

    try {
      if (mode === 'register') {
        const isEmailAdmin = email.toLowerCase().includes('admin');
        const finalRole = isEmailAdmin ? 'admin' : 'user';
        const defaultName = isEmailAdmin ? 'Quản Trị Viên' : 'Bé Thám Hiểm';
        const res = await supabaseService.signUp({
          email: email.trim(),
          password,
          fullName: fullName.trim() || defaultName,
          role: finalRole
        });

        if (res?.user) {
          sounds.playSuccess();
          sounds.playCheer();
          confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });

          if (res.session) {
            setSuccessMsg('🎉 Chúc mừng bé! Đăng ký tài khoản thành công!');
            setTimeout(() => {
              if (onAuthSuccess) onAuthSuccess(res.user);
              onClose();
              resetForm();
            }, 1200);
          } else {
            setSuccessMsg('🎉 Đăng ký thành công! Nếu được yêu cầu xác thực, ba mẹ vui lòng kiểm tra hộp thư email nhé.');
            setTimeout(() => {
              setMode('login');
            }, 2500);
          }
        }
      } else {
        const res = await supabaseService.signInWithPassword({
          email: email.trim(),
          password
        });

        if (res?.user) {
          sounds.playSuccess();
          sounds.playCheer();
          confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
          setSuccessMsg('🚀 Đăng nhập thành công! Đang tải hành trình của bé...');

          setTimeout(() => {
            if (onAuthSuccess) onAuthSuccess(res.user);
            onClose();
            resetForm();
          }, 1000);
        }
      }
    } catch (err) {
      sounds.playError();
      setErrorMsg(mapErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    sounds.playClick();
    setErrorMsg('');
    setIsLoading(true);
    try {
      await supabaseService.signInWithGoogle();
    } catch (err) {
      sounds.playError();
      setErrorMsg(mapErrorMessage(err));
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(15, 23, 42, 0.65)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px'
    }}>
      <div 
        className="kid-card animate-pop-in"
        style={{
          background: '#ffffff',
          borderRadius: 'clamp(18px, 4vw, 28px)',
          width: '100%',
          maxWidth: '460px',
          padding: 'clamp(20px, 4vw, 28px) clamp(16px, 4vw, 24px)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          position: 'relative',
          maxHeight: '92vh',
          overflowY: 'auto'
        }}
      >
        {/* Decorative Top Accent */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '8px',
          background: 'linear-gradient(90deg, #38bdf8, #818cf8, #c084fc, #f472b6)'
        }} />

        {/* Close Button */}
        <button
          onClick={() => {
            sounds.playClick();
            onClose();
          }}
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
            cursor: 'pointer',
            color: '#64748b'
          }}
        >
          <X size={18} />
        </button>

        {/* Header Icon & Title */}
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '20px',
            background: 'linear-gradient(135deg, #e0f2fe, #f3e8ff)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 12px',
            fontSize: '32px',
            boxShadow: '0 8px 16px rgba(124, 58, 237, 0.12)'
          }}>
            {mode === 'login' ? '🌟' : mode === 'register' ? '🚀' : '🔑'}
          </div>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: '22px',
            fontWeight: 800,
            color: '#1e293b',
            margin: '0 0 6px'
          }}>
            {mode === 'login' ? 'Chào Mừng Bé Quay Lại!' : mode === 'register' ? 'Tạo Tài Khoản Thám Hiểm' : 'Khôi Phục Mật Khẩu'}
          </h2>
          <p style={{ color: '#64748b', fontSize: '13px', margin: 0, fontWeight: 600 }}>
            {mode === 'forgot'
              ? 'Nhập email tài khoản của bạn để nhận liên kết đổi mật khẩu'
              : 'Lưu giữ sao ⭐, xu vàng 🪙 và thú cưng an toàn trên đám mây'}
          </p>
        </div>

        {/* Mode Switcher Tabs (Only in login/register) */}
        {mode !== 'forgot' && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            background: '#f1f5f9',
            padding: '4px',
            borderRadius: '16px',
            marginBottom: '20px'
          }}>
            <button
              type="button"
              onClick={() => handleTabChange('login')}
              style={{
                padding: '10px',
                borderRadius: '12px',
                border: 'none',
                fontWeight: 800,
                fontSize: '14px',
                cursor: 'pointer',
                transition: 'all 0.2s',
                background: mode === 'login' ? '#ffffff' : 'transparent',
                color: mode === 'login' ? '#0284c7' : '#64748b',
                boxShadow: mode === 'login' ? '0 2px 8px rgba(0,0,0,0.08)' : 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px'
              }}
            >
              <LogIn size={16} />
              <span>Đăng Nhập</span>
            </button>
            <button
              type="button"
              onClick={() => handleTabChange('register')}
              style={{
                padding: '10px',
                borderRadius: '12px',
                border: 'none',
                fontWeight: 800,
                fontSize: '14px',
                cursor: 'pointer',
                transition: 'all 0.2s',
                background: mode === 'register' ? '#ffffff' : 'transparent',
                color: mode === 'register' ? '#7c3aed' : '#64748b',
                boxShadow: mode === 'register' ? '0 2px 8px rgba(0,0,0,0.08)' : 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px'
              }}
            >
              <UserPlus size={16} />
              <span>Đăng Ký</span>
            </button>
          </div>
        )}

        {/* Google OAuth Button (Only on login or register) */}
        {mode !== 'forgot' && (
          <>
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={isLoading}
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: '14px',
                border: '2px solid #e2e8f0',
                background: '#ffffff',
                color: '#1e293b',
                fontWeight: 800,
                fontSize: '14px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.04)',
                transition: 'all 0.2s',
                marginBottom: '16px'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.borderColor = '#cbd5e1'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = '#ffffff'; e.currentTarget.style.borderColor = '#e2e8f0'; }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              <span>Tiếp tục với tài khoản Google</span>
            </button>

            {/* Divider */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              margin: '16px 0',
              color: '#94a3b8',
              fontSize: '12px',
              fontWeight: 700
            }}>
              <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }} />
              <span>hoặc dùng Email</span>
              <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }} />
            </div>
          </>
        )}

        {/* Feedback Message */}
        {errorMsg && (
          <div className="animate-shake" style={{
            background: '#fef2f2',
            border: '2px solid #fecaca',
            color: '#b91c1c',
            padding: '10px 14px',
            borderRadius: '12px',
            fontSize: '13px',
            fontWeight: 700,
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <AlertCircle size={16} style={{ flexShrink: 0 }} />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="animate-pop-in" style={{
            background: '#f0fdf4',
            border: '2px solid #bbf7d0',
            color: '#15803d',
            padding: '10px 14px',
            borderRadius: '12px',
            fontSize: '13px',
            fontWeight: 700,
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <CheckCircle2 size={16} style={{ flexShrink: 0 }} />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleEmailAuth} autoComplete="off">
          {/* Decoy hidden inputs to absorb browser autofill */}
          <div style={{ position: 'absolute', opacity: 0, height: 0, width: 0, zIndex: -1, pointerEvents: 'none' }} aria-hidden="true">
            <input type="text" name="chrome_decoy_email" tabIndex={-1} autoComplete="username" />
            <input type="password" name="chrome_decoy_pass" tabIndex={-1} autoComplete="current-password" />
          </div>

          {mode === 'register' && (
            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 800, color: '#334155', marginBottom: '6px' }}>
                Tên Của Bé hoặc Ba Mẹ:
              </label>
              <div style={{ position: 'relative' }}>
                <User size={18} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="text"
                  name="kid_fullname_field"
                  autoComplete="off"
                  placeholder="Vd: Bé Bắp, Minh Anh..."
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px 10px 38px',
                    borderRadius: '12px',
                    border: '2px solid #cbd5e1',
                    fontSize: '14px',
                    outline: 'none',
                    fontWeight: 600,
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            </div>
          )}

          <div style={{ marginBottom: '14px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 800, color: '#334155', marginBottom: '6px' }}>
              Địa chỉ Email:
            </label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                inputMode="email"
                name="kid_auth_email_unique"
                autoComplete="one-time-code"
                readOnly={isEmailReadOnly}
                onFocus={() => setIsEmailReadOnly(false)}
                placeholder="ba_me@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '10px 12px 10px 38px',
                  borderRadius: '12px',
                  border: '2px solid #cbd5e1',
                  fontSize: '14px',
                  outline: 'none',
                  fontWeight: 600,
                  boxSizing: 'border-box'
                }}
              />
            </div>
          </div>

          {mode !== 'forgot' && (
            <div style={{ marginBottom: '12px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 800, color: '#334155', marginBottom: '6px' }}>
                Mật khẩu {mode === 'register' ? '(Tối thiểu 6 ký tự)' : ''}:
              </label>
              <div style={{ position: 'relative' }}>
                <Lock size={18} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="kid_auth_password_unique"
                  autoComplete="new-password"
                  readOnly={isPasswordReadOnly}
                  onFocus={() => setIsPasswordReadOnly(false)}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '10px 38px 10px 38px',
                    borderRadius: '12px',
                    border: '2px solid #cbd5e1',
                    fontSize: '14px',
                    outline: 'none',
                    fontWeight: 600,
                    boxSizing: 'border-box'
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: '#94a3b8',
                    cursor: 'pointer',
                    padding: 0
                  }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
          )}

          {/* Forgot Password Link on Login Form */}
          {mode === 'login' && (
            <div style={{ textAlign: 'right', marginBottom: '18px' }}>
              <button
                type="button"
                onClick={() => {
                  sounds.playClick();
                  setMode('forgot');
                  setErrorMsg('');
                  setSuccessMsg('');
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#0284c7',
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  textDecoration: 'underline',
                  padding: 0
                }}
              >
                Quên mật khẩu?
              </button>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className={`btn-kid ${mode === 'login' ? 'btn-blue' : mode === 'register' ? 'btn-purple' : 'btn-yellow'}`}
            style={{
              width: '100%',
              padding: '12px',
              fontSize: '15px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              cursor: isLoading ? 'wait' : 'pointer'
            }}
          >
            {isLoading ? (
              <span>Đang xử lý...</span>
            ) : mode === 'login' ? (
              <>
                <LogIn size={18} />
                <span>Đăng Nhập Khám Phá ⭐</span>
              </>
            ) : mode === 'register' ? (
              <>
                <Sparkles size={18} />
                <span>Tạo Tài Khoản Cho Bé 🚀</span>
              </>
            ) : (
              <>
                <KeyRound size={18} />
                <span>Gửi Email Khôi Phục Mật Khẩu 📨</span>
              </>
            )}
          </button>
        </form>

        {/* Back to Login button when in forgot mode */}
        {mode === 'forgot' && (
          <div style={{ textAlign: 'center', marginTop: '16px' }}>
            <button
              type="button"
              onClick={() => {
                sounds.playClick();
                setMode('login');
                setErrorMsg('');
                setSuccessMsg('');
              }}
              style={{
                background: 'none',
                border: 'none',
                color: '#64748b',
                fontSize: '13px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <ArrowLeft size={15} />
              <span>Quay lại Đăng Nhập</span>
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
