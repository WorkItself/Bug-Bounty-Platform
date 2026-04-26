import { useSearchParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useUser } from '../context/UserContext';
import axiosInstance from '../utils/axiosInstance';

const severityMap: Record<string, number> = { low: 1, medium: 2, high: 3, critical: 4 };

const SubmitReport = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useUser();
  const programId = searchParams.get('programId');

  const [programName, setProgramName] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    severity: 'medium',
    vulnerabilityType: '',
    stepsToReproduce: '',
    impact: '',
    proofOfConcept: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (programId) {
      axiosInstance.get(`/program?id=${programId}`)
        .then(res => setProgramName(res.data?.programName ?? null))
        .catch(() => {});
    }
  }, [programId]);

  if (!user.isLoggedIn) {
    return <div style={{ textAlign: 'center', padding: '3rem' }}><h1 style={{ color: '#ef4444' }}>Please log in to submit reports</h1></div>;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!programId) { setError('No program selected.'); return; }

    const fullDescription = [
      formData.description,
      formData.vulnerabilityType ? `\n\n**Type:** ${formData.vulnerabilityType}` : '',
      formData.stepsToReproduce ? `\n\n**Steps to Reproduce:**\n${formData.stepsToReproduce}` : '',
      formData.impact ? `\n\n**Impact:**\n${formData.impact}` : '',
      formData.proofOfConcept ? `\n\n**Proof of Concept:**\n${formData.proofOfConcept}` : '',
    ].join('');

    setLoading(true);
    setError('');
    try {
      await axiosInstance.post('/report', {
        title: formData.title,
        description: fullDescription,
        severity: severityMap[formData.severity],
        status: 1,
        programId: parseInt(programId),
        reporterId: parseInt(user.id ?? '0'),
      });
      navigate('/my-submissions');
    } catch (err: any) {
      setError(err.response?.data ?? 'Failed to submit report.');
    } finally {
      setLoading(false);
    }
  };

  const field: React.CSSProperties = { width: '100%', padding: '0.75rem', background: '#0C1A30', border: '1px solid #009B77', borderRadius: '0.5rem', color: '#FFFFFF', fontSize: '1rem', boxSizing: 'border-box', fontFamily: 'inherit' };

  return (
    <div style={{ width: '100%', maxWidth: '1000px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '0.75rem', color: '#FFFFFF' }}>Submit Vulnerability Report</h1>

      {programName && (
        <p style={{ color: '#009B77', fontSize: '1.1rem', marginBottom: '2rem', fontWeight: 600 }}>
          Program: <span style={{ color: '#A2DFF7' }}>{programName}</span>
        </p>
      )}

      <form onSubmit={handleSubmit} style={{ background: 'linear-gradient(135deg, #1B3A57 0%, #0C1A30 100%)', padding: '2rem', borderRadius: '0.75rem', border: '1px solid #009B77' }}>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ color: '#A2DFF7', display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Vulnerability Title *</label>
          <input type="text" name="title" value={formData.title} onChange={handleChange} placeholder="e.g., SQL Injection in Login Form" required style={field} />
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ color: '#A2DFF7', display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Vulnerability Type *</label>
          <input type="text" name="vulnerabilityType" value={formData.vulnerabilityType} onChange={handleChange} placeholder="e.g., SQL Injection, XSS, CSRF" required style={field} />
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ color: '#A2DFF7', display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Severity Level *</label>
          <select name="severity" value={formData.severity} onChange={handleChange} style={field}>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ color: '#A2DFF7', display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Description *</label>
          <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Detailed description of the vulnerability" required rows={4} style={field} />
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ color: '#A2DFF7', display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Steps to Reproduce *</label>
          <textarea name="stepsToReproduce" value={formData.stepsToReproduce} onChange={handleChange} placeholder="Step-by-step instructions to reproduce the issue" required rows={4} style={field} />
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ color: '#A2DFF7', display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Impact Assessment *</label>
          <textarea name="impact" value={formData.impact} onChange={handleChange} placeholder="Explain the potential impact and damage" required rows={3} style={field} />
        </div>

        <div style={{ marginBottom: '2rem' }}>
          <label style={{ color: '#A2DFF7', display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Proof of Concept</label>
          <textarea name="proofOfConcept" value={formData.proofOfConcept} onChange={handleChange} placeholder="Code or instructions demonstrating the vulnerability (optional)" rows={3} style={field} />
        </div>

        {error && <p style={{ color: '#ef4444', marginBottom: '1rem' }}>{error}</p>}

        <button type="submit" disabled={loading} style={{ padding: '0.75rem 2rem', background: loading ? '#555' : '#009B77', color: '#fff', border: 'none', borderRadius: '0.5rem', fontWeight: 600, fontSize: '1rem', cursor: loading ? 'not-allowed' : 'pointer' }}>
          {loading ? 'Submitting…' : 'Submit Report'}
        </button>
      </form>
    </div>
  );
};

export default SubmitReport;
