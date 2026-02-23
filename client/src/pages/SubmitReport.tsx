import { useSearchParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useUser } from '../context/UserContext';

const SubmitReport = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useUser();
  const bountyId = searchParams.get('bountyId');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    severity: 'medium',
    vulnerability_type: '',
    steps_to_reproduce: '',
    impact: '',
    proof_of_concept: '',
  });

  const bountyPrograms: Record<string, string> = {
    '1': 'Google',
    '2': 'Meta',
    '3': 'Shopify',
    '4': 'Tesla',
  };

  const selectedBounty = bountyId ? bountyPrograms[bountyId] : null;

  if (!user.isLoggedIn) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem' }}>
        <h1 style={{ color: '#ef4444' }}>Please log in to submit reports</h1>
      </div>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Report submitted for ${selectedBounty || 'a bounty program'}! Thank you for your contribution.`);
    navigate('/my-submissions');
  };

  return (
    <div style={{ maxWidth: '1000px' }}>
      <h1 style={{
        fontSize: '2.2rem',
        fontWeight: '800',
        marginBottom: '0.75rem',
        letterSpacing: '-0.02em',
        color: '#FFFFFF'
      }}>Submit Vulnerability Report</h1>
      
      {selectedBounty && (
        <p style={{
          color: '#009B77',
          fontSize: '1.1rem',
          marginBottom: '2rem',
          fontWeight: '600'
        }}>Program: <span style={{ color: '#A2DFF7' }}>{selectedBounty}</span></p>
      )}
      
      <p style={{
        color: '#A2DFF7',
        fontSize: '1rem',
        marginBottom: '2rem',
        fontWeight: '500'
      }}>Report a security vulnerability to our team securely.</p>

      <form onSubmit={handleSubmit} style={{
        background: 'linear-gradient(135deg, #1B3A57 0%, #0C1A30 100%)',
        padding: '2rem',
        borderRadius: '0.75rem',
        border: '1px solid #009B77'
      }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ color: '#A2DFF7', display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
            Vulnerability Title *
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g., SQL Injection in Login Form"
            required
            style={{
              width: '100%',
              padding: '0.75rem',
              background: '#0C1A30',
              border: '1px solid #009B77',
              borderRadius: '0.5rem',
              color: '#FFFFFF',
              fontSize: '1rem',
              boxSizing: 'border-box'
            }}
          />
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ color: '#A2DFF7', display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
            Vulnerability Type *
          </label>
          <input
            type="text"
            name="vulnerability_type"
            value={formData.vulnerability_type}
            onChange={handleChange}
            placeholder="e.g., SQL Injection, XSS, CSRF"
            required
            style={{
              width: '100%',
              padding: '0.75rem',
              background: '#0C1A30',
              border: '1px solid #009B77',
              borderRadius: '0.5rem',
              color: '#FFFFFF',
              fontSize: '1rem',
              boxSizing: 'border-box'
            }}
          />
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ color: '#A2DFF7', display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
            Severity Level *
          </label>
          <select
            name="severity"
            value={formData.severity}
            onChange={handleChange}
            style={{
              width: '100%',
              padding: '0.75rem',
              background: '#0C1A30',
              border: '1px solid #009B77',
              borderRadius: '0.5rem',
              color: '#FFFFFF',
              fontSize: '1rem',
              boxSizing: 'border-box'
            }}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ color: '#A2DFF7', display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
            Description *
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Detailed description of the vulnerability"
            required
            rows={4}
            style={{
              width: '100%',
              padding: '0.75rem',
              background: '#0C1A30',
              border: '1px solid #009B77',
              borderRadius: '0.5rem',
              color: '#FFFFFF',
              fontSize: '1rem',
              boxSizing: 'border-box',
              fontFamily: 'inherit'
            }}
          />
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ color: '#A2DFF7', display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
            Steps to Reproduce *
          </label>
          <textarea
            name="steps_to_reproduce"
            value={formData.steps_to_reproduce}
            onChange={handleChange}
            placeholder="Step-by-step instructions to reproduce the issue"
            required
            rows={4}
            style={{
              width: '100%',
              padding: '0.75rem',
              background: '#0C1A30',
              border: '1px solid #009B77',
              borderRadius: '0.5rem',
              color: '#FFFFFF',
              fontSize: '1rem',
              boxSizing: 'border-box',
              fontFamily: 'inherit'
            }}
          />
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ color: '#A2DFF7', display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
            Impact Assessment *
          </label>
          <textarea
            name="impact"
            value={formData.impact}
            onChange={handleChange}
            placeholder="Explain the potential impact and damage"
            required
            rows={3}
            style={{
              width: '100%',
              padding: '0.75rem',
              background: '#0C1A30',
              border: '1px solid #009B77',
              borderRadius: '0.5rem',
              color: '#FFFFFF',
              fontSize: '1rem',
              boxSizing: 'border-box',
              fontFamily: 'inherit'
            }}
          />
        </div>

        <div style={{ marginBottom: '2rem' }}>
          <label style={{ color: '#A2DFF7', display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
            Proof of Concept
          </label>
          <textarea
            name="proof_of_concept"
            value={formData.proof_of_concept}
            onChange={handleChange}
            placeholder="Code or detailed instructions demonstrating the vulnerability (optional)"
            rows={3}
            style={{
              width: '100%',
              padding: '0.75rem',
              background: '#0C1A30',
              border: '1px solid #009B77',
              borderRadius: '0.5rem',
              color: '#FFFFFF',
              fontSize: '1rem',
              boxSizing: 'border-box',
              fontFamily: 'inherit'
            }}
          />
        </div>

        <button
          type="submit"
          style={{
            padding: '0.75rem 2rem',
            background: '#009B77',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: '0.5rem',
            fontWeight: '600',
            fontSize: '1rem',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            (e.target as HTMLElement).style.background = '#007A60';
            (e.target as HTMLElement).style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            (e.target as HTMLElement).style.background = '#009B77';
            (e.target as HTMLElement).style.transform = 'translateY(0)';
          }}
        >
          Submit Report
        </button>
      </form>
    </div>
  );
};

export default SubmitReport;
