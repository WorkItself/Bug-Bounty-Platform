import { useState, useEffect } from 'react';
import { useUser } from '../context/UserContext';
import axiosInstance from '../utils/axiosInstance';

interface Program { id: number; programName: string; }
interface Report {
  id: number; title: string; description?: string;
  severity: number; status: number; reporterId: number;
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

const ViewReports = () => {
  const { user } = useUser();
  const [programs, setPrograms] = useState<Program[]>([]);
  const [selectedProgram, setSelectedProgram] = useState<number | null>(null);
  const [reports, setReports] = useState<Report[]>([]);
  const [filter, setFilter] = useState<number | 'all'>('all');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    axiosInstance.get('/program/getAll')
      .then(res => {
        const mine = (res.data ?? []).filter((p: any) => p.ownerId === parseInt(user.id ?? '0'));
        setPrograms(mine);
        if (mine.length > 0) setSelectedProgram(mine[0].id);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!selectedProgram) return;
    setLoading(true);
    axiosInstance.get(`/report/program/${selectedProgram}`)
      .then(res => setReports(res.data ?? []))
      .catch(() => setReports([]))
      .finally(() => setLoading(false));
  }, [selectedProgram]);

  const handleStatusUpdate = async (report: Report, newStatus: number) => {
    try {
      await axiosInstance.put('/report', { ...report, status: newStatus });
      setReports(prev => prev.map(r => r.id === report.id ? { ...r, status: newStatus } : r));
    } catch {}
  };

  const filtered = filter === 'all' ? reports : reports.filter(r => r.status === filter);

  return (
    <div style={{ width: '100%', maxWidth: '1400px', margin: '0 auto', padding: '2rem', color: '#e0e0e0' }}>
      <h1 style={{ textAlign: 'center', fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>
        Submitted Bug Reports
      </h1>

      {programs.length > 0 && (
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <label style={{ color: '#A2DFF7', fontWeight: 600 }}>Program:</label>
          <select value={selectedProgram ?? ''} onChange={e => setSelectedProgram(parseInt(e.target.value))}
            style={{ padding: '0.5rem 1rem', background: '#1e2a3a', border: '1px solid #333', borderRadius: '8px', color: '#e0e0e0', fontSize: '0.95rem' }}>
            {programs.map(p => <option key={p.id} value={p.id}>{p.programName}</option>)}
          </select>
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        {[['all', 'All'], [1, 'New'], [2, 'Triaged'], [3, 'Accepted'], [6, 'Rejected']].map(([val, label]) => (
          <button key={val} onClick={() => setFilter(val as any)} style={{ padding: '0.45rem 1.25rem', background: filter === val ? 'linear-gradient(90deg, #00C9FF 0%, #92FE9D 100%)' : '#1e2a3a', color: filter === val ? '#101822' : '#e0e0e0', border: '1px solid #333', borderRadius: '20px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.85rem' }}>
            {label}
          </button>
        ))}
      </div>

      {loading ? (
        <p style={{ textAlign: 'center', color: '#A2DFF7' }}>Loading…</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {filtered.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#a0a0a0', padding: '2rem' }}>No reports found.</p>
          ) : filtered.map(report => {
            const sev = severityLabel[report.severity] ?? { label: 'Unknown', color: '#999' };
            return (
              <div key={report.id} style={{ background: 'linear-gradient(145deg, #1e2a3a, #101822)', borderRadius: '12px', padding: '1.5rem', display: 'grid', gridTemplateColumns: '1fr auto auto', alignItems: 'center', gap: '1rem', borderLeft: `5px solid ${sev.color}` }}>
                <div>
                  <h3 style={{ margin: '0 0 0.25rem', fontSize: '1.1rem' }}>{report.title}</h3>
                  <p style={{ margin: 0, color: '#a0a0a0', fontSize: '0.85rem' }}>Reporter #{report.reporterId}</p>
                </div>
                <span style={{ padding: '0.3rem 0.8rem', borderRadius: '6px', background: sev.color, color: '#101822', fontWeight: 700, fontSize: '0.85rem', whiteSpace: 'nowrap' }}>
                  {sev.label}
                </span>
                {report.status === 1 ? (
                  <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <button onClick={() => handleStatusUpdate(report, 3)} style={{ padding: '0.45rem 1rem', background: '#4caf50', border: 'none', borderRadius: '6px', color: '#fff', cursor: 'pointer', fontWeight: 600 }}>Accept</button>
                    <button onClick={() => handleStatusUpdate(report, 6)} style={{ padding: '0.45rem 1rem', background: '#f44336', border: 'none', borderRadius: '6px', color: '#fff', cursor: 'pointer', fontWeight: 600 }}>Reject</button>
                  </div>
                ) : (
                  <span style={{ fontWeight: 700, color: report.status === 3 ? '#4caf50' : report.status === 6 ? '#f44336' : '#A2DFF7', whiteSpace: 'nowrap' }}>
                    {statusLabel[report.status] ?? 'Unknown'}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ViewReports;
