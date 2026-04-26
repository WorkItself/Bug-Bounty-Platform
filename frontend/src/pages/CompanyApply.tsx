import { useState } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '0.7rem 0.85rem',
  background: '#fff', border: '1.5px solid #D1D5DB',
  borderRadius: '8px', color: '#111', fontSize: '0.95rem',
  fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box',
  transition: 'border-color 0.2s',
};

const Section = ({ title }: { title: string }) => (
  <div style={{ margin: '1.5rem 0 0.75rem', paddingBottom: '0.4rem', borderBottom: '1px solid #E5E7EB' }}>
    <p style={{ margin: 0, fontSize: '0.78rem', fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{title}</p>
  </div>
);

const CompanyApply = () => {

  const [form, setForm] = useState({
    userName: '', email: '', password: '', confirmPassword: '',
    legalName: '', displayName: '', legalAddress: '', city: '', country: '',
    postalCode: '', website: '', description: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) { setError('Passwords do not match.'); return; }
    setLoading(true); setError('');
    try {
      await axiosInstance.post('/company/apply', {
        userName: form.userName, email: form.email, password: form.password,
        legalName: form.legalName, displayName: form.displayName || null,
        legalAddress: form.legalAddress, city: form.city, country: form.country,
        postalCode: form.postalCode || null,
        website: form.website || null, description: form.description || null,
      });
      setSubmitted(true);
    } catch (err: any) {
      const d = err.response?.data;
      const msg = d?.message ?? d?.title ?? (typeof d === 'string' ? d : null) ?? err.message ?? 'Submission failed.';
      setError(msg);
    } finally { setLoading(false); }
  };

  const focus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => e.currentTarget.style.borderColor = '#E81C79';
  const blur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => e.currentTarget.style.borderColor = '#D1D5DB';

  if (submitted) {
    return (
      <div style={{ minHeight: '100vh', background: '#F7F9FC', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
        <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #E5E7EB', padding: '3rem 2.5rem', maxWidth: '480px', width: '100%', textAlign: 'center', boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎉</div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#111', margin: '0 0 0.75rem' }}>Application Submitted</h1>
          <p style={{ color: '#6B7280', lineHeight: 1.6, margin: '0 0 1.5rem' }}>
            Your company application is under review. An admin will verify your details and approve your account. You'll be able to log in once approved.
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/login" style={{ display: 'inline-block', padding: '0.7rem 2rem', background: '#E81C79', color: '#fff', borderRadius: '8px', textDecoration: 'none', fontWeight: 700 }}>
              Back to Login
            </Link>
            <Link to="/" style={{ display: 'inline-block', padding: '0.7rem 2rem', background: 'transparent', color: '#6B7280', border: '1px solid #D1D5DB', borderRadius: '8px', textDecoration: 'none', fontWeight: 600 }}>
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#F7F9FC', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '2rem 1rem', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
      <div style={{ width: '100%', maxWidth: '600px', marginBottom: '0.5rem' }}>
        <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', color: '#6B7280', textDecoration: 'none', fontSize: '0.85rem' }}>
          ← Back to home
        </Link>
      </div>
      <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem' }}>
        <div style={{ width: '32px', height: '32px', background: 'linear-gradient(135deg, #3F3AFC, #E81C79)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', fontWeight: 900, color: '#fff' }}>B</div>
        <span style={{ fontSize: '1.15rem', fontWeight: 800, color: '#111' }}>BountyOS</span>
      </Link>

      <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #E5E7EB', padding: '2.5rem', width: '100%', maxWidth: '600px', boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#111', margin: '0 0 0.4rem' }}>Company Application</h1>
        <p style={{ fontSize: '0.93rem', color: '#6B7280', margin: '0 0 0.25rem', lineHeight: 1.5 }}>
          Fill in your legal and account details. An admin will review and approve your account.
        </p>

        <form onSubmit={handleSubmit}>
          <Section title="Account credentials" />

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#374151', marginBottom: '0.35rem' }}>Username *</label>
            <input name="userName" value={form.userName} onChange={handleChange} onFocus={focus} onBlur={blur} placeholder="Choose a username" required style={inputStyle} />
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#374151', marginBottom: '0.35rem' }}>Email *</label>
            <input type="email" name="email" value={form.email} onChange={handleChange} onFocus={focus} onBlur={blur} placeholder="company@example.com" required style={inputStyle} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#374151', marginBottom: '0.35rem' }}>Password *</label>
              <input type="password" name="password" value={form.password} onChange={handleChange} onFocus={focus} onBlur={blur} placeholder="Min 8 characters" required style={inputStyle} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#374151', marginBottom: '0.35rem' }}>Confirm Password *</label>
              <input type="password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} onFocus={focus} onBlur={blur} placeholder="Repeat password" required style={inputStyle} />
            </div>
          </div>

          <Section title="Legal information" />

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#374151', marginBottom: '0.35rem' }}>Legal Company Name *</label>
            <input name="legalName" value={form.legalName} onChange={handleChange} onFocus={focus} onBlur={blur} placeholder="Acme Corp LLC" required style={inputStyle} />
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#374151', marginBottom: '0.35rem' }}>Display Name</label>
            <input name="displayName" value={form.displayName} onChange={handleChange} onFocus={focus} onBlur={blur} placeholder="How it appears on the platform (optional)" style={inputStyle} />
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#374151', marginBottom: '0.35rem' }}>Legal Address *</label>
            <input name="legalAddress" value={form.legalAddress} onChange={handleChange} onFocus={focus} onBlur={blur} placeholder="123 Main Street" required style={inputStyle} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#374151', marginBottom: '0.35rem' }}>City *</label>
              <input name="city" value={form.city} onChange={handleChange} onFocus={focus} onBlur={blur} placeholder="New York" required style={inputStyle} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#374151', marginBottom: '0.35rem' }}>Country *</label>
              <input name="country" value={form.country} onChange={handleChange} onFocus={focus} onBlur={blur} placeholder="US" required style={inputStyle} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#374151', marginBottom: '0.35rem' }}>Postal Code</label>
              <input name="postalCode" value={form.postalCode} onChange={handleChange} onFocus={focus} onBlur={blur} placeholder="10001" style={inputStyle} />
            </div>
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#374151', marginBottom: '0.35rem' }}>Website</label>
            <input name="website" value={form.website} onChange={handleChange} onFocus={focus} onBlur={blur} placeholder="https://acme.com" style={inputStyle} />
          </div>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#374151', marginBottom: '0.35rem' }}>About Your Company</label>
            <textarea name="description" value={form.description} onChange={handleChange} onFocus={focus} onBlur={blur} placeholder="Brief description of your company and security program goals (optional)" rows={3} style={{ ...inputStyle, resize: 'vertical' }} />
          </div>

          {error && <p style={{ color: '#ef4444', fontSize: '0.9rem', marginBottom: '1rem' }}>{error}</p>}

          <button type="submit" disabled={loading} style={{ width: '100%', padding: '0.75rem', background: loading ? '#9CA3AF' : '#E81C79', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 700, fontSize: '1rem', cursor: loading ? 'not-allowed' : 'pointer', transition: 'background 0.2s' }}>
            {loading ? 'Submitting…' : 'Submit Application'}
          </button>
        </form>

        <p style={{ textAlign: 'center', color: '#6B7280', fontSize: '0.9rem', margin: '1.25rem 0 0' }}>
          Already approved? <Link to="/login" style={{ color: '#E81C79', textDecoration: 'none', fontWeight: 600 }}>Login here</Link>
        </p>
      </div>
    </div>
  );
};

export default CompanyApply;
