import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import axiosInstance from '../utils/axiosInstance';

const AddProject = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const [formData, setFormData] = useState({
    programName: '',
    programDescription: '',
    programScope: '',
    minReward: '',
    maxReward: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const min = parseFloat(formData.minReward);
    const max = parseFloat(formData.maxReward);
    if (min > max) { setError('Min reward cannot be greater than max reward.'); return; }

    setLoading(true);
    setError('');
    try {
      await axiosInstance.post('/program', {
        programName: formData.programName,
        programDescription: formData.programDescription,
        programScope: formData.programScope,
        minReward: min,
        maxReward: max,
        ownerId: parseInt(user.id ?? '0'),
        isActive: true,
      });
      navigate('/company/dashboard');
    } catch (err: any) {
      setError(err.response?.data ?? 'Failed to create program.');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '0.8rem 1rem', marginBottom: '1.5rem',
    background: '#101822', border: '1px solid #333', borderRadius: '8px',
    color: '#e0e0e0', fontSize: '1rem', boxSizing: 'border-box', fontFamily: 'inherit',
  };

  return (
    <div style={{ padding: '2rem', color: '#e0e0e0' }}>
      <h1 style={{ textAlign: 'center', fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '2rem' }}>
        Create a New Bounty Program
      </h1>

      <form onSubmit={handleSubmit} style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem', background: 'linear-gradient(145deg, #1e2a3a, #101822)', borderRadius: '12px', boxShadow: '0 8px 30px rgba(0,0,0,0.3)' }}>

        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '1.05rem' }}>Program Name *</label>
          <input type="text" name="programName" value={formData.programName} onChange={handleChange} placeholder="e.g., Acme Corp Security Program" required style={inputStyle} />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '1.05rem' }}>Description</label>
          <textarea name="programDescription" value={formData.programDescription} onChange={handleChange} placeholder="Describe your program, its goals, and what you're looking for." rows={4} style={{ ...inputStyle, resize: 'vertical' }} />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '1.05rem' }}>Scope</label>
          <textarea name="programScope" value={formData.programScope} onChange={handleChange} placeholder="List what assets, domains, or services are in scope." rows={3} style={{ ...inputStyle, resize: 'vertical' }} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '1.05rem' }}>Min Reward (USD) *</label>
            <input type="number" name="minReward" value={formData.minReward} onChange={handleChange} placeholder="e.g., 100" required min="0" style={inputStyle} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '1.05rem' }}>Max Reward (USD) *</label>
            <input type="number" name="maxReward" value={formData.maxReward} onChange={handleChange} placeholder="e.g., 10000" required min="0" style={inputStyle} />
          </div>
        </div>

        {error && <p style={{ color: '#ef4444', marginBottom: '1rem' }}>{error}</p>}

        <button type="submit" disabled={loading} style={{ width: '100%', padding: '1rem', background: loading ? '#555' : 'linear-gradient(90deg, #00C9FF 0%, #92FE9D 100%)', border: 'none', borderRadius: '8px', color: '#101822', fontSize: '1.1rem', fontWeight: 'bold', cursor: loading ? 'not-allowed' : 'pointer', transition: 'transform 0.2s' }}
          onMouseOver={e => { if (!loading) e.currentTarget.style.transform = 'scale(1.02)'; }}
          onMouseOut={e => { e.currentTarget.style.transform = 'scale(1)'; }}
        >
          {loading ? 'Launching…' : 'Launch Program'}
        </button>
      </form>
    </div>
  );
};

export default AddProject;
