import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';

interface Report {
  id: number;
  title: string;
  description?: string;
  severity: number;
  status: number;
  programId: number;
}

const severityLabel: Record<number, { label: string; color: string }> = {
  1: { label: 'Low',      color: '#52c41a' },
  2: { label: 'Medium',   color: '#ffcc00' },
  3: { label: 'High',     color: '#ff8c1a' },
  4: { label: 'Critical', color: '#ff4d4d' },
};

const statusLabel: Record<number, string> = {
  1: 'New', 2: 'Triaged', 3: 'Accepted', 4: 'Fixed', 5: 'Rewarded', 6: 'Rejected',
};

const MySubmissions = () => {
  const navigate = useNavigate();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosInstance.get('/report/my')
      .then(res => setReports(res.data ?? []))
      .catch(() => setReports([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ width: '100%', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '0.75rem', color: '#FFFFFF' }}>My Submissions</h1>
      <p style={{ color: '#A2DFF7', fontSize: '1rem', marginBottom: '2rem', fontWeight: 500 }}>
        Track your vulnerability reports and bounty status.
      </p>

      {loading ? (
        <p style={{ color: '#A2DFF7', textAlign: 'center' }}>Loading…</p>
      ) : reports.length === 0 ? (
        <div style={{ background: 'linear-gradient(135deg, #1B3A57 0%, #0C1A30 100%)', padding: '2rem', borderRadius: '0.75rem', border: '1px solid #009B77', textAlign: 'center' }}>
          <p style={{ color: '#A2DFF7' }}>No submissions yet. Start by reporting a vulnerability.</p>
          <button onClick={() => navigate('/bounties')} style={{ marginTop: '1rem', padding: '0.6rem 1.5rem', background: '#009B77', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}>
            Browse Programs
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {reports.map(r => {
            const sev = severityLabel[r.severity] ?? { label: 'Unknown', color: '#999' };
            return (
              <div key={r.id} style={{ background: 'linear-gradient(145deg, #1e2a3a, #101822)', borderRadius: '12px', padding: '1.25rem 1.5rem', display: 'grid', gridTemplateColumns: '1fr auto auto', alignItems: 'center', gap: '1rem', borderLeft: `5px solid ${sev.color}` }}>
                <div>
                  <h3 style={{ margin: '0 0 0.25rem', fontSize: '1.05rem', color: '#fff' }}>{r.title}</h3>
                  <span style={{ fontSize: '0.8rem', color: '#A2DFF7' }}>Program #{r.programId}</span>
                </div>
                <span style={{ padding: '0.3rem 0.8rem', borderRadius: '6px', background: sev.color, color: '#101822', fontWeight: 700, fontSize: '0.85rem', whiteSpace: 'nowrap' }}>
                  {sev.label}
                </span>
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#A2DFF7', whiteSpace: 'nowrap' }}>
                  {statusLabel[r.status] ?? 'Unknown'}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MySubmissions;
