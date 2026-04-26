import { useState } from 'react';
import { useUser } from '../context/UserContext';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from './Register.module.css';

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '0.7rem 0.85rem',
  background: '#fff', border: '1.5px solid #D1D5DB',
  borderRadius: '8px', color: '#111', fontSize: '0.95rem',
  fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box',
  transition: 'border-color 0.2s',
};

const Register = () => {
  const { register } = useUser();
  const navigate = useNavigate();
  const location = useLocation();
  const role: string = (location.state as any)?.role ?? 'user';

  const [formData, setFormData] = useState({ userName: '', email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (!formData.userName || !formData.email || !formData.password) return;

    setLoading(true);
    setError('');
    const result = await register(formData.userName, formData.email, formData.password, role);
    setLoading(false);

    if (result.success) {
      navigate('/login');
    } else {
      setError(typeof result.message === 'string' ? result.message : 'Registration failed.');
    }
  };

  const focusHandler = (e: React.FocusEvent<HTMLInputElement>) => e.currentTarget.style.borderColor = '#3F3AFC';
  const blurHandler = (e: React.FocusEvent<HTMLInputElement>) => e.currentTarget.style.borderColor = '#D1D5DB';

  return (
    <div className={styles.container}>
      <div className={styles.formWrapper}>
        <h1 className={styles.title}>Create Account</h1>
        <p className={styles.subtitle}>
          {role === 'company' ? 'Join BountyOS as a company' : 'Join BountyOS as a security researcher'}
        </p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div>
            <label className={styles.label}>Username</label>
            <input name="userName" value={formData.userName} onChange={handleChange} placeholder="Choose a username" style={inputStyle} onFocus={focusHandler} onBlur={blurHandler} />
          </div>

          <div>
            <label className={styles.label}>Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="your@email.com" style={inputStyle} onFocus={focusHandler} onBlur={blurHandler} />
          </div>

          <div>
            <label className={styles.label}>Password</label>
            <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Enter your password" style={inputStyle} onFocus={focusHandler} onBlur={blurHandler} />
          </div>

          <div>
            <label className={styles.label}>Confirm Password</label>
            <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="Confirm your password" style={inputStyle} onFocus={focusHandler} onBlur={blurHandler} />
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
            {loading ? 'Creating account…' : 'Create Account'}
          </button>
        </form>

        <div className={styles.loginLinkWrapper}>
          <p>Already have an account?</p>
          <a href="/login" className={styles.loginLink}>Login here</a>
        </div>
      </div>
    </div>
  );
};

export default Register;
