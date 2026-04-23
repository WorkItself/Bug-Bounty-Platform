import { useState } from 'react';
import { useUser } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
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
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.email && formData.name && formData.password) {
      setError('');
      register(formData.name, 'user');
      navigate('/');
    }
  };

  const focusHandler = (e: React.FocusEvent<HTMLInputElement>) => e.currentTarget.style.borderColor = '#3F3AFC';
  const blurHandler = (e: React.FocusEvent<HTMLInputElement>) => e.currentTarget.style.borderColor = '#D1D5DB';

  return (
    <div className={styles.container}>
      <div className={styles.formWrapper}>
        <h1 className={styles.title}>Create Account</h1>
        <p className={styles.subtitle}>Join BountyOS as a security researcher</p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div>
            <label className={styles.label}>Full Name</label>
            <input name="name" value={formData.name} onChange={handleChange} placeholder="Enter your full name" style={inputStyle} onFocus={focusHandler} onBlur={blurHandler} />
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
            Create Account
          </button>
        </form>

        <div className={styles.loginLinkWrapper}>
          <p>Already have an account?</p>
          <a href="/login" className={styles.loginLink}>
            Login here
          </a>
        </div>
      </div>
    </div>
  );
};

export default Register;