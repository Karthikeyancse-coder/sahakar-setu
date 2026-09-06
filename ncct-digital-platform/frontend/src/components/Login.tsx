import React, { useState } from 'react';
import { loginUser } from '../services/api';

interface LoginProps {
  onLoginSuccess: () => void;
  onSwitchToRegister: () => void;
}

export const Login: React.FC<LoginProps> = ({ onLoginSuccess, onSwitchToRegister }) => {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await loginUser(phone, password);
      setLoading(false);
      onLoginSuccess();
    } catch (err: any) {
      setLoading(false);
      if (err.response?.data?.detail) {
        setError(err.response.data.detail);
      } else {
        setError('Failed to connect to the server.');
      }
    }
  };

  return (
    <div style={styles.container}>
      {/* Left Minimalist Graphic Panel */}
      <div style={styles.leftPanel}>
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <div style={styles.dot}></div>
            <div style={styles.line}></div>
          </div>
          <div style={styles.cardBody}>
            <div style={styles.iconBox}>✦</div>
            <h3 style={styles.cardTitle}>Architectural Simplicity</h3>
            <p style={styles.cardText}>
              Designed with strict geometric balance, muted tones, and uncompromising minimalism for the NCCT platform.
            </p>
          </div>
          <div style={styles.cardFooter}>
            <div style={styles.footerBar}></div>
            <div style={styles.footerDot}></div>
            <div style={styles.footerDot}></div>
          </div>
        </div>
      </div>

      {/* Right Form Panel */}
      <div style={styles.rightPanel}>
        <div style={styles.formWrapper}>
          <div style={styles.headerArea}>
            <div style={styles.logoIcon}>✦</div>
            <h2 style={styles.title}>NCCT Digital Platform</h2>
            <p style={styles.subtitle}>Sign in to your account</p>
          </div>

          {error && <div style={styles.errorBox}>{error}</div>}

          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Phone Number</label>
              <input
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Enter phone number"
                style={styles.input}
              />
            </div>

            <div style={styles.inputGroup}>
              <div style={styles.labelRow}>
                <label style={styles.label}>Password</label>
                <span style={styles.forgot}>Forgot Password?</span>
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder=""
                style={styles.input}
              />
            </div>

            <button type="submit" disabled={loading} style={styles.button}>
              {loading ? 'Signing in...' : 'Sign In →'}
            </button>
          </form>

          <div style={styles.footerText}>
            Don't have an account?{' '}
            <button onClick={onSwitchToRegister} style={styles.linkButton}>
              Register here
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    minHeight: '100vh',
    backgroundColor: '#f4f4f0', // Soft warm stone background
    color: '#2d3748',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  leftPanel: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e8ece9', // Gentle sage-gray tinted backdrop
    borderRight: '1px solid #d9dedb',
    padding: '40px',
  },
  card: {
    width: '100%',
    maxWidth: '420px',
    aspectRatio: '4 / 3',
    backgroundColor: '#fafbfc', // Clean porcelain white card
    border: '1px solid #d4dec9', // Subtle sage border accent
    borderRadius: '24px',
    padding: '32px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    boxShadow: '0 20px 40px rgba(74, 85, 104, 0.05)',
  },
  dot: {
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    backgroundColor: '#cbd5e1',
  },
  line: {
    width: '50px',
    height: '4px',
    borderRadius: '2px',
    backgroundColor: '#e2e8f0',
  },
  cardBody: {
    margin: 'auto 0',
  },
  iconBox: {
    width: '48px',
    height: '48px',
    borderRadius: '12px',
    backgroundColor: '#e2ede6', // Soft muted green tint
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '20px',
    color: '#3b5343',
    marginBottom: '20px',
    border: '1px solid #c8d8ce',
  },
  cardTitle: {
    fontSize: '20px',
    fontWeight: 400,
    color: '#2d3748',
    marginBottom: '10px',
  },
  cardText: {
    fontSize: '14px',
    color: '#718096',
    lineHeight: '1.5',
    fontWeight: 300,
  },
  cardFooter: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  footerBar: {
    width: '32px',
    height: '6px',
    borderRadius: '3px',
    backgroundColor: '#94a3b8',
  },
  footerDot: {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    backgroundColor: '#cbd5e1',
  },
  rightPanel: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px',
  },
  formWrapper: {
    width: '100%',
    maxWidth: '380px',
  },
  headerArea: {
    marginBottom: '32px',
  },
  logoIcon: {
    width: '36px',
    height: '36px',
    borderRadius: '10px',
    backgroundColor: '#e2ede6',
    border: '1px solid #c8d8ce',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '16px',
    marginBottom: '20px',
    color: '#3b5343',
  },
  title: {
    fontSize: '22px',
    fontWeight: 600,
    color: '#1a202c',
    marginBottom: '6px',
  },
  subtitle: {
    fontSize: '14px',
    color: '#718096',
  },
  errorBox: {
    padding: '12px',
    backgroundColor: '#fff5f5',
    border: '1px solid #fed7d7',
    color: '#c53030',
    fontSize: '12px',
    borderRadius: '10px',
    marginBottom: '20px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  label: {
    fontSize: '12px',
    fontWeight: 500,
    color: '#4a5568',
  },
  labelRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  forgot: {
    fontSize: '12px',
    color: '#718096',
    cursor: 'pointer',
  },
  input: {
    width: '100%',
    padding: '12px 16px',
    backgroundColor: '#ffffff',
    border: '1px solid #cbd5e1',
    borderRadius: '10px',
    color: '#1a202c',
    fontSize: '14px',
    outline: 'none',
    boxSizing: 'border-box',
    boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.02)',
  },
  button: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#3b5343', // Deep natural sage-green primary button
    color: '#ffffff',
    border: 'none',
    borderRadius: '10px',
    fontSize: '14px',
    fontWeight: 500,
    cursor: 'pointer',
    marginTop: '8px',
  },
  footerText: {
    marginTop: '24px',
    textAlign: 'center',
    fontSize: '12px',
    color: '#718096',
    borderTop: '1px solid #e2e8f0',
    paddingTop: '20px',
  },
  linkButton: {
    background: 'none',
    border: 'none',
    color: '#3b5343',
    fontWeight: 600,
    cursor: 'pointer',
    fontSize: '12px',
    padding: 0,
    marginLeft: '4px',
  },
};