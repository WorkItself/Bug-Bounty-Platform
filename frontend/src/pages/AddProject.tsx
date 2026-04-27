import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import axiosInstance from '../utils/axiosInstance';

const SEVERITY_TIERS = [
  { key: 'rewardCritical',      label: 'Critical',      color: '#dc2626', placeholder: 'e.g. 10000' },
  { key: 'rewardHigh',          label: 'High',          color: '#ea580c', placeholder: 'e.g. 5000'  },
  { key: 'rewardMedium',        label: 'Medium',        color: '#d97706', placeholder: 'e.g. 1000'  },
  { key: 'rewardLow',           label: 'Low',           color: '#1091cc', placeholder: 'e.g. 200'   },
  { key: 'rewardInformational', label: 'Informational', color: '#6b7280', placeholder: 'e.g. 50'    },
] as const;

type TierKey = typeof SEVERITY_TIERS[number]['key'];

const AddProject = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const [formData, setFormData] = useState({
    programName: '',
    programDescription: '',
    programScope: '',
    website: '',
    rewardCritical: '',
    rewardHigh: '',
    rewardMedium: '',
    rewardLow: '',
    rewardInformational: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const toDecimal = (v: string) => v.trim() === '' ? null : parseFloat(v);
      await axiosInstance.post('/program', {
        programName: formData.programName,
        programDescription: formData.programDescription || null,
        programScope: formData.programScope || null,
        website: formData.website || null,
        rewardCritical:      toDecimal(formData.rewardCritical),
        rewardHigh:          toDecimal(formData.rewardHigh),
        rewardMedium:        toDecimal(formData.rewardMedium),
        rewardLow:           toDecimal(formData.rewardLow),
        rewardInformational: toDecimal(formData.rewardInformational),
        ownerId: parseInt(user.id ?? '0'),
        isActive: true,
      });
      navigate('/company/dashboard');
    } catch (err: any) {
      const d = err.response?.data;
      setError(d?.message ?? (typeof d === 'string' ? d : null) ?? 'Failed to create program.');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '0.65rem 0.85rem',
    background: '#fff', border: '1px solid #D1D5DB', borderRadius: '7px',
    color: '#111', fontSize: '0.92rem', boxSizing: 'border-box', fontFamily: 'inherit',
    outline: 'none',
  };
  const labelStyle: React.CSSProperties = {
    display: 'block', marginBottom: '0.35rem', fontSize: '0.85rem', fontWeight: 600, color: '#374151',
  };

  return (
    <div style={{ maxWidth: '720px', margin: '0 auto', padding: '2rem 1.5rem', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
      <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#111', margin: '0 0 0.4rem' }}>Create Bounty Program</h1>
      <p style={{ color: '#6B7280', fontSize: '0.93rem', margin: '0 0 2rem' }}>
        Define your program details and set rewards per vulnerability severity.
      </p>

      <form onSubmit={handleSubmit} style={{ background: '#fff', borderRadius: '12px', border: '1px solid #E5E7EB', padding: '2rem', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>

        <div style={{ marginBottom: '1.25rem' }}>
          <label style={labelStyle}>Program Name *</label>
          <input type="text" name="programName" value={formData.programName} onChange={handleChange}
            placeholder="e.g., Acme Corp Security Program" required style={inputStyle} />
        </div>

        <div style={{ marginBottom: '1.25rem' }}>
          <label style={labelStyle}>Description</label>
          <textarea name="programDescription" value={formData.programDescription} onChange={handleChange}
            placeholder="Describe your program, its goals, and what you're looking for." rows={3}
            style={{ ...inputStyle, resize: 'vertical' }} />
        </div>

        <div style={{ marginBottom: '1.25rem' }}>
          <label style={labelStyle}>Website</label>
          <input type="url" name="website" value={formData.website} onChange={handleChange}
            placeholder="https://example.com" style={inputStyle} />
        </div>

        <div style={{ marginBottom: '1.75rem' }}>
          <label style={labelStyle}>Scope</label>
          <textarea name="programScope" value={formData.programScope} onChange={handleChange}
            placeholder="List assets, domains, or services in scope (one per line)." rows={3}
            style={{ ...inputStyle, resize: 'vertical' }} />
        </div>

        {/* Severity-based rewards */}
        <div style={{ marginBottom: '1.5rem', padding: '1.25rem', background: '#F9FAFB', borderRadius: '8px', border: '1px solid #E5E7EB' }}>
          <p style={{ margin: '0 0 1rem', fontSize: '0.85rem', fontWeight: 700, color: '#374151', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Reward Tiers (USD) — leave blank to omit a tier
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            {SEVERITY_TIERS.map(({ key, label, color, placeholder }) => (
              <div key={key}>
                <label style={{ ...labelStyle, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: color, display: 'inline-block', flexShrink: 0 }} />
                  {label}
                </label>
                <input type="number" name={key} value={formData[key as TierKey]} onChange={handleChange}
                  placeholder={placeholder} min="0" step="1" style={inputStyle} />
              </div>
            ))}
          </div>
        </div>

        {error && <p style={{ color: '#ef4444', fontSize: '0.88rem', marginBottom: '1rem' }}>{error}</p>}

        <button type="submit" disabled={loading} style={{
          width: '100%', padding: '0.8rem', background: loading ? '#9CA3AF' : '#009B77',
          color: '#fff', border: 'none', borderRadius: '8px',
          fontWeight: 700, fontSize: '1rem', cursor: loading ? 'not-allowed' : 'pointer',
        }}>
          {loading ? 'Launching…' : 'Launch Program'}
        </button>
      </form>
    </div>
  );
};

export default AddProject;
