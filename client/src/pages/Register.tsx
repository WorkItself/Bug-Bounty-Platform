import { useState } from 'react';
import { useUser } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import styles from './Register.module.css';
import Button from '../components/Button';
import Input from '../components/Input';

interface CompanyDetails {
  legalName: string;
  registrationNumber: string;
  jurisdiction: string;
  taxId: string;
}

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
  const [companyDetails, setCompanyDetails] = useState<CompanyDetails>({
    legalName: '',
    registrationNumber: '',
    jurisdiction: '',
    taxId: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCompanyDetailsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCompanyDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.userType === 'company') {
      if (!companyDetails.legalName || !companyDetails.registrationNumber || 
          !companyDetails.jurisdiction || !companyDetails.taxId) {
        setError('All company details are required');
        return;
      }
    }

    if (formData.email && formData.name && formData.password) {
      setError('');
      register(formData.name, formData.userType, formData.userType === 'company' ? companyDetails : undefined);
      navigate('/');
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

          {formData.userType === 'company' && (
            <div style={{ 
              background: 'linear-gradient(135deg, #1B3A57 0%, #0C1A30 100%)',
              padding: '1.5rem',
              borderRadius: '0.75rem',
              border: '1px solid #009B77',
              marginBottom: '1rem'
            }}>
              <h3 style={{ color: '#FFFFFF', marginBottom: '1rem', fontSize: '1.1rem', fontWeight: '600' }}>
                Legal Entity Information
              </h3>
              
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ color: '#A2DFF7', display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                  Legal Company Name
                </label>
                <Input
                  name="legalName"
                  value={companyDetails.legalName}
                  onChange={handleCompanyDetailsChange}
                  placeholder="e.g., TechCorp Inc."
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ color: '#A2DFF7', display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                  Business Registration Number
                </label>
                <Input
                  name="registrationNumber"
                  value={companyDetails.registrationNumber}
                  onChange={handleCompanyDetailsChange}
                  placeholder="e.g., REG-2025-001"
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ color: '#A2DFF7', display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                  Jurisdiction
                </label>
                <Input
                  name="jurisdiction"
                  value={companyDetails.jurisdiction}
                  onChange={handleCompanyDetailsChange}
                  placeholder="e.g., United States"
                />
              </div>

              <div>
                <label style={{ color: '#A2DFF7', display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                  Tax ID / EIN
                </label>
                <Input
                  name="taxId"
                  value={companyDetails.taxId}
                  onChange={handleCompanyDetailsChange}
                  placeholder="e.g., 12-3456789"
                />
              </div>
            </div>
          )}

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