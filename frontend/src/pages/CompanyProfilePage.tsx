import { useState, useEffect } from 'react';
import { useUser } from '../context/UserContext';
import axiosInstance from '../utils/axiosInstance';

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '0.65rem 0.85rem',
  background: '#fff', border: '1.5px solid #D1D5DB',
  borderRadius: '8px', color: '#111', fontSize: '0.92rem',
  fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box',
  transition: 'border-color 0.2s',
};
const labelStyle: React.CSSProperties = {
  display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#374151', marginBottom: '0.3rem',
};
const cardStyle: React.CSSProperties = {
  background: '#fff', borderRadius: '12px', border: '1px solid #E5E7EB',
  padding: '1.75rem', boxShadow: '0 2px 12px rgba(0,0,0,0.05)', marginBottom: '1.25rem',
};

const toSlug = (str: string) =>
  str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

interface CompanyForm {
  handle: string; legalName: string; displayName: string;
  legalAddress: string; city: string; country: string;
  postalCode: string; description: string;
}

const CompanyProfilePage = () => {
  const { user } = useUser();
  const [form, setForm] = useState<CompanyForm>({
    handle: '', legalName: '', displayName: '', legalAddress: '',
    city: '', country: '', postalCode: '', description: '',
  });
  const [handleTouched, setHandleTouched] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user.isLoggedIn) return;
    axiosInstance.get('/company/profile')
      .then(res => {
        const d = res.data;
        setForm({
          handle: d.handle ?? '',
          legalName: d.legalName ?? '',
          displayName: d.displayName ?? '',
          legalAddress: d.legalAddress ?? '',
          city: d.city ?? '',
          country: d.country ?? '',
          postalCode: d.postalCode ?? '',
          description: d.description ?? '',
        });
      })
      .catch(() => setError('Failed to load company profile.'))
      .finally(() => setLoading(false));
  }, [user.isLoggedIn]);

  const focus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => e.currentTarget.style.borderColor = '#E81C79';
  const blur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => e.currentTarget.style.borderColor = '#D1D5DB';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => {
      const next = { ...prev, [name]: value };
      if (name === 'displayName' && !handleTouched) next.handle = toSlug(value);
      return next;
    });
  };

  const handleHandleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHandleTouched(true);
    setForm(prev => ({ ...prev, handle: toSlug(e.target.value) }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true); setMsg(''); setError('');
    try {
      await axiosInstance.put('/company/profile', form);
      setMsg('Profile updated successfully.');
    } catch (err: any) {
      const d = err.response?.data;
      setError(d?.message ?? 'Update failed.');
    } finally { setSaving(false); }
  };

  if (loading) return <div style={{ padding: '3rem', textAlign: 'center', color: '#6B7280' }}>Loading…</div>;

  const btnStyle: React.CSSProperties = {
    padding: '0.6rem 1.5rem', background: saving ? '#9CA3AF' : '#E81C79', color: '#fff',
    border: 'none', borderRadius: '8px', fontWeight: 700, fontSize: '0.9rem',
    cursor: saving ? 'not-allowed' : 'pointer', transition: 'background 0.2s',
  };

  return (
    <div style={{ padding: '2rem 1rem', maxWidth: '680px', margin: '0 auto', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
      <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#111', margin: '0 0 0.25rem' }}>Company Profile</h1>
      <p style={{ color: '#6B7280', fontSize: '0.9rem', margin: '0 0 1.75rem' }}>Edit your public profile and legal details.</p>

      {error && <p style={{ color: '#ef4444', fontSize: '0.9rem', marginBottom: '1rem' }}>{error}</p>}

      <form onSubmit={handleSave}>
        <div style={cardStyle}>
          <p style={{ fontSize: '1rem', fontWeight: 700, color: '#111', margin: '0 0 1.25rem', paddingBottom: '0.6rem', borderBottom: '1px solid #F3F4F6' }}>Public Identity</p>

          <div style={{ marginBottom: '1rem' }}>
            <label style={labelStyle}>Display Name *</label>
            <input name="displayName" value={form.displayName} onChange={handleChange} onFocus={focus} onBlur={blur} placeholder="Acme Corp" required style={inputStyle} />
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label style={labelStyle}>
              Handle *
              <span style={{ fontWeight: 400, color: '#9CA3AF', fontSize: '0.8rem' }}> — /programs/</span>
              <span style={{ color: '#E81C79', fontSize: '0.8rem' }}>{form.handle || 'your-handle'}</span>
            </label>
            <input name="handle" value={form.handle} onChange={handleHandleChange} onFocus={focus} onBlur={blur} placeholder="acme-corp" required pattern="[a-z0-9-]+" title="Lowercase letters, numbers and hyphens only" style={inputStyle} />
          </div>
          <div style={{ marginBottom: '0' }}>
            <label style={labelStyle}>About Your Company</label>
            <textarea name="description" value={form.description} onChange={handleChange} onFocus={focus} onBlur={blur} placeholder="Brief description…" rows={3} style={{ ...inputStyle, resize: 'vertical' }} />
          </div>
        </div>

        <div style={cardStyle}>
          <p style={{ fontSize: '1rem', fontWeight: 700, color: '#111', margin: '0 0 1.25rem', paddingBottom: '0.6rem', borderBottom: '1px solid #F3F4F6' }}>Legal Information</p>

          <div style={{ marginBottom: '1rem' }}>
            <label style={labelStyle}>Legal Company Name *</label>
            <input name="legalName" value={form.legalName} onChange={handleChange} onFocus={focus} onBlur={blur} placeholder="Acme Corporation LLC" required style={inputStyle} />
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label style={labelStyle}>Street Address *</label>
            <input name="legalAddress" value={form.legalAddress} onChange={handleChange} onFocus={focus} onBlur={blur} placeholder="123 Main Street" required style={inputStyle} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
            <div>
              <label style={labelStyle}>City *</label>
              <input name="city" value={form.city} onChange={handleChange} onFocus={focus} onBlur={blur} placeholder="New York" required style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Country *</label>
              <input name="country" value={form.country} onChange={handleChange} onFocus={focus} onBlur={blur} placeholder="US" required style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Postal Code</label>
              <input name="postalCode" value={form.postalCode} onChange={handleChange} onFocus={focus} onBlur={blur} placeholder="10001" style={inputStyle} />
            </div>
          </div>
        </div>

        {msg && <p style={{ color: '#10b981', fontSize: '0.88rem', margin: '0 0 0.75rem' }}>{msg}</p>}
        <button type="submit" disabled={saving} style={btnStyle}>
          {saving ? 'Saving…' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
};

export default CompanyProfilePage;
