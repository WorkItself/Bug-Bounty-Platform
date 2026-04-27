import { useState } from 'react';
import { useUser } from '../context/UserContext';
import { useSupport } from '../context/SupportContext';
import { MessageSquare } from 'lucide-react';

const CATEGORIES = [
  'General Question',
  'Report Issue',
  'Payment / Reward',
  'Account Problem',
  'Program Dispute',
  'Other',
];

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '0.65rem 0.85rem',
  background: '#fff', border: '1.5px solid #D1D5DB',
  borderRadius: '8px', color: '#111', fontSize: '0.92rem',
  fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box',
  transition: 'border-color 0.2s',
};

const labelStyle: React.CSSProperties = {
  display: 'block', fontSize: '0.82rem', fontWeight: 600,
  color: '#374151', marginBottom: '0.3rem',
};

const ContactSupport = () => {
  const { user } = useUser();
  const { submitRequest } = useSupport();

  const [form, setForm] = useState({ category: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!user.isLoggedIn) {
    return (
      <div style={{ padding: '3rem 2rem', textAlign: 'center', color: '#6B7280' }}>
        Please log in to contact support.
      </div>
    );
  }

  if (user.type === 'admin') {
    return (
      <div style={{ padding: '3rem 2rem', textAlign: 'center', color: '#6B7280' }}>
        Admins should use the support requests dashboard.
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.message.trim()) return;
    setLoading(true);
    setTimeout(() => {
      submitRequest(
        `[${form.category || 'General'}] ${form.subject}\n\n${form.message}`,
        { name: user.name ?? '', email: (user as any).email ?? '' }
      );
      setLoading(false);
      setSent(true);
    }, 400);
  };

  const focus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    (e.currentTarget.style.borderColor = '#3F3AFC');
  const blur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    (e.currentTarget.style.borderColor = '#D1D5DB');

  if (sent) {
    return (
      <div style={{ maxWidth: '560px', margin: '4rem auto', padding: '0 1rem', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', textAlign: 'center' }}>
        <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: '16px', padding: '3rem 2rem', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: '#DCFCE7', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
            <span style={{ fontSize: '1.5rem' }}>✓</span>
          </div>
          <h2 style={{ margin: '0 0 0.5rem', fontSize: '1.2rem', fontWeight: 700, color: '#111' }}>Request Submitted</h2>
          <p style={{ margin: '0 0 1.5rem', color: '#6B7280', fontSize: '0.92rem' }}>
            Our team will review your request and get back to you shortly.
          </p>
          <button
            onClick={() => { setSent(false); setForm({ category: '', subject: '', message: '' }); }}
            style={{ padding: '0.6rem 1.4rem', background: '#3F3AFC', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 700, fontSize: '0.88rem', cursor: 'pointer' }}
          >
            Submit Another
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '680px', margin: '0 auto', padding: '2rem 1rem', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
        <MessageSquare size={22} color="#3F3AFC" />
        <h1 style={{ margin: 0, fontSize: '1.6rem', fontWeight: 800, color: '#111', letterSpacing: '-0.02em' }}>Contact Support</h1>
      </div>
      <p style={{ margin: '0 0 1.75rem', color: '#6B7280', fontSize: '0.9rem' }}>
        Describe your issue and the BountyOS team will respond.
      </p>

      <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: '12px', padding: '1.75rem', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>

        {/* From (read-only) */}
        <div style={{ marginBottom: '1.25rem', padding: '0.75rem 1rem', background: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: '8px' }}>
          <p style={{ margin: '0 0 0.1rem', fontSize: '0.75rem', fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.05em' }}>From</p>
          <p style={{ margin: 0, fontSize: '0.9rem', color: '#111', fontWeight: 500 }}>{user.name}</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <label style={labelStyle}>Category</label>
              <select
                value={form.category}
                onChange={e => setForm(p => ({ ...p, category: e.target.value }))}
                onFocus={focus} onBlur={blur}
                style={{ ...inputStyle, appearance: 'auto', color: form.category ? '#111' : '#9CA3AF' }}
              >
                <option value="" disabled>Select…</option>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Subject <span style={{ color: '#E81C79' }}>*</span></label>
              <input
                required
                value={form.subject}
                onChange={e => setForm(p => ({ ...p, subject: e.target.value }))}
                onFocus={focus} onBlur={blur}
                placeholder="Brief summary"
                style={inputStyle}
              />
            </div>
          </div>

          <div style={{ marginBottom: '1.25rem' }}>
            <label style={labelStyle}>Message <span style={{ color: '#E81C79' }}>*</span></label>
            <textarea
              required
              value={form.message}
              onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
              onFocus={focus} onBlur={blur}
              placeholder="Describe the issue in detail…"
              rows={6}
              style={{ ...inputStyle, resize: 'vertical' }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              padding: '0.6rem 1.5rem', background: loading ? '#9CA3AF' : '#3F3AFC',
              color: '#fff', border: 'none', borderRadius: '8px',
              fontWeight: 700, fontSize: '0.9rem',
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
          >
            {loading ? 'Sending…' : 'Submit Request'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ContactSupport;
