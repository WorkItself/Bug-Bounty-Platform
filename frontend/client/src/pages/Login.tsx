import { useState } from 'react';
import { useUser } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import styles from './Login.module.css';

const Login = () => {
  const { login } = useUser();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target as HTMLInputElement;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.username && formData.password) {
      const loggedIn = login(formData.username, formData.password);
      if (loggedIn) {
        navigate('/dashboard');
      } else {
        setError('Invalid username or password');
      }
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.formWrapper}>
        <h1 className={styles.title}>Secure Access</h1>
        <p className={styles.subtitle}>Enter your credentials to continue</p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div>
            <label className={styles.label}>Username</label>
            <input
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Your username"
              style={{
                width: '100%', padding: '0.7rem 0.85rem',
                background: '#fff', border: '1.5px solid #D1D5DB',
                borderRadius: '8px', color: '#111', fontSize: '0.95rem',
                fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box',
                transition: 'border-color 0.2s',
              }}
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
              style={{
                width: '100%', padding: '0.7rem 0.85rem',
                background: '#fff', border: '1.5px solid #D1D5DB',
                borderRadius: '8px', color: '#111', fontSize: '0.95rem',
                fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box',
                transition: 'border-color 0.2s',
              }}
              onFocus={e => e.currentTarget.style.borderColor = '#3F3AFC'}
              onBlur={e => e.currentTarget.style.borderColor = '#D1D5DB'}
            />
          </div>

          {error && <p className={styles.error}>{error}</p>}

          <button
            type="submit"
            style={{
              padding: '0.7rem 1.5rem',
              background: '#3F3AFC', color: '#fff',
              border: 'none', borderRadius: '8px',
              fontWeight: 600, fontSize: '0.95rem',
              cursor: 'pointer', transition: 'all 0.2s ease',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#2F2AEC'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = '#3F3AFC'; (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; }}
          >
            Login
          </button>

          <div style={{ textAlign: 'center', marginTop: '0.5rem' }}>
            <a
              href="/forgot-password"
              style={{
                color: '#3F3AFC',
                textDecoration: 'none',
                fontSize: '0.88rem',
                fontWeight: 500,
                transition: 'opacity 0.2s',
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.opacity = '0.7'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.opacity = '1'; }}
            >
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