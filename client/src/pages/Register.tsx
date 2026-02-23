import { useState } from 'react';
import { useUser } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import { CompanyDetails } from '../context/UserContext';
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
    // Company-specific fields
    companyName: '',
    registrationNumber: '',
    taxId: '',
    address: '',
    country: '',
    contactPerson: '',
    phone: '',
  });
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.userType === 'company') {
      if (!formData.companyName || !formData.registrationNumber || !formData.taxId || !formData.address || !formData.country || !formData.contactPerson || !formData.phone) {
        setError('Please fill in all company details');
        return;
      }
    }

    if (formData.email && formData.name && formData.password) {
      setError('');
      
      const companyDetails: CompanyDetails | undefined = formData.userType === 'company' ? {
        companyName: formData.companyName,
        registrationNumber: formData.registrationNumber,
        taxId: formData.taxId,
        address: formData.address,
        country: formData.country,
        contactPerson: formData.contactPerson,
        phone: formData.phone,
      } : undefined;

      register(formData.userType === 'company' ? formData.companyName : formData.name, formData.userType, companyDetails);
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

          {/* Company Details - Only show if userType is 'company' */}
          {formData.userType === 'company' && (
            <div style={{ marginTop: '2rem', padding: '1.5rem', background: '#0C1A30', borderRadius: '0.5rem', border: '1px solid #009B77' }}>
              <h3 style={{ color: '#FFFFFF', marginTop: 0, marginBottom: '1rem' }}>Company Information</h3>
              
              <div>
                <label className={styles.label}>Company Name</label>
                <Input
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  placeholder="Your company name"
                />
              </div>

              <div>
                <label className={styles.label}>Registration Number</label>
                <Input
                  name="registrationNumber"
                  value={formData.registrationNumber}
                  onChange={handleChange}
                  placeholder="Company registration number"
                />
              </div>

              <div>
                <label className={styles.label}>Tax ID</label>
                <Input
                  name="taxId"
                  value={formData.taxId}
                  onChange={handleChange}
                  placeholder="Tax identification number"
                />
              </div>

              <div>
                <label className={styles.label}>Address</label>
                <Input
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Company address"
                />
              </div>

              <div>
                <label className={styles.label}>Country</label>
                <Input
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  placeholder="Country"
                />
              </div>

              <div>
                <label className={styles.label}>Contact Person</label>
                <Input
                  name="contactPerson"
                  value={formData.contactPerson}
                  onChange={handleChange}
                  placeholder="Contact person name"
                />
              </div>

              <div>
                <label className={styles.label}>Phone</label>
                <Input
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Contact phone number"
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