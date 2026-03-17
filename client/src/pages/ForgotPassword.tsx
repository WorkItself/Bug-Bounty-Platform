import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Login.module.css';
import Button from '../components/Button';
import Input from '../components/Input';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setError('');
      setSubmitted(true);
    } else {
      setError('Please enter your email address');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.formWrapper}>
        <button
          onClick={() => navigate('/login')}
          style={{
            marginBottom: '1rem',
            padding: '0.5rem 1rem',
            background: '#009B77',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: '0.5rem',
            cursor: 'pointer',
            fontWeight: '600',
            fontSize: '0.9rem',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            (e.target as HTMLElement).style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            (e.target as HTMLElement).style.transform = 'translateY(0)';
          }}
        >
          ← Back to Login
        </button>

        {!submitted ? (
          <>
            <h1 className={styles.title}>Forgot Your Password?</h1>
            <p className={styles.subtitle}>Enter your email address and we'll send you a password reset link</p>

            <form onSubmit={handleSubmit} className={styles.form}>
              <div>
                <label className={styles.label}>Email Address</label>
                <Input
                  type="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                />
              </div>

              {error && <p className={styles.error}>{error}</p>}

              <Button type="submit">
                Send Reset Link
              </Button>

              <p className={styles.registerLink}>
                Don't have an account? <a href="/register">Register here</a>
              </p>
            </form>
          </>
        ) : (
          <div style={{ textAlign: 'center' }}>
            <h1 className={styles.title}>Check Your Email</h1>
            <p className={styles.subtitle} style={{ marginBottom: '2rem' }}>
              We've sent a password reset link to <strong style={{ color: '#A2DFF7' }}>{email}</strong>
            </p>
            <p style={{
              color: '#A2DFF7',
              fontSize: '0.95rem',
              lineHeight: '1.6',
              marginBottom: '2rem'
            }}>
              If you don't see the email, please check your spam folder or try again in a few minutes.
            </p>
            <button
              onClick={() => navigate('/login')}
              style={{
                padding: '0.75rem 1.5rem',
                background: '#009B77',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '0.5rem',
                fontWeight: '600',
                cursor: 'pointer',
                fontSize: '1rem',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                (e.target as HTMLElement).style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLElement).style.transform = 'translateY(0)';
              }}
            >
              Return to Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
