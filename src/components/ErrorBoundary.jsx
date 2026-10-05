import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
          background: 'linear-gradient(180deg, #60a5fa 0%, #34d399 100%)',
          fontFamily: 'Nunito, sans-serif'
        }}>
          <div style={{
            background: '#ffffff',
            borderRadius: '28px',
            padding: '40px 32px',
            maxWidth: '500px',
            width: '100%',
            textAlign: 'center',
            boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
            border: '4px solid #ffffff'
          }}>
            <div style={{ fontSize: '64px', marginBottom: '16px' }} className="animate-bounce-slow">
              🚀
            </div>
            <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#1e293b', marginBottom: '12px' }}>
              Ối! Có một trục trặc nhỏ rồi bé ơi!
            </h2>
            <p style={{ fontSize: '14px', color: '#64748b', lineHeight: 1.6, marginBottom: '24px' }}>
              Hệ thống vừa gặp phải một sự cố nhỏ ngoài ý muốn. Bé hoặc ba mẹ hãy bấm nút bên dưới để tải lại trang chủ ngay nhé!
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button
                onClick={this.handleReset}
                className="btn-kid btn-green"
                style={{ padding: '12px 28px', fontSize: '15px' }}
              >
                🔄 Tải Lại Trang Chủ
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
