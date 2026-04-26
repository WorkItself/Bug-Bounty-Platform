import { useState } from 'react';
import { useUser } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import styles from './Login.module.css';

const Login = () => {
  const { login } = useUser();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ credential: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.credential || !formData.password) return;
    setLoading(true);
    setError('');
    const ok = await login(formData.credential, formData.password);
    setLoading(false);
    if (ok) {
      navigate('/dashboard');
    } else {
      setError('Invalid username or password');
    }
  };

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '0.7rem 0.85rem',
    background: '#fff', border: '1.5px solid #D1D5DB',
    borderRadius: '8px', color: '#111', fontSize: '0.95rem',
    fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box',
    transition: 'border-color 0.2s',
  };

  return (
    <div className={styles.container}>
      <div className={styles.formWrapper}>
        <h1 className={styles.title}>Secure Access</h1>
        <p className={styles.subtitle}>Enter your credentials to continue</p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div>
            <label className={styles.label}>Username or Email</label>
            <input
              name="credential"
              value={formData.credential}
              onChange={handleChange}
              placeholder="Your username or email"
              style={inputStyle}
              onFocus={e => e.currentTarget.style.borderColor = '#3F3AFC'}
              onBlur={e => e.currentTarget.style.borderColor = '#D1D5DB'}
            />
          </div>

          <div>
            <label className={styles.label}>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Your password"
              style={inputStyle}
              onFocus={e => e.currentTarget.style.borderColor = '#3F3AFC'}
              onBlur={e => e.currentTarget.style.borderColor = '#D1D5DB'}
            />
          </div>

          {error && <p className={styles.error}>{error}</p>}

          <button
            type="submit"
            disabled={loading}
            style={{
              padding: '0.7rem 1.5rem',
              background: loading ? '#9CA3AF' : '#3F3AFC', color: '#fff',
              border: 'none', borderRadius: '8px',
              fontWeight: 600, fontSize: '0.95rem',
              cursor: loading ? 'not-allowed' : 'pointer', transition: 'all 0.2s ease',
            }}
            onMouseEnter={e => { if (!loading) (e.currentTarget as HTMLElement).style.background = '#2F2AEC'; }}
            onMouseLeave={e => { if (!loading) (e.currentTarget as HTMLElement).style.background = '#3F3AFC'; }}
          >
            {loading ? 'Logging in…' : 'Login'}
          </button>

          <div style={{ textAlign: 'center', marginTop: '0.5rem' }}>
            <a href="/forgot-password" style={{ color: '#3F3AFC', textDecoration: 'none', fontSize: '0.88rem', fontWeight: 500 }}>
              Forgot your password?
            </a>
          </div>

          <p className={styles.registerLink}>
            Don't have an account?{' '}
            <button type="button" onClick={() => navigate('/choose-role')}>
              Register here
            </button>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
