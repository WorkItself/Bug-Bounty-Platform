import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';

interface Program {
  id: number;
  programName: string;
  programDescription?: string;
  programScope?: string;
  website?: string;
  rewardCritical?: number;
  rewardHigh?: number;
  rewardMedium?: number;
  rewardLow?: number;
  rewardInformational?: number;
  ownerId: number;
  isActive: boolean;
  ownerDisplayName?: string;
  ownerHandle?: string;
}

const fmt = (n: number) => n >= 1000 ? '$' + (n / 1000).toFixed(n % 1000 === 0 ? 0 : 1) + 'k' : '$' + n;

const TIERS = [
  { key: 'rewardCritical',      label: 'Critical',      color: '#dc2626', bg: '#FEF2F2' },
  { key: 'rewardHigh',          label: 'High',          color: '#ea580c', bg: '#FFF7ED' },
  { key: 'rewardMedium',        label: 'Medium',        color: '#d97706', bg: '#FFFBEB' },
  { key: 'rewardLow',           label: 'Low',           color: '#1091cc', bg: '#EFF6FF' },
  { key: 'rewardInformational', label: 'Informational', color: '#6b7280', bg: '#F9FAFB' },
] as const;

const BountyDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [program, setProgram] = useState<Program | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosInstance.get(`/program?id=${id}`)
      .then(res => setProgram(res.data))
      .catch(() => setProgram(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div style={{ padding: '3rem', textAlign: 'center', color: '#6B7280' }}>Loading…</div>;

  if (!program) {
    return (
      <div style={{ maxWidth: '1000px', margin: '0 auto', textAlign: 'center', padding: '3rem' }}>
        <h1 style={{ color: '#ef4444' }}>Program Not Found</h1>
        <button onClick={() => navigate('/bounties')} style={{ padding: '0.75rem 1.5rem', background: '#3F3AFC', color: '#fff', border: 'none', borderRadius: '0.5rem', cursor: 'pointer', fontWeight: 600 }}>
          Back to Programs
        </button>
      </div>
    );
  }

  const card: React.CSSProperties = {
    background: '#fff', borderRadius: '12px', border: '1px solid #E5E7EB',
    padding: '1.75rem 2rem', marginBottom: '1.25rem',
    boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
  };

  const activeTiers = TIERS.filter(t => program[t.key] != null);

  return (
    <div style={{ width: '100%', maxWidth: '900px', margin: '0 auto', padding: '1.5rem 1rem' }}>
      <button onClick={() => navigate('/bounties')} style={{ marginBottom: '1.5rem', padding: '0.45rem 1rem', background: 'transparent', color: '#3F3AFC', border: '1.5px solid #3F3AFC', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '0.88rem' }}>
        ← Back to Programs
      </button>

      {/* Header */}
      <div style={{ ...card, background: 'linear-gradient(135deg, #3F3AFC 0%, #1e1acc 100%)', border: 'none', color: '#fff' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ margin: '0 0 0.35rem', fontSize: '2rem', fontWeight: 800 }}>{program.programName}</h1>
            {program.ownerDisplayName && program.ownerHandle && (
              <Link to={`/programs/${program.ownerHandle}`} style={{ display: 'inline-block', marginBottom: '0.4rem', color: 'rgba(255,255,255,0.75)', fontSize: '0.85rem', textDecoration: 'none', fontWeight: 500, borderBottom: '1px solid rgba(255,255,255,0.35)' }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#fff'}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.75)'}
              >
                by {program.ownerDisplayName}
              </Link>
            )}
            {program.programDescription && (
              <p style={{ margin: 0, opacity: 0.85, fontSize: '0.97rem', lineHeight: 1.6, maxWidth: '600px' }}>{program.programDescription}</p>
            )}
            {program.website && (
              <a href={program.website} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.6rem', color: 'rgba(255,255,255,0.85)', fontSize: '0.85rem', textDecoration: 'none', borderBottom: '1px solid rgba(255,255,255,0.4)' }}>
                🌐 {program.website}
              </a>
            )}
          </div>
          <span style={{ padding: '0.35rem 0.9rem', borderRadius: '20px', background: program.isActive ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)', fontSize: '0.8rem', fontWeight: 700, whiteSpace: 'nowrap' }}>
            {program.isActive ? 'Active' : 'Inactive'}
          </span>
        </div>
      </div>

      {/* Reward tiers */}
      {activeTiers.length > 0 && (
        <div style={card}>
          <h2 style={{ margin: '0 0 1rem', fontSize: '1.1rem', fontWeight: 700, color: '#111' }}>Reward Tiers</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {activeTiers.map(({ key, label, color, bg }) => (
              <div key={key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.65rem 1rem', borderRadius: '8px', background: bg }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: color, display: 'inline-block' }} />
                  <span style={{ fontWeight: 600, color: '#374151', fontSize: '0.9rem' }}>{label}</span>
                </div>
                <span style={{ fontWeight: 800, fontSize: '1.1rem', color }}>{fmt(program[key]!)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Scope */}
      {program.programScope && (
        <div style={card}>
          <h2 style={{ margin: '0 0 0.75rem', fontSize: '1.1rem', fontWeight: 700, color: '#111' }}>Scope</h2>
          <p style={{ margin: 0, color: '#374151', lineHeight: 1.7, whiteSpace: 'pre-line' }}>{program.programScope}</p>
        </div>
      )}

      {/* CTA */}
      <div style={{ ...card, textAlign: 'center' }}>
        <h2 style={{ margin: '0 0 0.5rem', fontSize: '1.1rem', fontWeight: 700, color: '#111' }}>Ready to participate?</h2>
        <p style={{ color: '#6B7280', margin: '0 0 1.25rem', fontSize: '0.93rem' }}>
          Find a vulnerability in {program.programName} and submit your report.
        </p>
        <button
          onClick={() => navigate(`/submit?programId=${program.id}`)}
          style={{ padding: '0.7rem 2rem', background: '#3F3AFC', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 700, fontSize: '0.97rem' }}
          onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = '#2F2AEC'}
          onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = '#3F3AFC'}
        >
          Submit a Report
        </button>
      </div>
    </div>
  );
};

export default BountyDetail;
