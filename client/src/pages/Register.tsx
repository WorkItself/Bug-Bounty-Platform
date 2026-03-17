import { useState } from 'react';
import { useUser } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import styles from './Register.module.css';
import Button from '../components/Button';
import Input from '../components/Input';

const Register = () => {
  const { register } = useUser();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    userType: 'hacker' as 'hacker' | 'company',
  });
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target as HTMLInputElement;
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
      register(formData.name, formData.userType);
      navigate('/dashboard');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.formWrapper}>
        <h1 className={styles.title}>Create Account</h1>
        <p className={styles.subtitle}>Join the bug bounty platform today</p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div>
            <label className={styles.label}>Full Name</label>
            <Input
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
            />
          </div>

          <div>
            <label className={styles.label}>Email</label>
            <Input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="your@email.com"
            />
          </div>

          <div>
            <label className={styles.label}>Password</label>
            <Input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
            />
          </div>

          <div>
            <label className={styles.label}>Confirm Password</label>
            <Input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
            />
          </div>

          <div>
            <label className={styles.label}>Account Type</label>
            <div className={styles.radioGrid}>
              <label className={styles.radioLabel}>
                <input
                  type="radio"
                  name="userType"
                  value="hacker"
                  checked={formData.userType === 'hacker'}
                  onChange={handleChange}
                  className={styles.radioInput}
                />
                <div className={`${styles.radioCard} ${formData.userType === 'hacker' ? styles.radioCardActive : ''}`}>
                  <div className={styles.radioIcon}>🎯</div>
                  <h3 className={styles.radioTitle}>Bug Bounty Hunter</h3>
                  <p className={styles.radioSubtitle}>Find vulnerabilities and earn rewards</p>
                </div>
              </label>

              <label className={styles.radioLabel}>
                <input
                  type="radio"
                  name="userType"
                  value="company"
                  checked={formData.userType === 'company'}
                  onChange={handleChange}
                  className={styles.radioInput}
                />
                <div className={`${styles.radioCard} ${formData.userType === 'company' ? styles.radioCardActive : ''}`}>
                  <div className={styles.radioIcon}>🏢</div>
                  <h3 className={styles.radioTitle}>Company</h3>
                  <p className={styles.radioSubtitle}>Create a bounty program</p>
                </div>
              </label>
            </div>
          </div>

          {error && <p className={styles.error}>{error}</p>}

          <Button type="submit">
            Create Account
          </Button>
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